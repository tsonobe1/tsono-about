<script setup lang="ts">
const shouldAnimate = useState('page-transition-enabled', () => true)
</script>

<template>
  <NuxtLayout>
    <Transition name="page" mode="out-in" :css="shouldAnimate">
      <NuxtPage />
    </Transition>
  </NuxtLayout>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition:
    opacity 250ms ease,
    transform 250ms ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
