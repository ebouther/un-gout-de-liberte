import Stripe from 'stripe'
import { stripeRetry, getStripeLimiter } from '~/server/utils/stripe-retry.js'

const stripe = new Stripe(process.env.STRIPE_SK || process.env.STRIPE_SECRET_KEY)

export default defineEventHandler(async (event) => {
    try {
        const productId = getRouterParam(event, 'id')
        const body = await readBody(event)
        const { name, description, active, images, metadata, prices } = body

        if (!productId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'ID du produit requis'
            })
        }

        // Validation des données
        if (!name || !Array.isArray(prices) || prices.length === 0) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Nom du produit et au moins un prix requis'
            })
        }

        const rateLimiter = getStripeLimiter(stripe)

        // Mettre à jour le produit avec retry
        const product = await rateLimiter.execute(() =>
            stripe.products.update(productId, {
                name,
                description: description || undefined,
                active: active ?? true,
                images: images?.filter(img => img.trim()) || [],
                metadata: {
                    ...metadata,
                    updated_by: 'admin_interface',
                    updated_at: new Date().toISOString()
                }
            })
        )

        console.log(`✅ Produit mis à jour: ${productId}`)

        // Récupérer les prix existants avec retry - ADMIN voit tout
        const existingPrices = await rateLimiter.execute(() =>
            stripe.prices.list({
                product: productId,
                // Pas de filtre active: true pour pouvoir gérer les prix inactifs
                limit: 100
            })
        )

        // Traiter les prix un par un pour éviter les rate limits
        const processedPrices = []
        console.log(`🔍 Traitement de ${prices.length} prix(s)`)

        for (const priceData of prices) {
            console.log(`🔍 Traitement du prix:`, priceData)
            try {
                if (priceData.id) {
                    // Prix existant - vérifier si le unit_amount a changé
                    const existingPrice = existingPrices.data.find(p => p.id === priceData.id)
                    if (existingPrice) {
                        const newUnitAmount = Math.round(priceData.unit_amount)
                        const oldUnitAmount = existingPrice.unit_amount

                        if (newUnitAmount !== oldUnitAmount) {
                            // Le prix a changé - il faut créer un nouveau prix et désactiver l'ancien
                            console.log(`💰 Prix changé de ${oldUnitAmount} à ${newUnitAmount} centimes, création d'un nouveau prix`)

                            // Créer le nouveau prix
                            const newPrice = await rateLimiter.execute(() =>
                                stripe.prices.create({
                                    unit_amount: newUnitAmount,
                                    currency: 'eur',
                                    product: productId,
                                    nickname: priceData.nickname || undefined,
                                    active: priceData.active ?? true,
                                    metadata: {
                                        weight: priceData.weight,
                                        updated_by: 'admin_interface',
                                        replaced_price: priceData.id // Référence vers l'ancien prix
                                    }
                                })
                            )

                            // Désactiver l'ancien prix
                            await rateLimiter.execute(() =>
                                stripe.prices.update(priceData.id, {
                                    active: false,
                                    metadata: {
                                        ...existingPrice.metadata,
                                        replaced_by: newPrice.id,
                                        deactivated_by: 'admin_interface',
                                        deactivated_at: new Date().toISOString()
                                    }
                                })
                            )

                            processedPrices.push(newPrice)
                            console.log(`✅ Nouveau prix créé: ${newPrice.id}, ancien prix désactivé: ${priceData.id}`)
                        } else {
                            // Le prix n'a pas changé, juste mettre à jour les autres champs
                            const updatedPrice = await rateLimiter.execute(() =>
                                stripe.prices.update(priceData.id, {
                                    nickname: priceData.nickname || undefined,
                                    active: priceData.active ?? true,
                                    metadata: {
                                        weight: priceData.weight,
                                        updated_by: 'admin_interface'
                                    }
                                })
                            )
                            processedPrices.push(updatedPrice)
                            console.log(`✅ Prix mis à jour (sans changement de montant): ${priceData.id}`)
                        }
                    }
                } else {
                    // Nouveau prix
                    const newPrice = await rateLimiter.execute(() =>
                        stripe.prices.create({
                            unit_amount: Math.round(priceData.unit_amount), // Déjà en centimes
                            currency: 'eur',
                            product: productId,
                            nickname: priceData.nickname || undefined,
                            active: priceData.active ?? true,
                            metadata: {
                                weight: priceData.weight,
                                created_by: 'admin_interface'
                            }
                        })
                    )
                    processedPrices.push(newPrice)
                    console.log(`✅ Nouveau prix créé: ${newPrice.id}`)
                }
            } catch (error) {
                console.error(`❌ Erreur lors du traitement du prix:`, error.message)

                // Pour les rate limits, interrompre le processus
                if (error.type === 'StripeError' && error.code === 'rate_limit') {
                    throw error
                }

                // Pour autres erreurs, continuer mais logger
                console.warn(`Continuing despite error for price ${priceData.id || 'new'}`)
            }
        }

        // Désactiver les prix qui ne sont plus dans la liste (avec retry)
        const priceIdsToKeep = prices.filter(p => p.id).map(p => p.id)
        const pricesToDeactivate = existingPrices.data.filter(
            p => p.active && !priceIdsToKeep.includes(p.id)
        )

        for (const priceToDeactivate of pricesToDeactivate) {
            try {
                await rateLimiter.execute(() =>
                    stripe.prices.update(priceToDeactivate.id, {
                        active: false,
                        metadata: {
                            ...priceToDeactivate.metadata,
                            deactivated_by: 'admin_interface',
                            deactivated_at: new Date().toISOString()
                        }
                    })
                )
                console.log(`✅ Prix désactivé: ${priceToDeactivate.id}`)
            } catch (error) {
                console.warn(`⚠️ Erreur lors de la désactivation du prix ${priceToDeactivate.id}:`, error.message)
            }
        }

        return {
            success: true,
            data: {
                product,
                prices: processedPrices
            }
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour du produit:', error)

        // Gestion spécifique des rate limits
        if (error.type === 'StripeError' && error.code === 'rate_limit') {
            throw createError({
                statusCode: 429,
                statusMessage: 'Trop de requêtes à Stripe. Veuillez patienter et réessayer.'
            })
        }

        if (error.type === 'StripeCardError') {
            throw createError({
                statusCode: 400,
                statusMessage: 'Erreur de validation Stripe: ' + error.message
            })
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors de la mise à jour du produit: ' + (error.message || 'Erreur inconnue')
        })
    }
})
