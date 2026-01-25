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

type DiaryEntry = {
  path?: string | null
  title?: string | null
  date?: string | Date | null
  category?: string | null
}

const entries = computed<DiaryEntry[]>(() => (data.value ?? []) as DiaryEntry[])

const groupedEntries = computed(() => {
  const groups: Record<
    string,
    { key: string; label: string; items: DiaryEntry[] }
  > = {}
  const orderedKeys: string[] = []

  for (const item of entries.value) {
    const hasDate = !!item.date
    const yearKey = hasDate
      ? String(new Date(item.date as string | number | Date).getFullYear())
      : 'no-date'
    if (!groups[yearKey]) {
      groups[yearKey] = {
        key: yearKey,
        label: hasDate ? `${yearKey}` : 'Other',
        items: [],
      }
      orderedKeys.push(yearKey)
    }
    groups[yearKey].items.push(item)
  }

  return orderedKeys.map((key) => groups[key])
})

const formatMonthDay = (value?: string | Date) => {
  const formatted = formatDate(value)
  return formatted ? formatted.slice(5) : ''
}
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 pb-16">
    <div
      class="flex flex-col gap-10 lg:ml-40 lg:mr-6 lg:flex-row lg:items-start lg:gap-12 xl:gap-20"
    >
      <aside class="hidden lg:flex lg:flex-[1.8]" aria-hidden="true">
        <div class="w-full" />
      </aside>
      <div class="w-full lg:flex-none lg:max-w-md lg:self-start">
        <div
          class="article-panel rounded-2xl border border-white/30 p-8 sm:px-10 sm:py-8"
        >
          <section
            v-for="(group, groupIndex) in groupedEntries"
            :key="group.key"
            :class="[
              'flex flex-col gap-3 text-[var(--text)]',
              groupIndex === 0 ? '' : 'mt-24',
            ]"
          >
            <p
              class="text-[0.7rem] font-semibold uppercase tracking-[0.45em] text-[color-mix(in_srgb,var(--text)_55%,transparent)]"
            >
              {{ group.label }}
            </p>
            <div class="mt-4 flex flex-col gap-7">
              <NuxtLink
                v-for="(entry, entryIndex) in group.items"
                :key="entry.path"
                :to="toAbsolutePath(entry.path)"
                :class="[
                  'group block pt-1 transition hover:translate-x-1',
                  entryIndex === 0 ? 'mt-8' : 'mt-0',
                ]"
              >
                <div class="flex flex-col gap-2.5">
                  <div
                    class="text-[10px] tracking-[0.22em] text-[color-mix(in_srgb,var(--text)_55%,transparent)]"
                  >
                    <span>
                      {{ entry.date ? formatMonthDay(entry.date) : '--/--' }}
                    </span>
                  </div>
                  <h2
                    class="text-base font-[460] tracking-[0.02em] leading-[1.55] text-[#2a2a2a]"
                  >
                    {{ entry.title }}
                  </h2>
                </div>
              </NuxtLink>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>
