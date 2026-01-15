<script setup lang="ts">
import { formatDate } from '~/utils/formatDate'

const { data: doc } = await useAsyncData('about-doc', () =>
  queryCollection('career').where('path', '=', '/career/index').first(),
)
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-6 py-16">
    <MainNav />

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
