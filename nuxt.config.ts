import { defineNuxtConfig } from 'nuxt/config'
import { FALLBACK_SITE_TITLE } from './utils/contentMeta'

export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxt/eslint', '@nuxt/image', 'nuxt-studio'],
  studio: {
    route: '/_studio',
    repository: {
      provider: 'github',
      owner: 'tsonobe1',
      repo: 'tsono-about',
      branch: 'main',
    },
  },
  runtimeConfig: {
    public: {
      siteTitle: FALLBACK_SITE_TITLE,
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://about.tsono.dev',
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
        {
          property: 'og:site_name',
          content: FALLBACK_SITE_TITLE,
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
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
