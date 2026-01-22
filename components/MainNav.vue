<script setup lang="ts">
const PRIMARY_LINKS = [
  { key: 'articles', label: 'Article', to: '/articles' },
  { key: 'diary', label: 'Diary', to: '/diary' },
  { key: 'gallery', label: 'Gallery', to: '/gallery' },
] as const

const ISLAND_LINK = { key: 'about', label: 'About', to: '/about' } as const
const NAV_LINKS = [...PRIMARY_LINKS, ISLAND_LINK] as const

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

const handleLinkClick = (
  event: MouseEvent,
  item: (typeof PRIMARY_LINKS)[number] | typeof ISLAND_LINK,
) => {
  if (shouldReturnHome(item.key)) {
    event.preventDefault()
    router.push('/')
  }
}
</script>

<template>
  <nav
    class="mx-auto mt-2 mb-6 flex w-full max-w-4xl flex-wrap items-center justify-center px-8 text-center text-[0.82rem] uppercase tracking-[0.35em]"
  >
    <div
      class="flex flex-wrap items-center justify-center gap-8 text-[color-mix(in_srgb,var(--text)_75%,transparent)]"
    >
      <NuxtLink
        v-for="item in NAV_LINKS"
        :key="item.key"
        :to="item.to"
        @click="(event) => handleLinkClick(event, item)"
        :class="[
          'relative border-b-2 border-transparent pb-1 font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]',
          isActive(item.to)
            ? 'text-[var(--text)] border-[color-mix(in_srgb,var(--text)_85%,transparent)]'
            : 'text-[color-mix(in_srgb,var(--text)_70%,transparent)] hover:text-[var(--text)]',
        ]"
        :aria-current="isActive(item.to) ? 'page' : undefined"
      >
        {{ item.label }}
      </NuxtLink>
    </div>
  </nav>
</template>
