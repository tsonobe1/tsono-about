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
      <img
        :src="props.src"
        :alt="props.alt"
        :title="props.title || undefined"
        class="max-w-full rounded-xl border border-white/10 transition-transform duration-200 ease-out group-hover:-translate-y-1 group-focus-visible:-translate-y-1 group-active:scale-[0.99]"
        loading="lazy"
        decoding="async"
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
          <div class="relative flex max-h-[90vh] max-w-5xl flex-col items-center gap-4">
            <img
              :src="props.src"
              :alt="props.alt"
              :title="props.title || undefined"
              class="max-h-[85vh] w-auto max-w-full rounded-2xl border border-white/10 shadow-2xl"
              loading="lazy"
              decoding="async"
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
