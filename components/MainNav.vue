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
  <nav class="mt-4 mb-6 flex flex-wrap items-center justify-center gap-8 text-sm tracking-wide">
    <NuxtLink
      v-for="item in NAV_LINKS"
      :key="item.key"
      :to="item.to"
      :class="[
        'inline-flex min-w-[80px] items-center justify-center px-2 py-1 transition hover:text-[var(--accent)]',
        isActive(item.to)
          ? 'text-base font-semibold text-[var(--accent)]'
          : 'text-[var(--text)]'
      ]"
      :aria-current="isActive(item.to) ? 'page' : undefined"
    >
      {{ item.label }}
    </NuxtLink>
  </nav>
</template>
