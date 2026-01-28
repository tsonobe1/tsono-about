<template>
  <div
    class="flex min-h-screen w-full items-start justify-center bg-[var(--bg)] px-6 pt-16 pb-10"
  >
    <figure
      class="relative w-full max-w-4xl overflow-hidden rounded-[2rem] border border-[color-mix(in_srgb,var(--border)_60%,transparent)] shadow-[0_25px_80px_-40px_rgba(0,0,0,0.75)]"
    >
      <NuxtImg
        src="/images/articles/top/hero.webp"
        alt="Sunrise view of Mt. Fuji behind a torii gate"
        format="webp"
        class="h-full w-full object-cover"
        loading="eager"
        decoding="async"
      />
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/5" />
    </figure>
  </div>
</template>
