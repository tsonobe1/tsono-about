<script setup lang="ts">
import type { VNodeArrayChildren, VNodeChild } from 'vue'
import { buildYouTubeEmbedUrl } from '~/utils/youtube'

const props = defineProps<{
  href?: string
}>()

const slots = useSlots()

const isExternal = computed(() =>
  props.href ? /^(https?:)?\/\//.test(props.href) : false,
)

const slotText = computed(() => extractText(slots.default?.()).trim())
const hrefValue = computed(() => props.href?.trim() ?? '')

const youtubeEmbedUrl = computed(() => {
  if (!hrefValue.value) {
    return null
  }
  if (slotText.value !== hrefValue.value) {
    return null
  }
  return buildYouTubeEmbedUrl(hrefValue.value)
})

const shouldRenderPlayer = computed(() => Boolean(youtubeEmbedUrl.value))

function extractText(nodes?: VNodeArrayChildren): string {
  if (!nodes) {
    return ''
  }
  return nodes.map((node) => normalizeNodeText(node)).join('')
}

function normalizeNodeText(node: VNodeChild): string {
  if (node == null || typeof node === 'boolean') {
    return ''
  }

  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
  }

  if (Array.isArray(node)) {
    return node.map((child) => normalizeNodeText(child)).join('')
  }

  if (typeof node === 'object' && 'children' in node && node.children) {
    const children = node.children
    if (Array.isArray(children)) {
      return (children as VNodeChild[])
        .map((child) => normalizeNodeText(child))
        .join('')
    }

    if (typeof children === 'string' || typeof children === 'number') {
      return String(children)
    }
  }

  return ''
}

</script>

<template>
  <div
    v-if="shouldRenderPlayer && youtubeEmbedUrl"
    class="my-6 overflow-hidden rounded-xl bg-black"
  >
    <div class="aspect-video">
      <iframe
        class="h-full w-full"
        :src="youtubeEmbedUrl"
        title="YouTube video player"
        frameborder="0"
        allow="
          accelerometer;
          autoplay;
          clipboard-write;
          encrypted-media;
          gyroscope;
          picture-in-picture;
          web-share;
        "
        allowfullscreen
        loading="lazy"
      />
    </div>
  </div>
  <a
    v-else-if="isExternal"
    :href="href"
    class="prose-link prose-link--external"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
  >
    <slot />
  </a>
  <a
    v-else
    :href="href"
    class="prose-link prose-link--internal"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
  >
    <slot />
  </a>
</template>

<style scoped>
.prose-link {
  color: var(--accent);
  font-weight: 500;
  text-decoration-line: underline;
  text-decoration-thickness: 1.2px;
  text-underline-offset: 0.18em;
  text-decoration-color: color-mix(in srgb, var(--accent) 70%, transparent);
  text-decoration-skip-ink: auto;
  transition:
    color 0.18s ease,
    text-decoration-color 0.18s ease;
}

.prose-link:hover {
  color: color-mix(in srgb, var(--accent) 80%, #0a1f5f 20%);
  text-decoration-color: currentColor;
}

.prose-link--internal {
  text-decoration-style: solid;
}

.prose-link--external {
  text-decoration-style: solid;
}
</style>
