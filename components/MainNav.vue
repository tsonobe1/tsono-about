<script setup lang="ts">
const NAV_LINKS = [
  { key: 'articles', label: 'Article', to: '/articles' },
  { key: 'diary', label: 'Diary', to: '/diary' },
  { key: 'portfolio', label: 'Portfolio', to: '/portfolio' },
  { key: 'about', label: 'About', to: '/about' },
] as const

const route = useRoute()

const isActive = (to: string) => {
  if (to === '/') {
    return route.path === '/'
  }
  return route.path === to || route.path.startsWith(`${to}/`)
}
</script>

<template>
  <nav
    class="mx-auto mt-4 mb-8 flex max-w-2xl flex-wrap items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5/60 p-1 text-sm tracking-wide shadow-[0_8px_24px_rgba(5,9,20,0.35)] backdrop-blur"
  >
    <NuxtLink
      v-for="item in NAV_LINKS"
      :key="item.key"
      :to="item.to"
      :class="[
        'relative inline-flex min-w-[88px] items-center justify-center rounded-full px-4 py-1.5 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]',
        isActive(item.to)
          ? 'bg-[var(--accent)] text-[#081014] shadow-[0_6px_18px_rgba(111,186,223,0.28)]'
          : 'text-[var(--muted)] hover:bg-white/10 hover:text-[var(--text)]',
      ]"
      :aria-current="isActive(item.to) ? 'page' : undefined"
    >
      {{ item.label }}
    </NuxtLink>
  </nav>
</template>
