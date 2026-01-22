import { useRouter, useState } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const shouldAnimate = useState('page-transition-enabled', () => true)
  const router = useRouter()

  const handlePopState = () => {
    shouldAnimate.value = false
  }

  window.addEventListener('popstate', handlePopState)

  router.afterEach(() => {
    if (!shouldAnimate.value) {
      requestAnimationFrame(() => {
        shouldAnimate.value = true
      })
    }
  })

  nuxtApp.hook('app:beforeUnmount', () => {
    window.removeEventListener('popstate', handlePopState)
  })
})
