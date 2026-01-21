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
  if (props.src) {
    isModalOpen.value = true
  }
}

function closeModal() {
  isModalOpen.value = false
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isModalOpen.value) {
    closeModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <figure
    v-if="props.src"
    class="my-8 flex flex-col items-center gap-3 text-center"
  >
    <img
      :src="props.src"
      :alt="props.alt"
      :title="props.title || undefined"
      class="max-w-full max-h-[70vh] cursor-zoom-in rounded-xl border border-[color-mix(in_srgb,var(--border)_75%,transparent)] object-contain"
      loading="lazy"
      decoding="async"
      @click="openModal"
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
        @click="closeModal"
      >
        <div class="flex h-full w-full items-center justify-center p-6">
          <img
            :src="props.src"
            :alt="props.alt"
            :title="props.title || undefined"
            class="max-h-[85vh] w-full rounded-2xl border border-[color-mix(in_srgb,var(--border)_85%,transparent)] object-contain shadow-2xl"
            style="max-width: min(90vw, 1200px)"
            @click.stop
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
