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
              <div class="flex items-center justify-between mb-6">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  {{ article ? 'Modifier l\'article' : 'Nouvel article' }}
                </DialogTitle>
                <button
                  @click="$emit('close')"
                  class="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <form @submit.prevent="handleSubmit" class="space-y-6">
                <!-- Messages d'erreur -->
                <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {{ errorMessage }}
                </div>

                <!-- Titre -->
                <div>
                  <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                    Titre de l'article *
                  </label>
                  <input
                    id="title"
                    v-model="form.title"
                    type="text"
                    required
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                      placeholder="Entrez le titre de l'article"
                    />
                  </div>

                  <!-- Slug -->
                  <div>
                    <label for="slug" class="block text-sm font-medium text-gray-700 mb-2">
                      Slug (URL) *
                    </label>
                    <input
                      id="slug"
                      v-model="form.slug"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                      placeholder="slug-de-l-article"
                    />
                    <p class="text-sm text-gray-500 mt-1">
                      L'URL sera : /blog/{{ form.slug || 'slug-de-l-article' }}
                    </p>
                  </div>

                  <!-- Description -->
                  <div>
                    <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                      Description (résumé) *
                    </label>
                    <textarea
                      id="description"
                      v-model="form.description"
                      required
                      rows="3"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                      placeholder="Résumé de l'article qui apparaîtra dans la liste"
                    ></textarea>
                  </div>

                  <!-- Métadonnées sur une ligne -->
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <!-- Catégorie -->
                    <div>
                      <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
                        Catégorie
                      </label>
                      <select
                        id="category"
                        v-model="form.category"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                      >
                        <option value="">Choisir une catégorie</option>
                        <option value="recettes">Recettes</option>
                        <option value="actualites">Actualités</option>
                        <option value="evenements">Événements</option>
                        <option value="conseils">Conseils</option>
                        <option value="general">Général</option>
                      </select>
                    </div>

                    <!-- Statut -->
                    <div>
                      <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
                        Statut *
                      </label>
                      <select
                        id="status"
                        v-model="form.status"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                      >
                        <option value="draft">Brouillon</option>
                        <option value="published">Publié</option>
                      </select>
                    </div>

                    <!-- Date -->
                    <div>
                      <label for="date" class="block text-sm font-medium text-gray-700 mb-2">
                        Date de publication *
                      </label>
                      <input
                        id="date"
                        v-model="form.date"
                        type="datetime-local"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                      />
                    </div>
                  </div>

                  <!-- Image -->
                  <div>
                    <label for="image" class="block text-sm font-medium text-gray-700 mb-2">
                      Image de couverture (URL)
                    </label>
                    <input
                      id="image"
                      v-model="form.image"
                      type="url"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <!-- Contenu -->
                  <div>
                    <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
                      Contenu (Markdown) *
                    </label>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <!-- Éditeur -->
                      <div>
                        <textarea
                          id="content"
                          v-model="form.content"
                          required
                          rows="20"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold font-mono text-sm"
                          placeholder="Contenu de l'article en Markdown..."
                        ></textarea>
                      </div>
                    
                    <!-- Prévisualisation -->
                    <div class="hidden lg:block">
                      <div class="text-sm font-medium text-gray-700 mb-2">Aperçu</div>
                      <div class="border border-gray-300 rounded-md p-3 bg-gray-50 h-80 overflow-y-auto prose prose-sm max-w-none">
                        <div v-if="form.content" v-html="markdownPreview"></div>
                        <div v-else class="text-gray-500 italic">La prévisualisation apparaîtra ici...</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div class="flex items-center gap-4">
                    <button
                      type="button"
                      @click="$emit('close')"
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      :disabled="saving"
                      class="px-4 py-2 text-sm font-medium text-white bg-gold border border-transparent rounded-md hover:bg-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                      {{ saving ? 'Enregistrement...' : (article ? 'Mettre à jour' : 'Créer l\'article') }}
                    </button>
                  </div>
                  
                  <!-- Actions supplémentaires pour l'édition -->
                  <div v-if="article" class="flex items-center gap-2">
                    <button
                      type="button"
                      @click="deleteArticle"
                      class="px-3 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Supprimer
                    </button>
                  </div>
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
  show: {
    type: Boolean,
    default: false
  },
  article: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

