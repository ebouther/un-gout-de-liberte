<template>
  <div class="min-h-screen bg-[var(--stone,#F4EFE8)] py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- En-tête -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-[var(--espresso,#3A2C24)]">Administration</h1>
        <p class="mt-2 text-[var(--textbody,#5C4E3D)]">Gérez vos produits, articles et contenus</p>
      </div>

      <!-- Navigation par onglets -->
      <div class="mb-8">
        <nav class="flex space-x-8">
          <button
            @click="activeTab = 'products'"
            :class="{
              'border-[var(--gold,#B88645)] text-[var(--gold,#B88645)]': activeTab === 'products',
              'border-transparent text-[var(--textbody,#5C4E3D)] hover:text-[var(--espresso,#3A2C24)] hover:border-[var(--line,#D6CEC2)]': activeTab !== 'products'
            }"
            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"></path>
            </svg>
            Produits
          </button>
          <button
            @click="activeTab = 'blog'"
            :class="{
              'border-[var(--gold,#B88645)] text-[var(--gold,#B88645)]': activeTab === 'blog',
              'border-transparent text-[var(--textbody,#5C4E3D)] hover:text-[var(--espresso,#3A2C24)] hover:border-[var(--line,#D6CEC2)]': activeTab !== 'blog'
            }"
            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
            </svg>
            Blog
          </button>
          <button
            @click="activeTab = 'orders'"
            :class="{
              'border-[var(--gold,#B88645)] text-[var(--gold,#B88645)]': activeTab === 'orders',
              'border-transparent text-[var(--textbody,#5C4E3D)] hover:text-[var(--espresso,#3A2C24)] hover:border-[var(--line,#D6CEC2)]': activeTab !== 'orders'
            }"
            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
            Commandes
          </button>
          <button
            @click="activeTab = 'gallery'"
            :class="{
              'border-[var(--gold,#B88645)] text-[var(--gold,#B88645)]': activeTab === 'gallery',
              'border-transparent text-[var(--textbody,#5C4E3D)] hover:text-[var(--espresso,#3A2C24)] hover:border-[var(--line,#D6CEC2)]': activeTab !== 'gallery'
            }"
            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Galerie
          </button>
        </nav>
      </div>
      
      <!-- Contenu de l'onglet Produits -->
      <div v-if="activeTab === 'products'">
        <!-- Buttons container -->
        <div class="flex flex-wrap gap-4 items-center mb-6">
          <button
            @click="createNewProduct"
            class="bg-[var(--gold,#B88645)] hover:opacity-90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Nouveau Produit
          </button>
          
          <button
            @click="refreshProducts"
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Actualiser
          </button>

          <div class="flex-1"></div>

          <!-- Search -->
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher un produit..."
              class="pl-10 pr-4 py-2 border border-[var(--line,#D6CEC2)] rounded-lg focus:ring-2 focus:ring-[var(--gold,#B88645)] focus:border-[var(--gold,#B88645)]"
            >
            <svg class="w-5 h-5 text-[var(--line,#D6CEC2)] absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>

        <!-- Filters -->
        <div class="mb-6 bg-white p-4 rounded-lg shadow">
          <div class="flex flex-wrap gap-4 items-center">
            <div>
              <label class="block text-sm font-medium text-[var(--espresso,#3A2C24)] mb-1">Catégorie</label>
              <select v-model="selectedCategory" class="border border-[var(--line,#D6CEC2)] rounded-md px-3 py-2 text-sm">
                <option value="">Toutes les catégories</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
            
            <div class="flex-1"></div>
            
            <div class="text-sm text-[var(--textbody,#5C4E3D)]">
              {{ filteredProducts.length }} produit{{ filteredProducts.length > 1 ? 's' : '' }}
            </div>
          </div>
        </div>

        <!-- Status Message -->
        <div v-if="statusMessage" class="mb-4 p-4 rounded-lg" 
             :class="{
               'bg-green-100 text-green-700': statusType === 'success',
               'bg-red-100 text-red-700': statusType === 'error',
               'bg-yellow-100 text-yellow-700': statusType === 'warning',
               'bg-blue-100 text-blue-700': statusType === 'info'
             }">
          {{ statusMessage }}
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>

        <!-- Product List -->
        <div v-else-if="filteredProducts.length > 0" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <!-- Image -->
            <div class="h-48 bg-gray-200 relative">
              <img
                v-if="product.images && product.images[0]"
                :src="product.images[0]"
                :alt="product.name"
                class="w-full h-full object-cover"
              >
              <div v-else class="flex items-center justify-center h-full text-[var(--line,#D6CEC2)]">
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              
              <!-- Badge statut -->
              <div class="absolute top-2 right-2">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ product.active ? 'Actif' : 'Inactif' }}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-4">
              <h3 class="font-semibold text-lg text-[var(--espresso,#3A2C24)] mb-2">{{ product.name }}</h3>
              
              <p v-if="product.description" class="text-[var(--textbody,#5C4E3D)] text-sm mb-3 line-clamp-2">
                {{ product.description }}
              </p>

              <!-- Prix -->
              <div class="mb-3">
                <div v-if="product.prices && product.prices.length > 0" class="space-y-1">
                  <div v-for="price in product.prices.slice(0, 2)" :key="price.id" class="flex justify-between items-center text-sm">
                    <span class="text-[var(--textbody,#5C4E3D)]">
                      <template v-if="price.nickname">{{ price.nickname }} – </template>{{ formatPrice(price.unit_amount) }}
                    </span>
                  </div>
                  <div v-if="product.prices.length > 2" class="text-xs text-[var(--textbody,#5C4E3D)]">
                    +{{ product.prices.length - 2 }} autre{{ product.prices.length > 3 ? 's' : '' }} prix
                  </div>
                </div>
                <div v-else class="text-sm text-[var(--textbody,#5C4E3D)]">Aucun prix défini</div>
              </div>

              <!-- Métadonnées importantes -->
              <div class="space-y-1 text-xs text-[var(--textbody,#5C4E3D)] mb-4">
                <div v-if="product.metadata?.category" class="flex items-center gap-1">
                  <span class="font-medium">Catégorie:</span>
                  <span>{{ product.metadata.category }}</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-2">
                <button
                  @click="editProduct(product)"
                  class="flex-1 bg-[var(--gold,#B88645)] hover:opacity-90 text-white text-sm py-2 px-3 rounded-md font-medium"
                >
                  Modifier
                </button>
                
                <button
                  @click="toggleProductStatus(product)"
                  class="px-3 py-2 text-sm rounded-md font-medium border"
                  :class="product.active 
                    ? 'border-red-300 text-red-700 hover:bg-red-50' 
                    : 'border-green-300 text-green-700 hover:bg-green-50'"
                >
                  {{ product.active ? 'Désactiver' : 'Activer' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- No Products Message -->
        <div v-else-if="filteredProducts.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 text-[var(--line,#D6CEC2)] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m-2 0v-2a2 2 0 012-2h2m0 0V9a2 2 0 012-2h2M9 3v2m6-2v2"></path>
          </svg>
          <h3 class="text-lg font-medium text-[var(--espresso,#3A2C24)] mb-2">Aucun produit trouvé</h3>
          <p class="text-[var(--textbody,#5C4E3D)]">
            {{ products.length === 0 ? 
              'Aucun produit chargé depuis Stripe. Vérifiez votre configuration.' : 
              'Essayez de modifier vos filtres ou créez un nouveau produit.' 
            }}
          </p>
        </div>
      </div>

      <!-- Contenu de l'onglet Blog -->
      <div v-if="activeTab === 'blog'">
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-[var(--espresso,#3A2C24)]">Articles du Blog</h3>
              <button
                @click="createNewArticle"
                class="bg-[var(--gold,#B88645)] hover:opacity-90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Nouvel Article
              </button>
            </div>
          </div>
          
          <div class="p-6">
            <!-- Loading -->
            <div v-if="blogLoading" class="text-center py-12">
              <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-[var(--gold,#B88645)] mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="text-[var(--textbody,#5C4E3D)] mt-2">Chargement des articles...</p>
            </div>

            <!-- Liste des articles -->
            <div v-else-if="articles.length > 0" class="space-y-4">
              <div
                v-for="article in articles"
                :key="article.slug"
                class="border border-gray-200 rounded-lg p-4 hover:bg-[var(--stone,#F4EFE8)] transition-colors"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h4 class="text-lg font-medium text-[var(--espresso,#3A2C24)] mb-2">{{ article.title }}</h4>
                    <p class="text-[var(--textbody,#5C4E3D)] text-sm mb-3">{{ article.summary }}</p>
                    <div class="flex items-center gap-4 text-sm text-[var(--textbody,#5C4E3D)]">
                      <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        {{ new Date(article.date).toLocaleDateString('fr-FR') }}
                      </span>
                      <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 713 12V7a4 4 0 014-4z"></path>
                        </svg>
                        {{ article.category }}
                      </span>
                      <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {{ article.readingTime }} min
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <span 
                      :class="{
                        'bg-green-100 text-green-800': article.status === 'published',
                        'bg-yellow-100 text-yellow-800': article.status === 'draft'
                      }"
                      class="px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {{ article.status === 'published' ? 'Publié' : 'Brouillon' }}
                    </span>
                    <button 
                      @click="editArticle(article)"
                      class="text-[var(--gold,#B88645)] hover:text-amber-700 p-1 rounded"
                      title="Modifier l'article"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Message aucun article -->
            <div v-else class="text-center py-12">
              <svg class="w-16 h-16 text-[var(--line,#D6CEC2)] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
              <h3 class="text-lg font-medium text-[var(--espresso,#3A2C24)] mb-2">Aucun article pour le moment</h3>
              <p class="text-[var(--textbody,#5C4E3D)] mb-4">
                Créez votre premier article de blog pour partager vos actualités, recettes et événements.
              </p>
              <button
                @click="createNewArticle"
                class="bg-[var(--gold,#B88645)] hover:opacity-90 text-white px-4 py-2 rounded-lg font-medium"
              >
                Créer mon premier article
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenu de l'onglet Commandes -->
      <div v-if="activeTab === 'orders'">
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-[var(--line,#D6CEC2)]">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-[var(--espresso,#3A2C24)]">Commandes</h3>
              <select
                v-model="ordersFilter"
                class="border border-[var(--line,#D6CEC2)] rounded-md px-3 py-1.5 text-sm text-[var(--espresso,#3A2C24)]"
              >
                <option value="paid">Payées</option>
                <option value="all">Toutes</option>
                <option value="open">En attente</option>
                <option value="expired">Expirées</option>
              </select>
            </div>
          </div>

          <div class="p-6">
            <!-- Loading -->
            <div v-if="ordersLoading" class="text-center py-12">
              <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-[var(--gold,#B88645)] mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="text-[var(--textbody,#5C4E3D)] mt-2">Chargement des commandes...</p>
            </div>

            <!-- Tableau -->
            <div v-else-if="orders.length > 0" class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="text-left text-[var(--textbody,#5C4E3D)] border-b border-[var(--line,#D6CEC2)]">
                    <th class="pb-3 pr-4 font-medium">Date</th>
                    <th class="pb-3 pr-4 font-medium">Client</th>
                    <th class="pb-3 pr-4 font-medium text-right">Montant</th>
                    <th class="pb-3 pr-4 font-medium">Statut</th>
                    <th class="pb-3 font-medium">Paiement</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="order in orders"
                    :key="order.id"
                    class="border-b border-[var(--line,#D6CEC2)] hover:bg-[var(--stone,#F4EFE8)] transition-colors"
                  >
                    <td class="py-3 pr-4 text-[var(--espresso,#3A2C24)] whitespace-nowrap">
                      {{ new Date(order.created * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
                    </td>
                    <td class="py-3 pr-4">
                      <div class="text-[var(--espresso,#3A2C24)]">{{ order.customer.name || '—' }}</div>
                      <div class="text-[var(--textbody,#5C4E3D)] text-xs">{{ order.customer.email }}</div>
                    </td>
                    <td class="py-3 pr-4 text-right text-[var(--espresso,#3A2C24)] font-medium whitespace-nowrap">
                      {{ formatPrice(order.amountTotal) }}
                    </td>
                    <td class="py-3 pr-4">
                      <span
                        class="px-2 py-1 rounded-full text-xs font-medium"
                        :class="{
                          'bg-green-100 text-green-800': order.status === 'complete',
                          'bg-yellow-100 text-yellow-800': order.status === 'open',
                          'bg-red-100 text-red-800': order.status === 'expired',
                        }"
                      >
                        {{ order.status === 'complete' ? 'Finalisée' : order.status === 'open' ? 'En attente' : 'Expirée' }}
                      </span>
                    </td>
                    <td class="py-3 whitespace-nowrap">
                      <span
                        class="px-2 py-1 rounded-full text-xs font-medium"
                        :class="{
                          'bg-green-100 text-green-800': order.paymentStatus === 'paid',
                          'bg-yellow-100 text-yellow-800': order.paymentStatus === 'unpaid',
                          'bg-gray-100 text-gray-600': order.paymentStatus === 'no_payment_required',
                        }"
                      >
                        {{ order.paymentStatus === 'paid' ? 'Payé' : order.paymentStatus === 'unpaid' ? 'Impayé' : 'Gratuit' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Aucune commande -->
            <div v-else class="text-center py-12">
              <svg class="w-16 h-16 text-[var(--line,#D6CEC2)] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
              <h3 class="text-lg font-medium text-[var(--espresso,#3A2C24)] mb-2">Aucune commande</h3>
              <p class="text-[var(--textbody,#5C4E3D)]">
                Aucune commande trouvée pour le filtre sélectionné.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenu de l'onglet Galerie -->
      <div v-if="activeTab === 'gallery'">
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-[var(--line,#D6CEC2)]">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-[var(--espresso,#3A2C24)]">Galerie photos</h3>
              <label class="cursor-pointer bg-[var(--gold,#B88645)] hover:opacity-90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Ajouter une photo
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" class="hidden" @change="onGalleryUpload" />
              </label>
            </div>
          </div>

          <div class="p-6">
            <!-- Loading -->
            <div v-if="galleryLoading" class="text-center py-12">
              <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-[var(--gold,#B88645)] mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="text-[var(--textbody,#5C4E3D)] mt-2">Chargement...</p>
            </div>

            <!-- Grille -->
            <div v-else-if="galleryImages.length > 0" class="space-y-2">
              <p class="text-xs text-[var(--textbody,#5C4E3D)]">Glissez-déposez pour réorganiser</p>
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div
                  v-for="(img, idx) in galleryImages"
                  :key="img.filename"
                  :draggable="!galleryUploading"
                  @dragstart="onDragStart($event, idx)"
                  @dragover.prevent="onDragOver($event, idx)"
                  @drop="onDrop($event, idx)"
                  @dragend="onDragEnd"
                  class="relative group border border-[var(--line,#D6CEC2)] rounded-lg overflow-hidden cursor-grab active:cursor-grabbing"
                  :class="{ 'opacity-50': dragIndex === idx }"
                >
                  <div class="absolute top-1 left-1 z-10 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                    {{ idx + 1 }}
                  </div>
                  <img
                    :src="img.url"
                    :alt="img.filename"
                    class="w-full h-40 object-cover pointer-events-none"
                  />
                  <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <button
                      @click="deleteGalleryImage(img.filename)"
                      class="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all"
                      title="Supprimer"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                  <div class="px-2 py-1 text-xs text-[var(--textbody,#5C4E3D)] truncate">{{ img.filename }}</div>
                </div>
              </div>
              <button
                v-if="galleryOrderChanged"
                @click="saveGalleryOrder"
                :disabled="galleryUploading"
                class="mt-4 bg-[var(--gold,#B88645)] hover:opacity-90 text-white px-4 py-2 rounded-lg font-medium text-sm disabled:opacity-50"
              >
                {{ galleryUploading ? 'Enregistrement...' : 'Enregistrer l\'ordre' }}
              </button>
            </div>

            <!-- Aucune photo -->
            <div v-else class="text-center py-12">
              <svg class="w-16 h-16 text-[var(--line,#D6CEC2)] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <h3 class="text-lg font-medium text-[var(--espresso,#3A2C24)] mb-2">Aucune photo</h3>
              <p class="text-[var(--textbody,#5C4E3D)]">Ajoutez vos premières photos de créations.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de création/édition produit -->
      <AdminProductModal
        :show="showCreateForm || !!editingProduct"
        :product="editingProduct"
        @close="closeModal"
        @saved="onProductSaved"
      />

      <!-- Modal de création/édition article -->
      <AdminArticleModal
        :show="showArticleForm || !!editingArticle"
        :article="editingArticle"
        @close="closeModal"
        @saved="onArticleSaved"
      />
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  title: 'Administration'
})

// Authentication check
onMounted(async () => {
  if (process.client) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const token = useCookie('admin-auth')
    try {
      const response = await $fetch('/api/admin/auth/check')
      if (!response.authenticated) {
        await navigateTo('/admin/login')
        return
      }
      await loadProducts()
      if (activeTab.value === 'blog') loadArticles()
      if (activeTab.value === 'orders') loadOrders()
      if (activeTab.value === 'gallery') loadGallery()
    } catch (error) {
      console.error('Auth check failed:', error)
      await navigateTo('/admin/login')
      return
    }
  }
})

// État réactif
const route = useRoute()
const activeTab = ref(route.query.tab === 'gallery' ? 'gallery' : route.query.tab === 'blog' ? 'blog' : route.query.tab === 'orders' ? 'orders' : 'products')
const products = ref([])
const articles = ref([])
const loading = ref(true)
const blogLoading = ref(false)
const showCreateForm = ref(false)
const showArticleForm = ref(false)
const editingProduct = ref(null)
const editingArticle = ref(null)
const searchQuery = ref('')
const selectedCategory = ref('')
const statusMessage = ref('')
const statusType = ref('success')
const orders = ref([])
const ordersLoading = ref(false)
const ordersFilter = ref('paid')
const galleryImages = ref([])
const galleryLoading = ref(false)
const galleryUploading = ref(false)
const dragIndex = ref(null)
const galleryOrderChanged = ref(false)

// Computed
const categories = computed(() => {
  const cats = new Set()
  products.value.forEach(product => {
    if (product.metadata?.category) {
      cats.add(product.metadata.category)
    }
  })
  return Array.from(cats).sort()
})

const filteredProducts = computed(() => {
  let filtered = products.value

  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(query) ||
      (product.description && product.description.toLowerCase().includes(query))
    )
  }

  // Filtre par catégorie
  if (selectedCategory.value) {
    filtered = filtered.filter(product => 
      product.metadata?.category === selectedCategory.value
    )
  }

  return filtered
})

// Fonctions
const loadProducts = async () => {
  try {
    loading.value = true
    const data = await $fetch('/api/products')
    
    // L'API renvoie directement un tableau de produits
    products.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Erreur lors du chargement des produits:', error)
    showStatus('Erreur lors du chargement des produits', 'error')
    products.value = []
  } finally {
    loading.value = false
  }
}

const refreshProducts = async () => {
  await loadProducts()
  showStatus('Produits actualisés', 'success')
}

const createNewProduct = () => {
  editingProduct.value = null
  showCreateForm.value = true
}

const createNewArticle = () => {
  editingArticle.value = null
  showArticleForm.value = true
}

const loadArticles = async () => {
  try {
    blogLoading.value = true
    const response = await $fetch('/api/admin/blog/articles')
    articles.value = response.articles || []
  } catch (error) {
    console.error('Erreur lors du chargement des articles:', error)
    showStatus('Erreur lors du chargement des articles', 'error')
    articles.value = []
  } finally {
    blogLoading.value = false
  }
}

// Surveiller le changement d'onglet pour charger les données
watch(activeTab, (newTab) => {
  if (newTab === 'blog' && articles.value.length === 0) {
    loadArticles()
  }
  if (newTab === 'orders' && orders.value.length === 0) {
    loadOrders()
  }
  if (newTab === 'gallery' && galleryImages.value.length === 0) {
    loadGallery()
  }
})

watch(ordersFilter, () => {
  if (activeTab.value === 'orders') {
    loadOrders()
  }
})

const editProduct = (product) => {
  editingProduct.value = product
  showCreateForm.value = true
}

const closeModal = () => {
  showCreateForm.value = false
  showArticleForm.value = false
  editingProduct.value = null
  editingArticle.value = null
}

const editArticle = (article) => {
  editingArticle.value = article
  showArticleForm.value = true
}

const onArticleSaved = (savedArticle) => {
  if (savedArticle === null) {
    // Suppression : recharger la liste
    loadArticles()
    showStatus('Article supprimé avec succès', 'success')
  } else if (editingArticle.value) {
    // Mode édition : mettre à jour l'article dans la liste
    const index = articles.value.findIndex(a => a.slug === editingArticle.value.slug)
    if (index !== -1) {
      articles.value[index] = { ...savedArticle }
    }
    showStatus('Article modifié avec succès', 'success')
  } else {
    // Mode création : ajouter le nouvel article à la liste
    articles.value.unshift(savedArticle)
    showStatus('Article créé avec succès', 'success')
  }
  
  closeModal()
}

const onProductSaved = (savedProduct) => {
  if (!savedProduct || !savedProduct.id) {
    console.error('Produit sauvegardé invalide:', savedProduct)
    showStatus('Erreur: produit invalide reçu', 'error')
    return
  }

  if (editingProduct.value) {
    // Mode édition : mettre à jour le produit dans la liste
    const index = products.value.findIndex(p => p.id === savedProduct.id)
    if (index !== -1) {
      products.value[index] = { ...savedProduct }
      showStatus('Produit modifié avec succès', 'success')
    }
  } else {
    // Mode création : ajouter le nouveau produit à la liste
    products.value.unshift(savedProduct)
    showStatus('Produit créé avec succès', 'success')
  }
  
  closeModal()
}

const toggleProductStatus = async (product) => {
  try {
    const response = await $fetch(`/api/admin/products/${product.id}`, {
      method: 'PATCH',
      body: {
        active: !product.active
      }
    })
    
    if (response.success) {
      // Mettre à jour localement
      product.active = !product.active
      showStatus(`Produit ${product.active ? 'activé' : 'désactivé'}`, 'success')
    } else {
      showStatus('Erreur lors de la modification du statut', 'error')
    }
  } catch (error) {
    console.error('Erreur lors de la modification du statut:', error)
    showStatus('Erreur lors de la modification du statut', 'error')
  }
}

const loadOrders = async () => {
  try {
    ordersLoading.value = true
    const response = await $fetch(`/api/admin/orders?status=${ordersFilter.value}`)
    orders.value = response.orders || []
  } catch (error) {
    console.error('Erreur lors du chargement des commandes:', error)
    showStatus('Erreur lors du chargement des commandes', 'error')
    orders.value = []
  } finally {
    ordersLoading.value = false
  }
}

const loadGallery = async () => {
  try {
    galleryLoading.value = true
    const response = await $fetch('/api/gallery')
    galleryImages.value = response.images || []
  } catch (error) {
    console.error('Erreur chargement galerie:', error)
    showStatus('Erreur lors du chargement de la galerie', 'error')
    galleryImages.value = []
  } finally {
    galleryLoading.value = false
  }
}

const onGalleryUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  if (file.size > 10 * 1024 * 1024) {
    showStatus('Le fichier est trop volumineux (max 10 Mo)', 'error')
    return
  }

  try {
    galleryUploading.value = true
    const reader = new FileReader()
    const base64 = await new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result.split(',')[1])
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

    const filename = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, '-')

    const response = await $fetch('/api/admin/gallery/upload', {
      method: 'POST',
      body: { filename, content: base64 },
    })

    if (response.success) {
      galleryImages.value.push(response.image)
      showStatus(`Photo "${filename}" ajoutée`, 'success')
    }
  } catch (error) {
    console.error('Erreur upload:', error)
    showStatus("Erreur lors de l'upload", 'error')
  } finally {
    galleryUploading.value = false
    event.target.value = ''
  }
}

const deleteGalleryImage = async (filename) => {
  if (!confirm(`Supprimer "${filename}" ?`)) return

  try {
    await $fetch(`/api/admin/gallery/${filename}`, { method: 'DELETE' })
    galleryImages.value = galleryImages.value.filter((img) => img.filename !== filename)
    showStatus(`Photo "${filename}" supprimée`, 'success')
  } catch (error) {
    console.error('Erreur suppression:', error)
    showStatus('Erreur lors de la suppression', 'error')
  }
}

const onDragStart = (event, index) => {
  dragIndex.value = index
  event.dataTransfer.effectAllowed = 'move'
}

const onDragOver = (event, index) => {
  event.dataTransfer.dropEffect = 'move'
}

const onDrop = (event, index) => {
  if (dragIndex.value === null || dragIndex.value === index) {
    dragIndex.value = null
    return
  }
  const items = [...galleryImages.value]
  const [moved] = items.splice(dragIndex.value, 1)
  items.splice(index, 0, moved)
  galleryImages.value = items
  dragIndex.value = null
  galleryOrderChanged.value = true
}

const onDragEnd = () => {
  dragIndex.value = null
}

const saveGalleryOrder = async () => {
  try {
    galleryUploading.value = true
    const order = galleryImages.value.map((img) => img.filename)
    await $fetch('/api/admin/gallery/order', {
      method: 'POST',
      body: { order },
    })
    galleryOrderChanged.value = false
    showStatus('Ordre de la galerie mis à jour', 'success')
  } catch (error) {
    console.error('Erreur sauvegarde ordre:', error)
    showStatus('Erreur lors de la sauvegarde de l\'ordre', 'error')
  } finally {
    galleryUploading.value = false
  }
}

const formatPrice = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount / 100)
}

const showStatus = (message, type = 'success', duration = 3000) => {
  statusMessage.value = message
  statusType.value = type
  setTimeout(() => {
    statusMessage.value = ''
  }, duration)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
