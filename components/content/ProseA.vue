<script setup lang="ts">
import type { VNodeArrayChildren, VNodeChild } from 'vue'

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
const externalInfo = computed(() => {
  if (!isExternal.value || !hrefValue.value) {
    return null
  }
  return buildExternalInfo(hrefValue.value)
})

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

function buildYouTubeEmbedUrl(input: string): string | null {
  const parsed = parseYouTubeUrl(input)
  if (!parsed) {
    return null
  }

  if (!parsed.params.has('rel')) {
    parsed.params.set('rel', '0')
  }

  const query = parsed.params.toString()
  return `https://www.youtube.com/embed/${parsed.id}${query ? `?${query}` : ''}`
}

function parseYouTubeUrl(
  input: string,
): { id: string; params: URLSearchParams } | null {
  try {
    const url = new URL(input)
    const host = url.hostname.replace(/^www\./, '')
    const segments = url.pathname.split('/').filter(Boolean)
    const params = new URLSearchParams(url.search)

    let id = ''
    if (host === 'youtu.be') {
      id = segments[0] ?? ''
    } else if (host.endsWith('youtube.com')) {
      if (segments[0] === 'watch') {
        id = params.get('v') ?? ''
        params.delete('v')
      } else if (['live', 'shorts', 'embed'].includes(segments[0])) {
        id = segments[1] ?? ''
      }
    }

    if (!id) {
      return null
    }

    const startParam = params.get('t') ?? params.get('start')
    const startSeconds = startParam ? parseStartTime(startParam) : undefined
    params.delete('t')
    if (typeof startSeconds === 'number' && startSeconds >= 0) {
      params.set('start', String(startSeconds))
    } else {
      params.delete('start')
    }

    return { id, params }
  } catch {
    return null
  }
}

function parseStartTime(value: string): number | undefined {
  if (/^\d+$/.test(value)) {
    return Number(value)
  }

  const match = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/)
  if (!match) {
    return undefined
  }

  const hours = match[1] ? Number(match[1]) : 0
  const minutes = match[2] ? Number(match[2]) : 0
  const seconds = match[3] ? Number(match[3]) : 0
  return hours * 3600 + minutes * 60 + seconds
}

function buildExternalInfo(
  input: string,
): { hostname: string; href: string } | null {
  try {
    const normalized = input.startsWith('//') ? `https:${input}` : input
    const url = new URL(normalized)
    const hostname = url.hostname.replace(/^www\./, '')
    return { hostname, href: input }
  } catch {
    return null
  }
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
    v-else-if="isExternal && externalInfo"
    :href="href"
    class="group block mt-3 rounded-2xl border border-white/10 bg-white/5 px-3 pt-2.5 pb-0 transition hover:border-[var(--accent)] hover:bg-[var(--accent)]/10"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
  >
    <div class="flex items-center gap-1.5 text-sm font-medium leading-tight text-[var(--text)]">
      <span
        class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)]/15 text-[var(--accent)] transition group-hover:bg-[var(--accent)] group-hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="h-4 w-4"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M3.75 4A1.75 1.75 0 0 0 2 5.75v8.5C2 15.44 2.56 16 3.25 16h8.5a1.75 1.75 0 0 0 1.75-1.75V9.5a.75.75 0 0 0-1.5 0v4.75c0 .138-.112.25-.25.25H3.25a.25.25 0 0 1-.25-.25V5.75c0-.138.112-.25.25-.25H8a.75.75 0 0 0 0-1.5z"
            clip-rule="evenodd"
          />
          <path
            d="M17.5 3.5a.75.75 0 0 0-.75-.75H11a.75.75 0 0 0 0 1.5h4.19l-5.22 5.22a.75.75 0 1 0 1.06 1.06L16.25 5.31V9.5a.75.75 0 0 0 1.5 0z"
          />
        </svg>
      </span>
      <span class="line-clamp-2 break-words">
        <slot />
      </span>
    </div>
    <p class="mt-0 text-[0.65rem] text-white/70 transition group-hover:text-white">
      {{ externalInfo.hostname }}
    </p>
  </a>
  <a
    v-else
    :href="href"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
  >
    <slot />
  </a>
</template>
