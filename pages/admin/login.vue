<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-amber-100">
          <svg class="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Administration
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Un Goût de Liberté - Accès sécurisé
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
            placeholder="Entrez votre mot de passe"
            :disabled="loading"
          />
        </div>

        <!-- Message d'erreur -->
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading || !password"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connexion...
            </span>
            <span v-else>Se connecter</span>
          </button>
        </div>

        <div class="text-center">
          <NuxtLink to="/" class="text-sm text-amber-600 hover:text-amber-500">
            ← Retour au site
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
  middleware: 'guest' // Rediriger si déjà connecté
})

// État réactif
const password = ref('')
const loading = ref(false)
const error = ref('')

// Gestion de la connexion
const handleLogin = async () => {
  if (!password.value) return
  
  try {
    loading.value = true
    error.value = ''
    
    const response = await $fetch('/api/admin/auth/login', {
      method: 'POST',
      body: {
        password: password.value
      }
    })
    
    if (response.success) {
      // Redirection vers l'admin
      await navigateTo('/admin')
    }
    
  } catch (err) {
    console.error('Erreur de connexion:', err)
    
    if (err.statusCode === 401) {
      error.value = 'Mot de passe incorrect'
      // Effacer le champ après 2 secondes
      setTimeout(() => {
        password.value = ''
      }, 2000)
    } else {
      error.value = 'Erreur de connexion. Veuillez réessayer.'
    }
  } finally {
    loading.value = false
  }
}

// Focus automatique sur le champ mot de passe
onMounted(() => {
  document.getElementById('password')?.focus()
})

// Gestion du raccourci clavier Entrée
onMounted(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading.value && password.value) {
      handleLogin()
    }
  }
  
  document.addEventListener('keydown', handleKeyDown)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })
})
</script>
