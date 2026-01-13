<script setup lang="ts">
const formatDate = (value?: string) =>
  value
    ? new Intl.DateTimeFormat('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date(value))
    : ''
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-4xl flex-col gap-10 px-6 py-16">
    <header class="space-y-3">
      <p class="muted text-sm uppercase tracking-wide">Nuxt Content</p>
      <h1 class="text-4xl font-semibold">記事一覧</h1>
      <p class="muted">
        Markdownで作成した記事を一覧表示しています。カードを押すと記事詳細に移動します。
      </p>
    </header>

    <ContentList v-slot="{ list }" path="/">
      <div class="grid gap-6">
        <NuxtLink
          v-for="article in list"
          :key="article._path"
          :to="article._path"
          class="card group transition hover:border-[var(--accent)]"
        >
          <div class="flex flex-col gap-2">
            <p class="muted text-xs uppercase tracking-widest">Article</p>
            <h2 class="text-2xl font-semibold text-[var(--text)]">
              {{ article.title }}
            </h2>
            <p v-if="article.date" class="muted text-xs">
              {{ formatDate(article.date) }}
            </p>
            <p class="muted text-sm">
              {{ article.description }}
            </p>
            <span class="text-sm text-[var(--accent)]">続きを読む →</span>
          </div>
        </NuxtLink>
      </div>
    </ContentList>
  </div>
</template>
