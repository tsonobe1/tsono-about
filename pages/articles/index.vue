<script setup lang="ts">
import { formatDate, getYearInDefaultTimeZone } from '~/utils/formatDate'
import { FALLBACK_SITE_TITLE } from '~/utils/contentMeta'
import { buildPageSeoMeta, DEFAULT_OG_IMAGE_PATH } from '~/utils/seo'

const toAbsolutePath = (path?: string | null) =>
  path ? (path.startsWith('/') ? path : `/${path}`) : '/'

const { data } = await useAsyncData('articles-page', () =>
  queryCollection('article')
    .select('path', 'title', 'date', 'description', 'kind', 'tags')
    .order('date', 'DESC')
    .all(),
)

type ArticleEntry = {
  path?: string | null
  title?: string | null
  date?: string | Date | null
  kind?: string | null
}

const articles = computed<ArticleEntry[]>(
  () => (data.value ?? []) as ArticleEntry[],
)

const groupedArticles = computed(() => {
  const groups: Record<
    string,
    { key: string; label: string; items: ArticleEntry[] }
  > = {}
  const orderedKeys: string[] = []

  for (const item of articles.value) {
    const normalizedYear = getYearInDefaultTimeZone(item.date ?? undefined)
    const hasYear = typeof normalizedYear === 'number'
    const yearKey = hasYear ? String(normalizedYear) : 'no-date'
    if (!groups[yearKey]) {
      groups[yearKey] = {
        key: yearKey,
        label: hasYear ? `${normalizedYear}` : 'Other',
        items: [],
      }
      orderedKeys.push(yearKey)
    }
    groups[yearKey].items.push(item)
  }

  return orderedKeys.map((key) => groups[key])
})

const formatMonthDay = (value?: string | Date) => {
  const formatted = formatDate(value)
  return formatted ? formatted.slice(5) : ''
}

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
    path: '/articles',
    title: '記事一覧',
    description: '技術や制作に関する記事一覧です。',
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
  <div class="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 pb-16">
    <div
      class="flex flex-col gap-10 lg:ml-40 lg:mr-6 lg:flex-row lg:items-start lg:gap-12 xl:gap-20"
    >
      <aside class="hidden lg:flex lg:flex-[1.8]" aria-hidden="true">
        <div class="w-full" />
      </aside>
      <div class="w-full lg:flex-none lg:max-w-md lg:self-start">
        <div
          class="article-panel rounded-2xl border border-white/30 p-8 sm:px-10 sm:py-8"
        >
          <section
            v-for="(group, groupIndex) in groupedArticles"
            :key="group.key"
            :class="[
              'flex flex-col gap-3 text-[var(--text)]',
              groupIndex === 0 ? '' : 'mt-24',
            ]"
          >
            <p
              class="text-xs uppercase tracking-[0.5em] text-[color-mix(in_srgb,var(--text)_75%,transparent)]"
            >
              {{ group.label }}
            </p>
            <div class="mt-1.5 flex flex-col gap-3.5">
              <NuxtLink
                v-for="(article, articleIndex) in group.items"
                :key="article.path"
                :to="toAbsolutePath(article.path)"
                :class="[
                  'group block pt-1 transition hover:translate-x-1',
                  articleIndex === 0 ? 'mt-8' : 'mt-0',
                ]"
              >
                <div class="flex flex-col gap-1.5">
                  <div
                    class="text-[11px] tracking-[0.25em] text-[color-mix(in_srgb,var(--text)_70%,transparent)]"
                  >
                    <span v-if="article.date">
                      {{ formatMonthDay(article.date) }}
                    </span>
                  </div>
                  <h2
                    class="text-lg font-normal tracking-[0.02em] leading-[1.55] text-[#2a2a2a]"
                  >
                    {{ article.title }}
                  </h2>
                </div>
              </NuxtLink>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>
