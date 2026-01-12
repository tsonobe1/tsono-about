export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxtjs/tailwindcss', '@nuxt/eslint', 'shadcn-nuxt'],
  css: ['~/assets/css/tailwind.css'],
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  content: {
    documentDriven: true
  }
})
