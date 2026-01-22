<script setup lang="ts">
import { formatDate } from '~/utils/formatDate'

const toAbsolutePath = (path?: string | null) =>
  path ? (path.startsWith('/') ? path : `/${path}`) : '/'

const { data } = await useAsyncData('articles-page', () =>
  queryCollection('article')
    .select('path', 'title', 'date', 'summary', 'description', 'kind', 'tags')
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
    const hasDate = !!item.date
    const yearKey = hasDate
      ? String(new Date(item.date as string | number | Date).getFullYear())
      : 'no-date'
    if (!groups[yearKey]) {
      groups[yearKey] = {
        key: yearKey,
        label: hasDate ? `${yearKey}` : 'Other',
        items: [],
      }
      orderedKeys.push(yearKey)
    }
    groups[yearKey].items.push(item)
  }

  return orderedKeys.map((key) => groups[key])
})

const seasonalAccent = computed(() => {
  const month = new Date().getMonth()
  if (month >= 2 && month <= 4) {
    return {
      key: 'spring',
      label: 'spring light',
      src: '/images/accents/season-spring.jpg',
    }
  }
  if (month >= 5 && month <= 7) {
    return {
      key: 'summer',
      label: 'summer light',
      src: '/images/accents/season-summer.jpg',
    }
  }
  if (month >= 8 && month <= 10) {
    return {
      key: 'autumn',
      label: 'autumn light',
      src: '/images/accents/season-autumn.jpg',
    }
  }
  return {
    key: 'winter',
    label: 'winter light',
    src: '/images/accents/season-winter.jpg',
  }
})

const formatMonthDay = (value?: string | Date) => {
  const formatted = formatDate(value)
  return formatted ? formatted.slice(5) : ''
}
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-16">
    <MainNav />
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
