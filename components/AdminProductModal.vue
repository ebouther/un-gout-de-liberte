<template>
  <TransitionRoot as="template" :show="show">
    <Dialog as="div" class="relative z-50" @close="$emit('close')">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-6">
                {{ product ? 'Modifier le produit' : 'Nouveau produit' }}
              </DialogTitle>

              <form @submit.prevent="saveProduct" class="space-y-6">
                <!-- Informations de base -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Nom du produit -->
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Nom du produit *
                    </label>
                    <input
                      v-model="form.name"
                      type="text"
                      required
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Ex: Confiture d'abricots"
                    >
                  </div>

                  <!-- Description -->
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      v-model="form.description"
                      rows="3"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Description détaillée du produit..."
                    ></textarea>
                  </div>

                  <!-- Catégorie -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Catégorie
                    </label>
                    <select
                      v-model="form.category"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      <option value="confitures">Confitures</option>
                      <option value="biscuits">Biscuits</option>
                      <option value="fruits-sirop">Fruits au sirop</option>
                      <option value="conserves">Conserves</option>
                      <option value="epicerie">Épicerie</option>
                      <option value="patisserie">Pâtisserie</option>
                    </select>
                  </div>

                  <!-- Statut -->
                  <div class="flex items-center">
                    <input
                      v-model="form.active"
                      type="checkbox"
                      id="active"
                      class="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    >
                    <label for="active" class="ml-2 block text-sm text-gray-700">
                      Produit actif (visible sur le site)
                    </label>
                  </div>
                </div>

                <!-- Ingrédients et informations -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Ingrédients -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Ingrédients
                    </label>
                    <textarea
                      v-model="form.ingredients"
                      rows="3"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Liste des ingrédients..."
                    ></textarea>
                  </div>

                  <!-- Allergènes -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Allergènes
                    </label>
                    <textarea
                      v-model="form.allergens"
                      rows="3"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Peut contenir des traces de..."
                    ></textarea>
                  </div>

                  <!-- Informations complémentaires -->
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Informations complémentaires
                    </label>
                    <textarea
                      v-model="form.information"
                      rows="2"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Informations de conservation, origine, etc."
                    ></textarea>
                  </div>
                </div>

                <!-- Images -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Images du produit
                  </label>
                  <div class="space-y-2">
                    <div v-for="(image, index) in form.images" :key="index" class="flex gap-2">
                      <input
                        v-model="form.images[index]"
                        type="url"
                        class="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        :placeholder="`URL de l'image ${index + 1}`"
                      >
                      <button
                        v-if="form.images.length > 1"
                        type="button"
                        @click="removeImage(index)"
                        class="px-3 py-2 text-red-600 hover:text-red-800"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                    <button
                      type="button"
                      @click="addImage"
                      class="text-sm text-amber-600 hover:text-amber-800 font-medium"
                    >
                      + Ajouter une image
                    </button>
                  </div>
                </div>

                <!-- Prix et variantes -->
                <div>
                  <div class="flex justify-between items-center mb-4">
                    <h4 class="text-lg font-medium text-gray-900">Prix et variantes</h4>
                    <button
                      type="button"
                      @click="addPrice"
                      class="bg-amber-600 hover:bg-amber-700 text-white text-sm px-3 py-2 rounded-md font-medium"
                    >
                      + Ajouter un prix
                    </button>
                  </div>

                  <div class="space-y-4">
                    <div
                      v-for="(price, index) in form.prices"
                      :key="index"
                      class="border border-gray-200 rounded-lg p-4"
                    >
                      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">
                            Nom de la variante
                          </label>
                          <input
                            v-model="price.nickname"
                            type="text"
                            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            placeholder="Ex: 350g"
                          >
                        </div>

                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">
                            Prix (€) *
                          </label>
                          <input
                            v-model.number="price.unit_amount"
                            type="number"
                            step="0.01"
                            min="0"
                            required
                            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            placeholder="4.50"
                          >
                        </div>

                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">
                            Poids *
                          </label>
                          <input
                            v-model="price.weight"
                            type="text"
                            required
                            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            placeholder="350g"
                          >
                        </div>

                        <div class="flex items-end">
                          <label class="flex items-center">
                            <input
                              v-model="price.active"
                              type="checkbox"
                              class="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                            >
                            <span class="ml-2 text-sm text-gray-700">Actif</span>
                          </label>
                          
                          <button
                            v-if="form.prices.length > 1"
                            type="button"
                            @click="removePrice(index)"
                            class="ml-auto px-2 py-2 text-red-600 hover:text-red-800"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Boutons d'action -->
                <div class="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    @click="$emit('close')"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  
                  <button
                    type="submit"
                    :disabled="saving"
                    class="px-4 py-2 text-sm font-medium text-white bg-amber-600 border border-transparent rounded-md hover:bg-amber-700 disabled:opacity-50"
                  >
                    <span v-if="saving">Enregistrement...</span>
                    <span v-else>{{ product ? 'Mettre à jour' : 'Créer' }}</span>
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

