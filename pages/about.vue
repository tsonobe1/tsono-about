<script setup lang="ts">
import { FALLBACK_SITE_TITLE } from '~/utils/contentMeta'
import { buildPageSeoMeta, DEFAULT_OG_IMAGE_PATH } from '~/utils/seo'

const runtimeConfig = useRuntimeConfig()

if (!runtimeConfig.public.isAboutPublic) {
  throw createError({ statusCode: 404, statusMessage: 'Not Found' })
}

const siteTitle = computed(() => {
  const value = runtimeConfig.public?.siteTitle
  return typeof value === 'string' && value.trim() ? value : FALLBACK_SITE_TITLE
})

const siteUrl = computed(() => {
  const value = runtimeConfig.public?.siteUrl
  return typeof value === 'string' && value.trim()
    ? value
    : 'https://about.tsono.org'
})

const pageSeo = computed(() =>
  buildPageSeoMeta({
    siteUrl: siteUrl.value,
    path: '/about',
    title: '私について',
    description: 'プロフィールとサイト内コンテンツへの案内です。',
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
  <div class="mx-auto flex min-h-screen max-w-3xl flex-col gap-10 px-6 pb-16">
    <section class="card space-y-4">
      <header class="space-y-2">
        <h1 class="text-3xl font-semibold text-[var(--text)]">私について</h1>
      </header>

      <div class="space-y-3 text-[var(--text)]">
        <p>test</p>
        <ul class="list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
          <li>
            <NuxtLink class="text-[var(--accent)]" to="/articles"
              >Articles</NuxtLink
            >
            — 技術や制作に関する長文メモ。
          </li>
          <li>
            <NuxtLink class="text-[var(--accent)]" to="/diary">Diary</NuxtLink>
            — 日常のログや感想。
          </li>
          <li>
            <NuxtLink class="text-[var(--accent)]" to="/gallery"
              >Gallery</NuxtLink
            >
            — DIY / Music / App などの作品。
          </li>
          <li>
            <NuxtLink class="text-[var(--accent)]" to="/career"
              >Career</NuxtLink
            >
            — 最新の職務経歴書。
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
