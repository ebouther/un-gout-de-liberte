/**
 * Utilitaire pour gérer les retry avec backoff exponentiel
 * Spécialement conçu pour les rate limits Stripe
 */

/**
 * Exécute une fonction avec retry automatique en cas de rate limit
 * @param {Function} fn - Fonction à exécuter
 * @param {Object} options - Options de retry
 * @returns {Promise} - Résultat de la fonction ou erreur finale
 */
export const withRetry = async (fn, options = {}) => {
    const {
        maxRetries = 5,
        initialDelay = 1000, // 1 seconde
        maxDelay = 30000, // 30 secondes
        backoffMultiplier = 2,
        jitter = true
    } = options

    let lastError
    let delay = initialDelay

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const result = await fn()

            // Si succès, retourner le résultat
            return result

        } catch (error) {
            lastError = error

            // Si c'est le dernier essai, lancer l'erreur
            if (attempt === maxRetries) {
                throw error
            }

            // Vérifier si c'est une erreur de rate limit
            const isRateLimit =
                error.type === 'StripeError' &&
                (error.code === 'rate_limit' ||
                    error.message?.includes('rate limit') ||
                    error.statusCode === 429)

            if (!isRateLimit) {
                // Si ce n'est pas un rate limit, ne pas retry
                throw error
            }

            // Calculer le délai pour le prochain essai
            let waitTime = delay

            // Utiliser le header Retry-After si disponible
            if (error.headers && error.headers['retry-after']) {
                waitTime = parseInt(error.headers['retry-after']) * 1000
            }

            // Ajouter du jitter pour éviter les thundering herd
            if (jitter) {
                waitTime = waitTime + (Math.random() * 1000)
            }

            // Limiter le délai maximum
            waitTime = Math.min(waitTime, maxDelay)

            console.warn(`Rate limit atteinte, retry dans ${waitTime}ms (tentative ${attempt + 1}/${maxRetries + 1})`)

            // Attendre avant le prochain essai
            await new Promise(resolve => setTimeout(resolve, waitTime))

            // Augmenter le délai pour le prochain retry (backoff exponentiel)
            delay = Math.min(delay * backoffMultiplier, maxDelay)
        }
    }

    throw lastError
}

/**
 * Version spécialisée pour les appels Stripe
 */
export const stripeRetry = (fn, options = {}) => {
    return withRetry(fn, {
        maxRetries: 3,
        initialDelay: 2000, // 2 secondes pour Stripe
        maxDelay: 15000, // 15 secondes max
        backoffMultiplier: 2,
        jitter: true,
        ...options
    })
}

/**
 * Wrapper pour les appels Stripe avec rate limiting intelligent
 */
export class StripeRateLimiter {
    constructor(stripe, options = {}) {
        this.stripe = stripe
        this.requestQueue = []
        this.isProcessing = false
        this.minInterval = options.minInterval || 100 // 100ms entre les requêtes
        this.lastRequestTime = 0
    }

    /**
     * Exécute une requête Stripe avec gestion des rate limits
     */
    async execute(fn) {
        return new Promise((resolve, reject) => {
            this.requestQueue.push({ fn, resolve, reject })
            this.processQueue()
        })
    }

    async processQueue() {
        if (this.isProcessing || this.requestQueue.length === 0) {
            return
        }

        this.isProcessing = true

        while (this.requestQueue.length > 0) {
            const { fn, resolve, reject } = this.requestQueue.shift()

            try {
                // Attendre l'intervalle minimum entre les requêtes
                const now = Date.now()
                const timeSinceLastRequest = now - this.lastRequestTime

                if (timeSinceLastRequest < this.minInterval) {
                    await new Promise(res => setTimeout(res, this.minInterval - timeSinceLastRequest))
                }

                // Exécuter la requête avec retry
                const result = await stripeRetry(fn)
                this.lastRequestTime = Date.now()

                resolve(result)

            } catch (error) {
                reject(error)
            }

            // Petite pause entre chaque requête pour éviter les pics
            await new Promise(res => setTimeout(res, 50))
        }

        this.isProcessing = false
    }
}

/**
 * Instance globale du rate limiter Stripe
 */
let globalStripeLimiter = null

export const getStripeLimiter = (stripe) => {
    if (!globalStripeLimiter) {
        globalStripeLimiter = new StripeRateLimiter(stripe)
    }
    return globalStripeLimiter
}