const props = defineProps({
  show: Boolean,
  product: Object
})

const emit = defineEmits(['close', 'saved'])

const saving = ref(false)

// Formulaire réactif
const form = reactive({
  name: '',
  description: '',
  category: '',
  active: true,
  ingredients: '',
  allergens: '',
  information: '',
  images: [''],
  prices: [{
    nickname: '',
    unit_amount: null,
    weight: '',
    active: true
  }]
})

// Initialiser le formulaire quand un produit est fourni
watch(() => props.product, (product) => {
  if (product) {
    Object.assign(form, {
      name: product.name || '',
      description: product.description || '',
      category: product.metadata?.category || '',
      active: product.active ?? true,
      ingredients: product.metadata?.Ingrédients || '',
      allergens: product.metadata?.Allergènes || '',
      information: product.metadata?.Information || '',
      images: product.images?.length ? [...product.images] : [''],
      prices: product.prices?.length ? product.prices.map(price => ({
        id: price.id,
        nickname: price.nickname || '',
        unit_amount: price.unit_amount ? price.unit_amount / 100 : null,
        weight: price.metadata?.weight || '',
        active: price.active ?? true
      })) : [{
        nickname: '',
        unit_amount: null,
        weight: '',
        active: true
      }]
    })
  } else {
    // Réinitialiser pour un nouveau produit
    Object.assign(form, {
      name: '',
      description: '',
      category: '',
      active: true,
      ingredients: '',
      allergens: '',
      information: '',
      images: [''],
      prices: [{
        nickname: '',
        unit_amount: null,
        weight: '',
        active: true
      }]
    })
  }
}, { immediate: true })

// Méthodes pour gérer les images
const addImage = () => {
  form.images.push('')
}

const removeImage = (index) => {
  form.images.splice(index, 1)
}

// Méthodes pour gérer les prix
const addPrice = () => {
  form.prices.push({
    nickname: '',
    unit_amount: null,
    weight: '',
    active: true
  })
}

const removePrice = (index) => {
  form.prices.splice(index, 1)
}

// Sauvegarder le produit
const saveProduct = async () => {
  try {
    saving.value = true

    // Nettoyer les images vides
    const cleanImages = form.images.filter(img => img.trim())

    // Préparer les données
    const productData = {
      name: form.name,
      description: form.description,
      active: form.active,
      images: cleanImages,
      metadata: {
        category: form.category,
        Ingrédients: form.ingredients,
        Allergènes: form.allergens,
        Information: form.information
      },
      prices: form.prices.map(price => ({
        ...price,
        unit_amount: Math.round(price.unit_amount * 100) // Convertir en centimes
      }))
    }

    // Endpoint API
    const endpoint = props.product 
      ? `/api/admin/products/${props.product.id}`
      : '/api/admin/products'
    
    const method = props.product ? 'PUT' : 'POST'

    await $fetch(endpoint, {
      method,
      body: productData
    })

    emit('saved')
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    // Ici tu peux ajouter une notification d'erreur
    alert('Erreur lors de la sauvegarde: ' + (error.data?.message || error.message))
  } finally {
    saving.value = false
  }
}
</script>
