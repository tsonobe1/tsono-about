<script setup lang="ts">
import type { Collections } from '@nuxt/content'
import { formatDate } from '~/utils/formatDate'

const route = useRoute()

const currentPath = computed(() => {
  const slug = route.params.slug
  if (Array.isArray(slug)) {
    return `/${slug.join('/')}`
  }
  if (typeof slug === 'string') {
    return `/${slug}`
  }
  return '/'
})

const collectionKey = computed<keyof Collections | null>(() => {
  if (currentPath.value.startsWith('/articles')) {
    return 'article'
  }
  if (currentPath.value.startsWith('/diary')) {
    return 'diary'
  }
  if (currentPath.value.startsWith('/career')) {
    return 'career'
  }
  return null
})

const contentDocKey = computed(
  () => `content-doc:${collectionKey.value ?? 'none'}:${currentPath.value}`,
)

const { data: doc } = await useAsyncData(
  () => contentDocKey.value,
  async () => {
    const key = collectionKey.value
    if (!key) {
      return null
    }
    return queryCollection(key).where('path', '=', currentPath.value).first()
  },
  { watch: [currentPath, collectionKey] },
)

const backLink = computed(() => {
  if (collectionKey.value === 'article') {
    return { to: '/articles', text: '← 記事一覧に戻る' }
  }
  if (collectionKey.value === 'diary') {
    return { to: '/diary', text: '← 日記一覧に戻る' }
  }
  if (collectionKey.value === 'career') {
    return { to: '/career', text: '← 経歴一覧に戻る' }
  }
  return { to: '/', text: '← トップに戻る' }
})

const formattedDate = computed(() => {
  const value = doc.value as null | { date?: string | Date }
  if (value && typeof value === 'object' && 'date' in value && value.date) {
    return formatDate(value.date)
  }
  return ''
})
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-3xl flex-col gap-10 px-6 py-16">
    <MainNav />
    <NuxtLink
      class="muted text-sm hover:text-[var(--accent)]"
      :to="backLink.to"
    >
      {{ backLink.text }}
    </NuxtLink>

    <article v-if="doc" class="flex flex-col gap-6">
      <header class="space-y-3">
        <h1 class="text-4xl font-semibold text-[var(--text)]">
          {{ doc.title }}
        </h1>
        <p v-if="formattedDate" class="muted text-sm">
          {{ formattedDate }}
        </p>
        <p class="muted text-base">{{ doc.description }}</p>
      </header>

      <div class="card content">
        <ContentRenderer :value="doc" />
      </div>
    </article>

    <p v-else class="muted text-center text-sm">
      コンテンツが見つかりませんでした。
    </p>
  </div>
</template>