// État réactif
const form = ref({
  title: '',
  slug: '',
  description: '',
  category: '',
  status: 'draft',
  date: '',
  image: '',
  content: ''
})

const saving = ref(false)
const errorMessage = ref('')

// Computed pour la prévisualisation markdown (simple)
const markdownPreview = computed(() => {
  let html = form.value.content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
  html = html
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, '<p>$1</p>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto" />')
  return html
})

// Générer le slug automatiquement depuis le titre
watch(() => form.value.title, (newTitle) => {
  if (newTitle && !props.article) {
    form.value.slug = newTitle
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^a-z0-9\s-]/g, '') // Garder seulement lettres, chiffres, espaces et tirets
      .replace(/\s+/g, '-') // Remplacer espaces par tirets
      .replace(/-+/g, '-') // Éviter les tirets multiples
      .replace(/^-|-$/g, '') // Supprimer tirets en début/fin
  }
})

// Initialiser le formulaire quand l'article change
watch(() => props.article, (newArticle) => {
  if (newArticle) {
    form.value = {
      title: newArticle.title || '',
      slug: newArticle.slug || '',
      description: newArticle.summary || newArticle.description || '',
      category: newArticle.category || '',
      status: newArticle.status || 'draft',
      date: newArticle.date ? new Date(newArticle.date).toISOString().slice(0, 16) : '',
      image: newArticle.image || '',
      content: newArticle.content || ''
    }
  } else {
    // Réinitialiser pour un nouvel article
    form.value = {
      title: '',
      slug: '',
      description: '',
      category: '',
      status: 'draft',
      date: new Date().toISOString().slice(0, 16),
      image: '',
      content: ''
    }
  }
  errorMessage.value = ''
}, { immediate: true })

// Soumission du formulaire
const handleSubmit = async () => {
  try {
    saving.value = true
    errorMessage.value = ''

    // Validation
    if (!form.value.title.trim()) {
      throw new Error('Le titre est requis')
    }
    if (!form.value.slug.trim()) {
      throw new Error('Le slug est requis')
    }
    if (!form.value.description.trim()) {
      throw new Error('La description est requise')
    }
    if (!form.value.content.trim()) {
      throw new Error('Le contenu est requis')
    }

    // Préparer les données
    const articleData = {
      title: form.value.title.trim(),
      slug: form.value.slug.trim(),
      description: form.value.description.trim(),
      category: form.value.category || 'general',
      status: form.value.status,
      date: form.value.date,
      image: form.value.image.trim() || null,
      content: form.value.content.trim()
    }

    // Appel API
    const endpoint = props.article 
      ? `/api/admin/blog/articles/${props.article.slug}` 
      : '/api/admin/blog/articles'
    
    const method = props.article ? 'PUT' : 'POST'

    const response = await $fetch(endpoint, {
      method,
      body: articleData
    })

    if (response.success) {
      emit('saved', response.article)
      emit('close')
    } else {
      throw new Error(response.error || 'Erreur lors de la sauvegarde')
    }

  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    errorMessage.value = error.message || 'Une erreur est survenue'
  } finally {
    saving.value = false
  }
}

// Suppression d'article
const deleteArticle = async () => {
  if (!props.article) return
  
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.')) {
    return
  }

  try {
    saving.value = true
    
    const response = await $fetch(`/api/admin/blog/articles/${props.article.slug}`, {
      method: 'DELETE'
    })

    if (response.success) {
      emit('saved', null) // null indique une suppression
      emit('close')
    } else {
      throw new Error(response.error || 'Erreur lors de la suppression')
    }

  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    errorMessage.value = error.message || 'Erreur lors de la suppression'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.prose h1 { 
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.prose h2 { 
  font-size: 1.125rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.prose h3 { 
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.prose p { 
  margin-bottom: 0.5rem;
}
.prose strong { 
  font-weight: bold;
}
.prose em { 
  font-style: italic;
}
</style>
