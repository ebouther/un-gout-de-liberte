export default defineNuxtPlugin(() => {
  // Import tw-elements for client-side interactivity
  if (process.client) {
    import('tw-elements')
  }
})
