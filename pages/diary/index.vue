<script setup lang="ts">
import { formatDate } from '~/utils/formatDate'

const toAbsolutePath = (path?: string | null) =>
  path ? (path.startsWith('/') ? path : `/${path}`) : '/'

const { data } = await useAsyncData('diary-page', () =>
  queryCollection('diary')
    .select('path', 'title', 'date', 'category', 'description')
    .order('date', 'DESC')
    .all(),
)

const entries = computed(() => data.value ?? [])
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-4xl flex-col gap-10 px-6 py-16">
    <MainNav />
    <div class="grid gap-6">
      <NuxtLink
        v-for="entry in entries"
        :key="entry.path"
        :to="toAbsolutePath(entry.path)"
        class="card group transition hover:border-[var(--accent)]"
      >
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3 text-xs tracking-widest">
            <span
              v-if="entry.category"
              class="rounded border border-white/10 px-2 py-0.5 text-[var(--accent)]"
            >
              {{ entry.category }}
            </span>
            <span class="muted">
              {{ entry.date ? formatDate(entry.date) : '----/--/--' }}
            </span>
          </div>
          <h2
            class="text-xl font-semibold text-[var(--text)] transition group-hover:text-[var(--accent)]"
          >
            {{ entry.title }}
          </h2>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
