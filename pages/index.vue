<script setup lang="ts">
import { FALLBACK_SITE_TITLE } from '~/utils/contentMeta'
import { buildPageSeoMeta, DEFAULT_OG_IMAGE_PATH } from '~/utils/seo'

const runtimeConfig = useRuntimeConfig()

const siteTitle = computed(() => {
  const value = runtimeConfig.public?.siteTitle
  return typeof value === 'string' && value.trim() ? value : FALLBACK_SITE_TITLE
})

const siteUrl = computed(() => {
  const value = runtimeConfig.public?.siteUrl
  return typeof value === 'string' && value.trim()
    ? value
    : 'https://about.tsono.dev'
})

const pageSeo = computed(() =>
  buildPageSeoMeta({
    siteUrl: siteUrl.value,
    path: '/',
    title: siteTitle.value,
    description: `${siteTitle.value} の記事と日記をまとめています。`,
    fallbackImage: DEFAULT_OG_IMAGE_PATH,
    siteName: siteTitle.value,
  }),
)

useSeoMeta({
  title: () => pageSeo.value.seoMeta.title,
  description: () => pageSeo.value.seoMeta.description,
  ogTitle: () => pageSeo.value.seoMeta.ogTitle,
  ogDescription: () => pageSeo.value.seoMeta.ogDescription,
  ogType: () => pageSeo.value.seoMeta.ogType,
  ogUrl: () => pageSeo.value.seoMeta.ogUrl,
  ogLocale: () => pageSeo.value.seoMeta.ogLocale,
  ogSiteName: () => pageSeo.value.seoMeta.ogSiteName,
  ogImage: () => pageSeo.value.seoMeta.ogImage,
  twitterCard: () => pageSeo.value.seoMeta.twitterCard,
  twitterTitle: () => pageSeo.value.seoMeta.twitterTitle,
  twitterDescription: () => pageSeo.value.seoMeta.twitterDescription,
  twitterImage: () => pageSeo.value.seoMeta.twitterImage,
})

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: pageSeo.value.canonicalUrl,
    },
  ],
}))
</script>

<template>
  <div
    class="flex min-h-screen w-full items-start justify-center bg-[var(--bg)] px-6 pt-16 pb-10"
  >
    <figure class="relative w-full max-w-4xl overflow-hidden rounded-[2rem]">
      <NuxtImg
        src="/images/articles/top/hero.webp"
        alt="Sunrise view of Mt. Fuji behind a torii gate"
        format="webp"
        class="h-full w-full object-cover"
        loading="eager"
        decoding="async"
      />
      <div
        class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/5"
      />
      <figcaption
        class="pointer-events-none absolute bottom-4 right-5 rounded-full bg-black/55 px-4 py-1 text-xs tracking-[0.35em] text-white"
      >
        2025/11/21
      </figcaption>
    </figure>
  </div>
</template>
