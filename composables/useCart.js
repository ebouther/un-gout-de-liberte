// Composable pour la gestion du panier - Utilise le store Pinia existant
import { useStore } from '~/store/cart'

export const useCart = () => {
    // Ajouter un produit au panier en utilisant le store Pinia
    const addItem = (product, quantity = 1) => {
        try {
            if (!product || !product.id) {
                console.error('Produit invalide pour l\'ajout au panier:', product)
                return false
            }

            // Utiliser le store Pinia
            const store = useStore()

            // Créer un identifiant unique pour le produit (avec variante si applicable)
            const itemId = product.variant?.id
                ? `${product.id}-${product.variant.id}`
                : product.id

            // Préparer le prix dans le format attendu par le panier existant
            const priceObj = product.variant?.price || {
                unit_amount: Math.round(product.price * 100), // Convertir en centimes
                currency: 'eur'
            }

            // Préparer l'objet pour le store avec la structure exacte attendue
            const itemToAdd = {
                id: itemId,
                product: {
                    id: product.id,
                    name: product.name,
                    images: product.image ? [product.image] : [],
                    ...product
                },
                price: priceObj,
                quantity: quantity
            }

            console.log('Ajout au panier via store:', itemToAdd)
            console.log('État du store avant ajout:', store.items)

            // Utiliser la méthode addItem du store
            store.addItem(itemToAdd)

            console.log(`✓ Produit "${product.name}" ajouté au panier (quantité: ${quantity})`)
            console.log('État du store après ajout:', store.items)
            console.log('Nombre d\'items dans le panier:', store.nbOfItems)

            return true
        } catch (error) {
            console.error('Erreur lors de l\'ajout au panier:', error)
            return false
        }
    }

    // Fonction utilitaire pour obtenir les items du panier depuis le store
    const getCartItems = () => {
        try {
            const store = useStore()
            return store.items || {}
        } catch {
            return {}
        }
    }

    // Fonction utilitaire pour obtenir le nombre d'items depuis le store
    const getCartCount = () => {
        try {
            const store = useStore()
            return store.nbOfItems || 0
        } catch {
            return 0
        }
    }

    return {
        addItem,
        getCartItems,
        getCartCount
    }
}
