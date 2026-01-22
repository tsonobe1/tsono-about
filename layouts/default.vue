<template>
  <div class="min-h-screen bg-[var(--bg)] text-[var(--text)]">
    <header class="px-6 pt-16">
      <MainNav />
    </header>
    <main class="mt-12">
      <slot />
    </main>
  </div>
</template>
