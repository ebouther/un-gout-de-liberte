<template>
  <div class="min-h-screen" style="background-color: var(--stone, #F4EFE8);">
    <!-- Navigation -->
    <nav style="background-color: var(--espresso, #3A2C24); border-color: var(--line, #D6CEC2);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo et navigation -->
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center space-x-2">
              <img src="/logo.png" alt="Logo" class="h-8 w-8">
              <span style="color: var(--cream, #F4EFE8);" class="font-semibold">Un Goût de Liberté</span>
            </NuxtLink>
            
            <div class="ml-10 flex items-baseline space-x-4">
              <NuxtLink 
                to="/admin" 
                style="color: var(--line, #D6CEC2);"
                class="hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                active-class="font-bold text-white"
              >
                Produits
              </NuxtLink>
              
              <NuxtLink 
                to="/admin?tab=blog" 
                style="color: var(--line, #D6CEC2);"
                class="hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                active-class="font-bold text-white"
              >
                Articles
              </NuxtLink>
              <NuxtLink 
                to="/admin?tab=orders" 
                style="color: var(--line, #D6CEC2);"
                class="hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                active-class="font-bold text-white"
              >
                Commandes
              </NuxtLink>
              <NuxtLink 
                to="/admin?tab=gallery" 
                style="color: var(--line, #D6CEC2);"
                class="hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                active-class="font-bold text-white"
              >
                Galerie
              </NuxtLink>
            </div>
          </div>

          <!-- Actions utilisateur -->
          <div class="flex items-center space-x-4">
            <button
              @click="exportData"
              style="color: var(--line, #D6CEC2);"
              class="hover:text-white p-2 rounded-md"
              title="Exporter les données"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </button>
            
            <button
              @click="logout"
              style="color: var(--line, #D6CEC2);"
              class="hover:text-white p-2 rounded-md"
              title="Se déconnecter"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
            </button>
            
            <NuxtLink 
              to="/" 
              style="color: var(--line, #D6CEC2);"
              class="hover:text-white p-2 rounded-md"
              title="Voir le site"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenu principal -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Notifications -->
    <div
      v-if="notification"
      style="background-color: var(--cream, #F4EFE8);"
      class="fixed bottom-4 right-4 max-w-sm w-full rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5 z-50"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg
              v-if="notification.type === 'success'"
              style="color: var(--sage, #5A7D63);"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg
              v-else
              class="h-6 w-6 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div class="ml-3 w-0 flex-1">
            <p style="color: var(--espresso, #3A2C24);" class="text-sm font-medium">
              {{ notification.title }}
            </p>
            <p v-if="notification.message" style="color: var(--textbody, #5C4E3D);" class="mt-1 text-sm">
              {{ notification.message }}
            </p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button
              @click="notification = null"
              style="background-color: var(--cream, #F4EFE8); color: var(--line, #D6CEC2);"
              class="rounded-md inline-flex hover:text-gray-500"
            >
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const notification = ref(null)

// Méthode pour exporter les données
const exportData = async () => {
  try {
    notification.value = {
      type: 'success',
      title: 'Export en cours...',
      message: 'Génération du fichier CSV'
    }

    // Appeler l'API d'export
    const response = await fetch('/api/admin/export', {
      method: 'POST'
    })

    if (!response.ok) {
      throw new Error('Erreur lors de l\'export')
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    
    // Nom du fichier avec timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')
    link.download = `export-produits-${timestamp}.csv`
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    notification.value = {
      type: 'success',
      title: 'Export réussi !',
      message: 'Le fichier CSV a été téléchargé'
    }

    // Masquer la notification après 3 secondes
    setTimeout(() => {
      notification.value = null
    }, 3000)

  } catch (error) {
    console.error('Erreur lors de l\'export:', error)
    notification.value = {
      type: 'error',
      title: 'Erreur d\'export',
      message: 'Impossible de générer le fichier CSV'
    }

    setTimeout(() => {
      notification.value = null
    }, 5000)
  }
}

// Méthode pour se déconnecter
const logout = async () => {
  try {
    await $fetch('/api/admin/auth/logout', {
      method: 'POST'
    })
    
    // Redirection vers la page de login
    await navigateTo('/admin/login')
    
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
    
    notification.value = {
      type: 'error',
      title: 'Erreur de déconnexion',
      message: 'Impossible de se déconnecter'
    }

    setTimeout(() => {
      notification.value = null
    }, 3000)
  }
}

// Fournir la méthode de notification aux composants enfants
provide('notify', (type, title, message) => {
  notification.value = { type, title, message }
  setTimeout(() => {
    notification.value = null
  }, type === 'error' ? 5000 : 3000)
})
</script>
