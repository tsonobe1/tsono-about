<script setup lang="ts">
const PRIMARY_LINKS = [
  { key: 'articles', label: 'Article', to: '/articles' },
  { key: 'diary', label: 'Diary', to: '/diary' },
  { key: 'gallery', label: 'Gallery', to: '/gallery' },
] as const

const ISLAND_LINK = { key: 'about', label: 'About', to: '/about' } as const

const route = useRoute()
const router = useRouter()

const isActive = (to: string) => {
  if (to === '/') {
    return route.path === '/'
  }
  return route.path === to || route.path.startsWith(`${to}/`)
}

const shouldReturnHome = (key: string) =>
  (key === 'articles' || key === 'diary') && isActive(`/${key}`)

const handlePrimaryClick = (
  event: MouseEvent,
  item: (typeof PRIMARY_LINKS)[number],
) => {
  if (shouldReturnHome(item.key)) {
    event.preventDefault()
    router.push('/')
  }
}
</script>

<template>
  <nav
    class="mx-auto mt-2 mb-6 flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 text-[0.72rem] uppercase tracking-[0.35em]"
  >
    <div
      class="flex flex-wrap items-center gap-4 text-[color-mix(in_srgb,var(--text)_60%,transparent)]"
    >
      <NuxtLink
        v-for="item in PRIMARY_LINKS"
        :key="item.key"
        :to="item.to"
        @click="(event) => handlePrimaryClick(event, item)"
        :class="[
          'border-b border-transparent pb-1 font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]',
          isActive(item.to)
            ? 'text-[var(--text)] border-b border-[color-mix(in_srgb,var(--text)_65%,transparent)]'
            : 'text-[color-mix(in_srgb,var(--text)_40%,transparent)] hover:text-[var(--text)]',
        ]"
        :aria-current="isActive(item.to) ? 'page' : undefined"
      >
        {{ item.label }}
      </NuxtLink>
    </div>

    <NuxtLink
      :to="ISLAND_LINK.to"
      :class="[
        'border-b border-transparent pb-1 font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]',
        isActive(ISLAND_LINK.to)
          ? 'text-[var(--text)] border-b border-[color-mix(in_srgb,var(--text)_65%,transparent)]'
          : 'text-[color-mix(in_srgb,var(--text)_40%,transparent)] hover:text-[var(--text)]',
      ]"
      :aria-current="isActive(ISLAND_LINK.to) ? 'page' : undefined"
    >
      {{ ISLAND_LINK.label }}
    </NuxtLink>
  </nav>
</template>
