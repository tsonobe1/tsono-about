<script setup lang="ts">
const TYPES = [
  { key: 'app', label: 'App' },
  { key: 'music', label: 'Music' },
  { key: 'diy', label: 'DIY' },
  { key: 'design', label: 'Design' },
  { key: 'other', label: 'Other' },
] as const

type GalleryType = (typeof TYPES)[number]['key']

const runtimeConfig = useRuntimeConfig()

if (!runtimeConfig.public.isGalleryPublic) {
  throw createError({ statusCode: 404, statusMessage: 'Not Found' })
}

const route = useRoute()
const selected = computed<GalleryType>(() => {
  const q = route.query.type
  return typeof q === 'string' && TYPES.some((t) => t.key === q)
    ? (q as GalleryType)
    : 'app'
})

const { data: items } = await useAsyncData('gallery', () =>
  queryCollection('gallery').all(),
)

const filtered = computed(() => {
  const list = items.value ?? []
  return list
    .filter((x) => x.type === selected.value)
    .sort((a, b) => b.year - a.year || (b.order ?? 0) - (a.order ?? 0))
})

const FALLBACK_IMAGE = '/images/portfolio/sample.svg' as const

const displayItems = computed(() =>
  filtered.value.map((item) => ({
    ...item,
    cover: item.cover ?? FALLBACK_IMAGE,
  })),
)

const onImageError = (event: Event) => {
  const target = event.target as HTMLImageElement | null
  if (!target || target.dataset.fallbackApplied === 'true') {
    return
  }
  target.dataset.fallbackApplied = 'true'
  target.src = FALLBACK_IMAGE
}
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 pb-16">
    <section class="flex flex-col gap-8">
      <div
        class="flex flex-wrap items-center gap-4 border-b border-[var(--border)] px-2 pb-4"
      >
        <span class="text-[var(--accent)]" aria-hidden="true">
          <svg
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M3 4h18l-7.5 9v6.5l-3 1.5V13L3 4Z"
              fill="currentColor"
              stroke="none"
            />
          </svg>
        </span>
        <div class="flex flex-wrap gap-3">
          <NuxtLink
            v-for="type in TYPES"
            :key="type.key"
            :to="{ query: { type: type.key } }"
            class="rounded-full border px-4 py-1 text-sm transition"
            :class="
              selected === type.key
                ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                : 'border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
            "
          >
            {{ type.label }}
          </NuxtLink>
        </div>
      </div>

      <div class="grid gap-6 sm:grid-cols-2">
        <component
          :is="item.url ? 'a' : 'div'"
          v-for="item in displayItems"
          :key="item._id || item._path || item.title"
          v-bind="
            item.url
              ? { href: item.url, target: '_blank', rel: 'noopener noreferrer' }
              : {}
          "
          class="card group overflow-hidden p-0"
        >
          <div class="relative aspect-video overflow-hidden">
            <img
              :src="item.cover"
              :alt="`${item.title} preview`"
              loading="lazy"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              @error="onImageError"
            />
            <div
              class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100"
            />
          </div>
          <div class="space-y-2 border-t border-[color-mix(in_srgb,var(--border)_70%,transparent)] px-5 py-4">
            <div class="flex items-center justify-between gap-2">
              <p class="text-xs uppercase tracking-wide text-[var(--accent)]">
                {{ item.type }}
              </p>
              <span class="text-sm text-[var(--muted)]">{{ item.year }}</span>
            </div>
            <h3 class="text-lg font-semibold text-[var(--text)]">
              {{ item.title }}
            </h3>
            <p v-if="item.description" class="muted text-sm">
              {{ item.description }}
            </p>
          </div>
        </component>
      </div>
    </section>
  </div>
</template>
