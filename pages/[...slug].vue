<script setup lang="ts">
import type { Collections, ContentNavigationItem } from '@nuxt/content'
import { setResponseStatus } from 'h3'
import { formatDate } from '~/utils/formatDate'
import { buildContentMeta, FALLBACK_SITE_TITLE } from '~/utils/contentMeta'

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

const shouldSurround =
  computed(() => collectionKey.value === 'article' || collectionKey.value === 'diary')

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

if (import.meta.server) {
  const event = useRequestEvent()
  if (event && !doc.value) {
    setResponseStatus(event, 404, 'Not Found')
  }
}

type SurroundingItem =
  | (ContentNavigationItem & { date?: string | Date | null })
  | null

const surroundingsCacheKey = computed(
  () =>
    `content-surroundings:${collectionKey.value ?? 'none'}:${currentPath.value}`,
)

const { data: surroundings } = await useAsyncData<
  (SurroundingItem | null)[] | null
>(
  () => surroundingsCacheKey.value,
  async () => {
    if (!shouldSurround.value || !collectionKey.value) {
      return [null, null]
    }
    const items = await queryCollectionItemSurroundings(
      collectionKey.value,
      currentPath.value,
      {
        before: 1,
        after: 1,
        fields: ['date'],
      },
    )
      .order('date', 'DESC')
    return items as (SurroundingItem | null)[]
  },
  { watch: [collectionKey, currentPath, shouldSurround] },
)

const previousLink = computed<SurroundingItem>(() => {
  const raw = surroundings.value ?? []
  return (raw[0] as SurroundingItem) || null
})
const nextLink = computed<SurroundingItem>(() => {
  const raw = surroundings.value ?? []
  return (raw[1] as SurroundingItem) || null
})
const hasSurroundingLinks = computed(
  () => !!previousLink.value || !!nextLink.value,
)

const surroundingLabels = computed(() => ({
  prev: '←',
  next: '→',
}))

const formatSurroundingDate = (item: SurroundingItem) => {
  if (!item?.date) {
    return ''
  }
  return formatDate(item.date)
}

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

const formattedUpdatedAt = computed(() => {
  const value = doc.value as null | { updatedAt?: string | Date }
  if (
    value &&
    typeof value === 'object' &&
    'updatedAt' in value &&
    value.updatedAt
  ) {
    return formatDate(value.updatedAt)
  }
  return ''
})

const introText = computed(() => {
  if (collectionKey.value === 'diary') {
    // Diaryでは description を明示的に指定していない場合に本文の抜粋が表示されないようにする
    return ''
  }
  const value = doc.value as null | {
    description?: string | null
  }
  if (
    value &&
    typeof value === 'object' &&
    'description' in value &&
    value.description
  ) {
    return value.description
  }
  return ''
})

const runtimeConfig = useRuntimeConfig()

const siteTitle = computed(() => {
  const title =
    runtimeConfig.public?.siteTitle ?? FALLBACK_SITE_TITLE
  return typeof title === 'string' && title.trim()
    ? title
    : FALLBACK_SITE_TITLE
})

const seoMeta = computed(() => {
  const value = doc.value as null | {
    title?: string | null
    description?: string | null
  }
  return buildContentMeta(value ?? undefined, {
    siteTitle: siteTitle.value,
  })
})

const titleRef = computed(() => seoMeta.value.title)
const descriptionRef = computed(() => seoMeta.value.description)

useSeoMeta({
  title: titleRef,
  ogTitle: titleRef,
  twitterTitle: titleRef,
  description: descriptionRef,
  ogDescription: descriptionRef,
  twitterDescription: descriptionRef,
})
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-3xl flex-col gap-10 px-6 pb-16">
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
        <div
          v-if="formattedDate || formattedUpdatedAt"
          class="flex flex-wrap gap-4 text-xs uppercase tracking-widest text-[var(--muted)]"
        >
          <span v-if="formattedDate">公開日 {{ formattedDate }}</span>
          <span v-if="formattedUpdatedAt">更新日 {{ formattedUpdatedAt }}</span>
        </div>
        <p v-if="introText" class="muted text-base">
          {{ introText }}
        </p>
      </header>

      <div class="card content">
        <ContentRenderer :value="doc" />
      </div>

      <nav
        v-if="hasSurroundingLinks"
        class="rounded-2xl border border-[color-mix(in_srgb,var(--border)_80%,transparent)] bg-[color-mix(in_srgb,var(--panel)_90%,transparent)] px-4 py-5 sm:px-6"
        aria-label="前後のコンテンツ"
      >
        <div class="grid gap-4 sm:grid-cols-2">
          <NuxtLink
            v-if="previousLink"
            :to="previousLink.path"
            class="group flex flex-col gap-1 rounded-xl border border-transparent p-3 transition hover:border-[var(--accent)]/30 hover:bg-white/60"
          >
            <span
              class="text-base font-semibold text-[color-mix(in_srgb,var(--text)_55%,transparent)]"
            >
              {{ surroundingLabels.prev }}
            </span>
            <span class="text-base font-semibold text-[var(--text)]">
              {{ previousLink.title }}
            </span>
            <span
              v-if="formatSurroundingDate(previousLink)"
              class="text-xs text-[var(--muted)]"
            >
              {{ formatSurroundingDate(previousLink) }}
            </span>
          </NuxtLink>
          <NuxtLink
            v-if="nextLink"
            :to="nextLink.path"
            class="group flex flex-col gap-1 rounded-xl border border-transparent p-3 text-right transition hover:border-[var(--accent)]/30 hover:bg-white/60"
          >
            <span
              class="text-base font-semibold text-[color-mix(in_srgb,var(--text)_55%,transparent)]"
            >
              {{ surroundingLabels.next }}
            </span>
            <span class="text-base font-semibold text-[var(--text)]">
              {{ nextLink.title }}
            </span>
            <span
              v-if="formatSurroundingDate(nextLink)"
              class="text-xs text-[var(--muted)]"
            >
              {{ formatSurroundingDate(nextLink) }}
            </span>
          </NuxtLink>
        </div>
      </nav>
    </article>

    <p v-else class="muted text-center text-sm">
      コンテンツが見つかりませんでした。
    </p>
  </div>
</template>
