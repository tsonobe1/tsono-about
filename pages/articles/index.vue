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

const articles = computed<ArticleEntry[]>(() => (data.value ?? []) as ArticleEntry[])

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

const formatMonthDay = (value?: string | Date) => {
  const formatted = formatDate(value)
  return formatted ? formatted.slice(5) : ''
}
</script>

<template>
  <div
    class="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-16 lg:ml-40 lg:mr-6"
  >
    <MainNav />
    <div
      class="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12 xl:gap-20"
    >
      <aside class="hidden lg:flex lg:flex-[1.8]" aria-hidden="true">
        <div class="w-full" />
      </aside>
      <div class="w-full lg:flex-none lg:max-w-md lg:self-start">
        <div class="flex w-full flex-col gap-12">
          <section
            v-for="group in groupedArticles"
            :key="group.key"
            class="flex flex-col gap-3"
          >
            <p class="text-xs uppercase tracking-[0.5em] text-[var(--muted)]">
              {{ group.label }}
            </p>
            <div class="flex flex-col gap-3">
              <NuxtLink
                v-for="(article, index) in group.items"
                :key="article.path"
                :to="toAbsolutePath(article.path)"
                class="group block pb-3 pt-1 transition hover:translate-x-1"
                :class="index === 0 ? 'pt-0.5' : ''"
              >
                <div class="flex flex-col gap-1.5">
                  <div
                    class="text-[11px] tracking-[0.3em] text-[color-mix(in_srgb,var(--text)_40%,transparent)]"
                  >
                    <span v-if="article.date">
                      {{ formatMonthDay(article.date) }}
                    </span>
                  </div>
                  <h2
                    class="text-base font-semibold leading-[1.4] text-[var(--text)]"
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
