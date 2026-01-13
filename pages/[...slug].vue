<script setup lang="ts">
import { formatDate } from '~/utils/formatDate'
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-3xl flex-col gap-10 px-6 py-16">
    <NuxtLink class="muted text-sm hover:text-[var(--accent)]" to="/">
      ← 記事一覧に戻る
    </NuxtLink>

    <ContentDoc v-slot="{ doc }">
      <article class="flex flex-col gap-6">
        <header class="space-y-3">
          <p class="muted text-xs uppercase tracking-widest">Article</p>
          <h1 class="text-4xl font-semibold text-[var(--text)]">
            {{ doc.title }}
          </h1>
          <p v-if="doc.date" class="muted text-sm">
            {{ formatDate(doc.date) }}
          </p>
          <p class="muted text-base">{{ doc.description }}</p>
        </header>

        <div class="card content">
          <ContentRenderer :value="doc" />
        </div>
      </article>
    </ContentDoc>
  </div>
</template>
