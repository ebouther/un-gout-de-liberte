<!-- filepath: components/SuccessMessage.vue -->
<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-screen items-center justify-center p-4">
        <div class="fixed inset-0 bg-black bg-opacity-25 transition-opacity" @click="$emit('close')"></div>

        <div class="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div class="text-center">
            <!-- Success icon -->
            <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {{ title }}
            </h3>

            <p class="text-gray-600 mb-6">
              {{ message }}
            </p>

            <button
              @click="$emit('close')"
              class="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Continuer
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Succès !'
  },
  message: {
    type: String,
    default: 'Votre action a été effectuée avec succès.'
  }
})

defineEmits(['close'])
</script>
