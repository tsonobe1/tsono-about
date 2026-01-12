<template>
  <div class="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-6 py-16">
    <header class="space-y-2">
      <p class="text-sm uppercase tracking-wide text-muted-foreground">Nuxt Content + shadcn</p>
      <h1 class="text-3xl font-semibold">サンプル記事</h1>
      <p class="text-muted-foreground">
        Nuxt Contentで作成した記事を表示しています。ローカルで起動するとこのページが表示されます。
      </p>
    </header>

    <section class="rounded-lg border border-muted bg-white/60 p-6 shadow-sm">
      <ContentDoc path="/sample" />
    </section>

    <button
      class="inline-flex w-fit items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
      type="button"
    >
      shadcn風ボタン
    </button>
  </div>
</template>
