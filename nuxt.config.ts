import { defineNuxtConfig } from 'nuxt/config'
import { FALLBACK_SITE_TITLE } from './utils/contentMeta'

export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxt/eslint', '@nuxt/image'],
  runtimeConfig: {
    public: {
      siteTitle: FALLBACK_SITE_TITLE,
      isAboutPublic: process.env.NUXT_PUBLIC_IS_ABOUT_PUBLIC === 'true',
      isGalleryPublic: process.env.NUXT_PUBLIC_IS_GALLERY_PUBLIC === 'true',
    },
  },
  app: {
    head: {
      title: FALLBACK_SITE_TITLE,
      titleTemplate: `%s | ${FALLBACK_SITE_TITLE}`,
      meta: [
        {
          name: 'description',
          content: `${FALLBACK_SITE_TITLE} の記事と日記をまとめています。`,
        },
      ],
    },
  },
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
          theme: 'github-light',
        },
      },
    },
  },
  image: {
    dir: 'public',
  },
  nitro: {
    prerender: {
      ignore: ['/about', '/gallery'],
    },
  },
})
