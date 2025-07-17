<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Contactez-nous</h1>
      <p class="text-xl text-gray-600">
        Pour vos commandes personnalisées et renseignements
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Informations de contact -->
      <div class="space-y-8">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Un Goût de Liberté</h2>
          
          <div class="space-y-4">
            <div class="flex items-start space-x-3">
              <svg class="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p class="font-semibold text-gray-900">Adresse</p>
                <p class="text-gray-600">43380 CHILHAC<br>Haute-Loire, Auvergne-Rhône-Alpes</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <svg class="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div>
                <p class="font-semibold text-gray-900">Pâtissière</p>
                <p class="text-gray-600">Justine DUMESNIL</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <svg class="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p class="font-semibold text-gray-900">Horaires</p>
                <p class="text-gray-600">Sur commande uniquement</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <svg class="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p class="font-semibold text-gray-900">Spécialités</p>
                <p class="text-gray-600">Pâtisserie & Biscuiterie artisanale<br>Créations au gré des saisons</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Zone de livraison -->
        <div class="bg-amber-50 p-6 rounded-lg">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Zone de livraison</h3>
          <p class="text-gray-700">
            Nous livrons principalement dans la région de la Haute-Loire et les départements limitrophes.
            <strong>Livraison possible dans toute la France</strong> pour vos commandes spéciales.
          </p>
        </div>
      </div>

      <!-- Formulaire de contact -->
      <div class="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
        <h3 class="text-xl font-bold text-gray-900 mb-6">Demande de renseignements</h3>
        
        <form @submit.prevent="submitForm" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              Nom complet *
            </label>
            <input
              type="text"
              id="name"
              v-model="form.name"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              placeholder="Votre nom"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              v-model="form.email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              placeholder="votre@email.fr"
            />
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              id="phone"
              v-model="form.phone"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              placeholder="06 XX XX XX XX"
            />
          </div>

          <div>
            <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
              Sujet *
            </label>
            <select
              id="subject"
              v-model="form.subject"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            >
              <option value="">Choisissez un sujet</option>
              <option value="commande">Commande personnalisée</option>
              <option value="renseignement">Renseignement produit</option>
              <option value="livraison">Question livraison</option>
              <option value="autre">Autre demande</option>
            </select>
          </div>

          <div>
            <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              id="message"
              v-model="form.message"
              required
              rows="5"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors resize-none"
              placeholder="Décrivez votre demande..."
            ></textarea>
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-amber-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="!isSubmitting">Envoyer ma demande</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Envoi en cours...
            </span>
          </button>
        </form>

        <p class="text-sm text-gray-500 mt-4">
          * Champs obligatoires. Vos données sont traitées confidentiellement.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const form = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)

// Métadonnées SEO
useHead({
  title: 'Contact - Un Goût de Liberté - Pâtisserie artisanale CHILHAC',
  meta: [
    { name: 'description', content: 'Contactez Un Goût de Liberté pour vos commandes de pâtisserie artisanale à CHILHAC. Justine DUMESNIL, pâtissière professionnelle en Haute-Loire.' },
    { name: 'keywords', content: 'contact pâtisserie, commande CHILHAC, Justine DUMESNIL, pâtissière Haute-Loire, livraison pâtisserie' },
    { property: 'og:title', content: 'Contact - Un Goût de Liberté' },
    { property: 'og:description', content: 'Contactez Un Goût de Liberté pour vos commandes de pâtisserie artisanale à CHILHAC' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://un-gout-de-liberte.fr/contact' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: 'Contact - Un Goût de Liberté' },
    { name: 'twitter:description', content: 'Contactez Un Goût de Liberté pour vos commandes de pâtisserie artisanale' }
  ],
  link: [
    { rel: 'canonical', href: 'https://un-gout-de-liberte.fr/contact' }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact - Un Goût de Liberté",
        "description": "Contactez Un Goût de Liberté pour vos commandes de pâtisserie artisanale",
        "url": "https://un-gout-de-liberte.fr/contact",
        "mainEntity": {
          "@type": "Bakery",
          "name": "Un Goût de Liberté",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "",
            "addressLocality": "CHILHAC",
            "postalCode": "43380",
            "addressRegion": "Haute-Loire",
            "addressCountry": "FR"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 45.1167,
            "longitude": 3.4333
          },
          "founder": {
            "@type": "Person",
            "name": "Justine DUMESNIL"
          }
        }
      })
    }
  ]
})

async function submitForm() {
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  
  try {
    // Ici vous pouvez implémenter l'envoi du formulaire
    // Par exemple via une API route ou un service d'email
    console.log('Formulaire soumis:', form.value)
    
    // Simuler un délai d'envoi
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Réinitialiser le formulaire
    form.value = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    }
    
    alert('Votre message a été envoyé avec succès !')
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi:', error)
    alert('Une erreur est survenue. Veuillez réessayer.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
