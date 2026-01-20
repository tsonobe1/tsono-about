<script setup lang="ts">
import { formatDate } from '~/utils/formatDate'

const toAbsolutePath = (path?: string | null) =>
  path ? (path.startsWith('/') ? path : `/${path}`) : '/'

const { data: articlesData } = await useAsyncData('home-articles', () =>
  queryCollection('article')
    .select('path', 'title', 'date', 'summary', 'description', 'kind', 'tags')
    .order('date', 'DESC')
    .all(),
)

const { data: diaryData } = await useAsyncData('home-diary', () =>
  queryCollection('diary')
    .select('path', 'title', 'date', 'category', 'description')
    .order('date', 'DESC')
    .all(),
)

type TimelinedEntry = {
  type: 'article' | 'diary'
  path?: string | null
  date?: string | Date | null
  title?: string | null
  summary?: string | null
  description?: string | null
  kind?: string | null
  category?: string | null
}

const timeline = computed<TimelinedEntry[]>(() => {
  const articles = (articlesData.value ?? []).map((item) => ({
    ...item,
    type: 'article' as const,
    summary: item.summary ?? item.description ?? '',
  }))
  const diaries = (diaryData.value ?? []).map((item) => ({
    ...item,
    type: 'diary' as const,
    summary: item.description ?? '',
  }))
  return [...articles, ...diaries].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0
    const dateB = b.date ? new Date(b.date).getTime() : 0
    return dateB - dateA
  })
})

const typeLabel = (entry: TimelinedEntry) =>
  entry.type === 'article'
    ? (entry.kind ?? 'article')
    : (entry.category ?? 'diary')
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-4xl flex-col gap-10 px-6 py-16">
    <MainNav />

    <div class="grid gap-6">
      <NuxtLink
        v-for="entry in timeline"
        :key="entry.path"
        :to="toAbsolutePath(entry.path)"
        class="card transition"
      >
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3 text-xs tracking-widest">
            <span
              class="rounded border border-white/10 px-2 py-0.5 text-[var(--accent)]"
            >
              {{ typeLabel(entry) }}
            </span>
            <span class="muted">
              {{ entry.date ? formatDate(entry.date) : '----/--/--' }}
            </span>
          </div>
          <h2 class="text-xl font-semibold text-[var(--text)]">
            {{ entry.title }}
          </h2>
        </div>
      </NuxtLink>
      <p v-if="!timeline.length" class="muted text-center text-sm">
        まだ記事も日記もありません。
      </p>
    </div>
  </div>
</template>
