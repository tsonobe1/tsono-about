import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxt/eslint', '@nuxt/image'],
  css: ['~/assets/css/tailwind.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  content: {
    build: {
      markdown: {
        highlight: {
          theme: 'github-dark-high-contrast',
        },
      },
    },
  },
  image: {
    dir: 'public',
  },
})
