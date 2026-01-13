<script setup lang="ts">
const props = defineProps<{
  href?: string
}>()

const isExternal = computed(() =>
  props.href ? /^(https?:)?\/\//.test(props.href) : false,
)
</script>

<template>
  <a
    :href="href"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
  >
    <slot />
  </a>
</template>
