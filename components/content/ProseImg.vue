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
const inlineSizes = '(max-width: 768px) 100vw, 768px'
const modalSizes = '(max-width: 1024px) 90vw, 1200px'
const imageMeta = shallowRef<{ width: number; height: number } | null>(null)
const currentMetaSrc = ref('')
const { getMeta } = useImage()

watch(
  () => props.src,
  async (src) => {
    if (!src) {
      imageMeta.value = null
      currentMetaSrc.value = ''
      return
    }

    currentMetaSrc.value = src
    try {
      const meta = await getMeta(src)
      if (
        currentMetaSrc.value === src &&
        meta &&
        typeof meta.width === 'number' &&
        typeof meta.height === 'number'
      ) {
        imageMeta.value = { width: meta.width, height: meta.height }
      }
    } catch (error) {
      console.warn('[ProseImg] Failed to load image metadata', error)
      if (currentMetaSrc.value === src) {
        imageMeta.value = null
      }
    }
  },
  { immediate: true },
)

function openModal() {
  if (!props.src) {
    return
  }
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

function handleGlobalKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isModalOpen.value) {
    closeModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<template>
  <figure class="my-8 flex flex-col items-center gap-3 text-center">
    <div
      v-if="props.src"
      class="group inline-block cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      tabindex="0"
      role="button"
      aria-label="画像を拡大表示"
      @click="openModal"
      @keydown.enter.prevent="openModal"
      @keydown.space.prevent="openModal"
    >
      <NuxtImg
        :src="props.src"
        :alt="props.alt"
        :title="props.title || undefined"
        :sizes="inlineSizes"
        :width="imageMeta?.width"
        :height="imageMeta?.height"
        class="max-w-full rounded-xl border border-white/10 transition-transform duration-200 ease-out group-hover:-translate-y-1 group-focus-visible:-translate-y-1 group-active:scale-[0.99]"
        loading="lazy"
        decoding="async"
        format="webp"
        placeholder="blur"
      />
    </div>
    <figcaption v-if="props.alt" class="text-sm muted">
      {{ props.alt }}
    </figcaption>
  </figure>

  <Teleport to="body">
    <Transition name="prose-img-fade">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        @click="closeModal"
      >
        <div class="flex h-full w-full items-center justify-center p-6">
          <div
            class="relative flex w-full max-w-4xl flex-col items-center gap-4"
            style="max-height: 90vh"
          >
            <NuxtImg
              :src="props.src"
              :alt="props.alt"
              :title="props.title || undefined"
              :sizes="modalSizes"
              :width="imageMeta?.width"
              :height="imageMeta?.height"
              class="max-h-[85vh] w-full max-w-3xl rounded-2xl border border-white/10 object-contain shadow-2xl"
              loading="lazy"
              decoding="async"
              format="webp"
              placeholder="blur"
              @click.stop
            />
            <p v-if="props.alt" class="text-sm text-white/80">
              {{ props.alt }}
            </p>
          </div>
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
