<script setup lang="ts">
const PRIMARY_LINKS = [
  { key: 'articles', label: 'Article', to: '/articles' },
  { key: 'diary', label: 'Diary', to: '/diary' },
  { key: 'gallery', label: 'Gallery', to: '/gallery' },
] as const

const ISLAND_LINK = { key: 'about', label: 'About', to: '/about' } as const

const route = useRoute()
const router = useRouter()

const primaryActive = computed(() => {
  if (route.path === '/') {
    return true
  }
  return ['/articles', '/diary', '/gallery'].some((prefix) =>
    route.path.startsWith(prefix),
  )
})

const aboutActive = computed(() => route.path.startsWith('/about'))

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
    class="mx-auto mt-4 mb-8 flex max-w-3xl flex-wrap items-center justify-center gap-4 text-sm tracking-wide"
  >
    <div
      :class="[
        'inline-flex flex-wrap items-center justify-center gap-2 rounded-full px-2 py-1.5 transition-all duration-200',
        primaryActive
          ? 'border border-[var(--accent)]'
          : 'border border-[var(--border)]',
      ]"
    >
      <NuxtLink
        v-for="item in PRIMARY_LINKS"
        :key="item.key"
        :to="item.to"
        @click="(event) => handlePrimaryClick(event, item)"
        :class="[
          'relative inline-flex min-w-[88px] items-center justify-center rounded-full px-4 py-1.5 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]',
          isActive(item.to)
            ? 'bg-[var(--accent)] text-white shadow-[0_6px_18px_rgba(47,109,246,0.28)]'
            : 'text-[var(--muted)] hover:bg-[color-mix(in_srgb,var(--border)_25%,transparent)] hover:text-[var(--text)]',
        ]"
        :aria-current="isActive(item.to) ? 'page' : undefined"
      >
        {{ item.label }}
      </NuxtLink>
    </div>

    <div
      :class="[
        'inline-flex items-center justify-center rounded-full px-2 py-1.5 transition-all duration-200',
        aboutActive
          ? 'border border-[var(--accent)]'
          : 'border border-[var(--border)]',
      ]"
    >
      <NuxtLink
        :to="ISLAND_LINK.to"
        :class="[
          'relative inline-flex min-w-[88px] items-center justify-center rounded-full px-4 py-1.5 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]',
          isActive(ISLAND_LINK.to)
            ? 'bg-[var(--accent)] text-white shadow-[0_6px_18px_rgba(47,109,246,0.28)]'
            : 'text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]',
        ]"
        :aria-current="isActive(ISLAND_LINK.to) ? 'page' : undefined"
      >
        {{ ISLAND_LINK.label }}
      </NuxtLink>
    </div>
  </nav>
</template>
