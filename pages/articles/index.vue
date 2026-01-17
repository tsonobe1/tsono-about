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

const articles = computed(() => data.value ?? [])
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-4xl flex-col gap-10 px-6 py-16">
    <MainNav />
    <div class="grid gap-6">
      <NuxtLink
        v-for="article in articles"
        :key="article.path"
        :to="toAbsolutePath(article.path)"
        class="card group transition hover:border-[var(--accent)]"
      >
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2 text-xs tracking-widest">
            <span
              class="rounded border border-white/10 px-2 py-0.5 text-[var(--accent)]"
            >
              {{ article.kind }}
            </span>
            <span class="muted" v-if="article.date">{{
              formatDate(article.date)
            }}</span>
          </div>
          <h2 class="text-xl font-semibold text-[var(--text)]">
            {{ article.title }}
          </h2>
          <p class="text-sm text-white/70" v-if="article.summary">
            {{ article.summary }}
          </p>
          <div
            class="flex flex-wrap gap-2 text-xs text-[var(--accent)]"
            v-if="article.tags?.length"
          >
            <span v-for="tag in article.tags" :key="tag">#{{ tag }}</span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
