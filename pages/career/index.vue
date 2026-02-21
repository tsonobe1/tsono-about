<script setup lang="ts">
import { formatDate } from '~/utils/formatDate'
import { FALLBACK_SITE_TITLE } from '~/utils/contentMeta'
import { buildPageSeoMeta, DEFAULT_OG_IMAGE_PATH } from '~/utils/seo'

const { data: doc } = await useAsyncData('about-doc', () =>
  queryCollection('career').where('path', '=', '/career/index').first(),
)

const runtimeConfig = useRuntimeConfig()

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

const pageTitle = computed(() => {
  const value = doc.value as null | { title?: string | null }
  return value?.title?.trim() || '職務経歴書'
})

const pageDescription = computed(() => {
  const value = doc.value as null | { description?: string | null }
  return value?.description?.trim() || '職務経歴書ページです。'
})

const pageSeo = computed(() =>
  buildPageSeoMeta({
    siteUrl: siteUrl.value,
    path: '/career',
    title: pageTitle.value,
    description: pageDescription.value,
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
  <div class="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-6 pb-16">
    <article v-if="doc" class="flex flex-col gap-6">
      <div class="space-y-2">
        <h2 class="text-3xl font-semibold text-[var(--text)]">
          {{ doc.title }}
        </h2>
        <p v-if="doc.updatedAt" class="muted text-sm">
          最終更新: {{ formatDate(doc.updatedAt) }}
        </p>
        <p class="muted">{{ doc.description }}</p>
      </div>
      <div class="card content">
        <ContentRenderer :value="doc" />
      </div>
    </article>

    <p v-else class="muted text-center text-sm">
      コンテンツが見つかりませんでした。
    </p>
  </div>
</template>
