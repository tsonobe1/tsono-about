<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    src?: string
    alt?: string
    title?: string
  }>(),
  {
    src: '',
    alt: '',
    title: '',
  },
)

const isModalOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const dialogRef = ref<HTMLDivElement | null>(null)
const previouslyFocusedElement = ref<HTMLElement | null>(null)

const dialogLabel = computed(
  () => props.alt?.trim() || props.title?.trim() || '画像プレビュー',
)

const FOCUSABLE_SELECTORS =
  'a[href],area[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

function openModal() {
  if (!props.src || !import.meta.client) {
    return
  }
  previouslyFocusedElement.value =
    (document.activeElement as HTMLElement | null) ?? null
  isModalOpen.value = true
}

function closeModal() {
  if (!isModalOpen.value) {
    return
  }
  isModalOpen.value = false
}

function restoreFocus() {
  const candidates = [triggerRef.value, previouslyFocusedElement.value]
  for (const candidate of candidates) {
    if (candidate && typeof candidate.focus === 'function') {
      candidate.focus()
      break
    }
  }
}

function trapFocus(event: KeyboardEvent) {
  const dialog = dialogRef.value
  if (!dialog || !import.meta.client) {
    return
  }
  const focusable = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
  if (focusable.length === 0) {
    event.preventDefault()
    dialog.focus()
    return
  }

  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  const active = document.activeElement as HTMLElement | null

  if (event.shiftKey) {
    if (active === first || !active) {
      event.preventDefault()
      last.focus()
    }
    return
  }

  if (active === last) {
    event.preventDefault()
    first.focus()
  }
}

const handleGlobalKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    event.preventDefault()
    closeModal()
    return
  }

  if (event.key === 'Tab') {
    trapFocus(event)
  }
}

watch(isModalOpen, async (open) => {
  if (!import.meta.client) {
    return
  }

  if (open) {
    document.addEventListener('keydown', handleGlobalKeydown)
    await nextTick()
    dialogRef.value?.focus()
  } else {
    document.removeEventListener('keydown', handleGlobalKeydown)
    await nextTick()
    restoreFocus()
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.removeEventListener('keydown', handleGlobalKeydown)
  }
})
</script>

<template>
  <figure
    v-if="props.src"
    class="my-8 flex flex-col items-center gap-3 text-center"
  >
    <img
      ref="triggerRef"
      :src="props.src"
      :alt="props.alt"
      :title="props.title || undefined"
      class="max-w-full max-h-[70vh] cursor-zoom-in rounded-xl border border-[color-mix(in_srgb,var(--border)_75%,transparent)] object-contain focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
      loading="lazy"
      decoding="async"
      role="button"
      tabindex="0"
      aria-haspopup="dialog"
      @click="openModal"
      @keydown.enter.prevent="openModal"
      @keydown.space.prevent="openModal"
    />
    <figcaption v-if="props.alt" class="text-sm muted">
      {{ props.alt }}
    </figcaption>
  </figure>

  <Teleport to="body">
    <Transition name="prose-img-fade">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        :aria-label="dialogLabel"
        @click.self="closeModal"
      >
        <div
          ref="dialogRef"
          class="relative mx-auto flex h-full w-full max-w-5xl items-center justify-center p-6"
          tabindex="-1"
        >
          <button
            type="button"
            class="absolute right-6 top-6 rounded-full bg-black/70 px-3 py-1 text-sm font-medium text-white transition hover:bg-black"
            @click="closeModal"
          >
            閉じる
          </button>
          <img
            :src="props.src"
            :alt="props.alt"
            :title="props.title || undefined"
            class="max-h-[85vh] w-full rounded-2xl object-contain shadow-2xl"
            style="max-width: min(90vw, 1200px)"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.prose-img-fade-enter-active,
.prose-img-fade-leave-active {
  transition: opacity 0.2s ease;
}

.prose-img-fade-enter-from,
.prose-img-fade-leave-to {
  opacity: 0;
}
</style>
