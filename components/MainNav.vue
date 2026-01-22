<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'

const PRIMARY_LINKS = [
  { key: 'articles', label: 'Article', to: '/articles' },
  { key: 'diary', label: 'Diary', to: '/diary' },
  { key: 'gallery', label: 'Gallery', to: '/gallery' },
] as const

const ISLAND_LINK = { key: 'about', label: 'About', to: '/about' } as const
const NAV_LINKS = [...PRIMARY_LINKS, ISLAND_LINK] as const

const route = useRoute()
const router = useRouter()
const navContainerRef = ref<HTMLElement | null>(null)
const indicatorStyle = ref({
  transform: 'translateX(0)',
  width: '0px',
  opacity: '0',
})
const linkRefs = new Map<string, HTMLElement>()

const isActive = (to: string) => {
  if (to === '/') {
    return route.path === '/'
  }
  return route.path === to || route.path.startsWith(`${to}/`)
}

const shouldReturnHome = (key: string) =>
  (key === 'articles' || key === 'diary') && isActive(`/${key}`)

const activeKey = computed(
  () => NAV_LINKS.find((link) => isActive(link.to))?.key ?? null,
)

const resetIndicator = () => {
  indicatorStyle.value = {
    transform: 'translateX(0)',
    width: '0px',
    opacity: '0',
  }
}

const setLinkRef = (key: string, el: Element | null) => {
  if (el instanceof HTMLElement) {
    linkRefs.set(key, el)
  } else {
    linkRefs.delete(key)
  }
}

const updateIndicator = (keyOverride?: string | null) => {
  const targetKey = keyOverride ?? activeKey.value
  if (!targetKey) {
    resetIndicator()
    return
  }

  const targetEl = linkRefs.get(targetKey)
  const containerEl = navContainerRef.value

  if (!targetEl || !containerEl) {
    resetIndicator()
    return
  }

  const linkRect = targetEl.getBoundingClientRect()
  const containerRect = containerEl.getBoundingClientRect()

  indicatorStyle.value = {
    transform: `translateX(${linkRect.left - containerRect.left}px)`,
    width: `${linkRect.width}px`,
    opacity: '1',
  }
}

const handleResize = () => updateIndicator()

onMounted(() => {
  nextTick(() => updateIndicator())
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

watch(activeKey, async (newKey) => {
  if (!newKey) {
    resetIndicator()
    return
  }

  await nextTick()
  updateIndicator(newKey)
})

const handleLinkClick = (
  event: MouseEvent,
  item: (typeof PRIMARY_LINKS)[number] | typeof ISLAND_LINK,
) => {
  updateIndicator(item.key)
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
      ref="navContainerRef"
      class="relative flex flex-wrap items-center justify-center gap-8 text-[color-mix(in_srgb,var(--text)_75%,transparent)]"
    >
      <span
        class="pointer-events-none absolute bottom-0 left-0 h-[2px] translate-y-1 rounded-2xl bg-[var(--text)] opacity-0 transition-[opacity,transform,width] duration-300 ease-out"
        :style="indicatorStyle"
        aria-hidden="true"
      />
      <div
        v-for="item in NAV_LINKS"
        :key="item.key"
        :ref="(el) => setLinkRef(item.key, el)"
        class="flex"
      >
        <NuxtLink
          :to="item.to"
          @click="(event) => handleLinkClick(event, item)"
          :class="[
            'pb-1 font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]',
            isActive(item.to)
              ? 'text-[var(--text)]'
              : 'text-[color-mix(in_srgb,var(--text)_70%,transparent)] hover:text-[var(--text)]',
          ]"
          :aria-current="isActive(item.to) ? 'page' : undefined"
        >
          {{ item.label }}
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>
