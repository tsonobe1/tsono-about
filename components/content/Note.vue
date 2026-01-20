<template>
  <blockquote class="markdown-alert-note" role="note">
    <p class="note-label">
      <span aria-hidden="true" class="note-icon">!</span>
      <span>Note</span>
    </p>
    <div class="note-content text-white/80">
      <slot />
    </div>
  </blockquote>
</template>

<style scoped>
blockquote {
  margin: 0 0 1rem;
  padding: 1px 1rem 1px 1rem;
  border-left: 0.25rem solid #0969da;
}

.note-label {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0 0 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0969da;
}

.note-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 999px;
  border: 2px solid currentColor;
  font-weight: 700;
  font-size: 0.85rem;
  line-height: 1;
}

.note-content :deep(p:first-child) {
  margin-top: 0;
}

.note-content :deep(p:last-child) {
  margin-bottom: 0;
}

:deep(.note-content) {
  color: var(--muted);
}
</style>
