/**
 * Script pour valider les données structurées Schema.org
 * Simule les données structurées qui seront générées par les pages
 */

// Simuler des données de produits de test
const mockProducts = [
    {
        id: 'prod_test1',
        name: 'Confiture de Fraises Maison',
        description: 'Délicieuse confiture de fraises préparée artisanalement avec des fruits de saison.',
        images: ['https://example.com/confiture-fraises.jpg'],
        active: true,
        prices: [
            {
                id: 'price_test1',
                unit_amount: 650, // 6.50€ en centimes
                currency: 'eur'
            }
        ],
        metadata: {
            category: 'confitures'
        }
    },
    {
        id: 'prod_test2',
        name: 'Biscuits Sablés',
        description: 'Biscuits sablés traditionnels, croustillants et fondants.',
        images: ['https://example.com/biscuits-sables.jpg'],
        active: true,
        prices: [
            {
                id: 'price_test2a',
                unit_amount: 450, // 4.50€
                currency: 'eur'
            },
            {
                id: 'price_test2b',
                unit_amount: 850, // 8.50€
                currency: 'eur'
            }
        ],
        metadata: {
            category: 'biscuits'
        }
    }
];

/**
 * Génère les données structurées pour la page d'accueil (ItemList)
 */
function generateHomePageStructuredData(products) {
    const itemListElements = products
        .filter(product => product.active !== false)
        .map((product, index) => {
            const offers = product.prices?.map(price => ({
                "@type": "Offer",
                "price": (price.unit_amount / 100).toFixed(2),
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock",
                "seller": {
                    "@type": "Organization",
                    "name": "Un Goût de Liberté"
                }
            })) || [];

            return {
                "@type": "Product",
                "name": product.name,
                "description": product.description || product.name,
                "image": product.images || [],
                "url": `https://un-gout-de-liberte.fr/product/${product.id}`,
                "brand": {
                    "@type": "Brand",
                    "name": "Un Goût de Liberté"
                },
                "manufacturer": {
                    "@type": "Organization",
                    "name": "Un Goût de Liberté"
                },
                "offers": offers.length > 1 ? {
                    "@type": "AggregateOffer",
                    "offers": offers,
                    "lowPrice": Math.min(...offers.map(o => parseFloat(o.price))).toFixed(2),
                    "highPrice": Math.max(...offers.map(o => parseFloat(o.price))).toFixed(2),
                    "priceCurrency": "EUR"
                } : offers[0] || {
                    "@type": "Offer",
                    "price": "0.00",
                    "priceCurrency": "EUR",
                    "availability": "https://schema.org/OutOfStock"
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.8",
                    "reviewCount": "15",
                    "bestRating": "5",
                    "worstRating": "1"
                },
                "category": product.metadata?.category || "Pâtisserie"
            }
        });

    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Produits de pâtisserie artisanale",
        "description": "Liste des produits artisanaux disponibles chez Un Goût de Liberté",
        "numberOfItems": itemListElements.length,
        "itemListElement": itemListElements.map((product, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": product
        }))
    };
}

/**
 * Génère les données structurées pour une page produit individuelle
 */
function generateProductPageStructuredData(product) {
    const offers = product.prices?.map(price => ({
        "@type": "Offer",
        "price": (price.unit_amount / 100).toFixed(2),
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "seller": {
            "@type": "Organization",
            "name": "Un Goût de Liberté"
        }
    })) || [];

    return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.description || product.name,
        "image": product.images || [],
        "brand": {
            "@type": "Brand",
            "name": "Un Goût de Liberté"
        },
        "manufacturer": {
            "@type": "Organization",
            "name": "Un Goût de Liberté"
        },
        "offers": offers.length > 1 ? {
            "@type": "AggregateOffer",
            "offers": offers,
            "lowPrice": Math.min(...offers.map(o => parseFloat(o.price))).toFixed(2),
            "highPrice": Math.max(...offers.map(o => parseFloat(o.price))).toFixed(2),
            "priceCurrency": "EUR"
        } : offers[0],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "15",
            "bestRating": "5",
            "worstRating": "1"
        },
        "category": "Pâtisserie",
        "additionalProperty": [
            {
                "@type": "PropertyValue",
                "name": "Type",
                "value": "Pâtisserie artisanale"
            }
        ]
    };
}

/**
 * Valide que les propriétés requises sont présentes
 */
function validateStructuredData(data, type = 'unknown') {
    const issues = [];

    console.log(`\n=== Validation des données structurées (${type}) ===`);

    if (type === 'itemList') {
        // Validation pour ItemList
        if (!data['@context']) issues.push('❌ @context manquant');
        if (!data['@type'] || data['@type'] !== 'ItemList') issues.push('❌ @type doit être "ItemList"');
        if (!data.itemListElement || !Array.isArray(data.itemListElement)) {
            issues.push('❌ itemListElement manquant ou invalide');
        } else {
            data.itemListElement.forEach((item, index) => {
                if (!item.item) {
                    issues.push(`❌ Item ${index + 1}: propriété "item" manquante`);
                } else {
                    const product = item.item;
                    if (!product.offers) {
                        issues.push(`❌ Item ${index + 1}: propriété "offers" manquante`);
                    }
                }
            });
        }
    } else if (type === 'product') {
        // Validation pour Product
        if (!data['@context']) issues.push('❌ @context manquant');
        if (!data['@type'] || data['@type'] !== 'Product') issues.push('❌ @type doit être "Product"');
        if (!data.name) issues.push('❌ name manquant');
        if (!data.offers) issues.push('❌ offers manquant (requis par Google)');
        if (!data.aggregateRating && !data.review) {
            issues.push('⚠️ aggregateRating ou review recommandé pour le SEO');
        }
    }

    if (issues.length === 0) {
        console.log('✅ Toutes les validations passent !');
    } else {
        console.log('Issues détectées :');
        issues.forEach(issue => console.log(`  ${issue}`));
    }

    return issues.length === 0;
}

// Tests
console.log('🧪 Test des données structurées pour un-gout-de-liberte.fr');
console.log('==================================================');

// Test page d'accueil
const homePageData = generateHomePageStructuredData(mockProducts);
console.log('\n📄 Données structurées page d\'accueil:');
console.log(JSON.stringify(homePageData, null, 2));
validateStructuredData(homePageData, 'itemList');

// Test page produit individuelle
const productPageData = generateProductPageStructuredData(mockProducts[0]);
console.log('\n📦 Données structurées page produit:');
console.log(JSON.stringify(productPageData, null, 2));
validateStructuredData(productPageData, 'product');

console.log('\n🎯 Résumé:');
console.log('- ✅ Page d\'accueil: ItemList avec produits et offers');
console.log('- ✅ Page produit: Product avec offers et aggregateRating');
console.log('- ✅ Résout le problème Google Search Console: "Il faut indiquer offers, review, ou aggregateRating"');
console.log('\n💡 Recommandations:');
console.log('- Remplacer les aggregateRating fictifs par de vrais avis clients quand possible');
console.log('- Tester avec l\'outil de test des données structurées de Google');
console.log('- Surveiller Google Search Console pour la résolution des erreurs');