<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()

if (!runtimeConfig.public.isAboutPublic) {
  throw createError({ statusCode: 404, statusMessage: 'Not Found' })
}
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-3xl flex-col gap-10 px-6 pb-16">
    <section class="card space-y-4">
      <header class="space-y-2">
        <h1 class="text-3xl font-semibold text-[var(--text)]">私について</h1>
      </header>

      <div class="space-y-3 text-[var(--text)]">
        <p>test</p>
        <ul class="list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
          <li>
            <NuxtLink class="text-[var(--accent)]" to="/articles"
              >Articles</NuxtLink
            >
            — 技術や制作に関する長文メモ。
          </li>
          <li>
            <NuxtLink class="text-[var(--accent)]" to="/diary">Diary</NuxtLink>
            — 日常のログや感想。
          </li>
          <li>
            <NuxtLink class="text-[var(--accent)]" to="/gallery"
              >Gallery</NuxtLink
            >
            — DIY / Music / App などの作品。
          </li>
          <li>
            <NuxtLink class="text-[var(--accent)]" to="/career"
              >Career</NuxtLink
            >
            — 最新の職務経歴書。
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
