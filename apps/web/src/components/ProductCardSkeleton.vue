<template>
  <article
    class="overflow-hidden rounded-lg border border-border bg-surface-elevated shadow-sm"
    aria-hidden="true"
  >
    <div class="aspect-4/3 bg-surface">
      <div class="skeleton h-full w-full rounded-none" />
    </div>
    <div class="space-y-3 p-4">
      <div class="skeleton h-3 w-16 rounded-sm" />
      <div class="skeleton h-5 w-4/5 max-w-[14rem] rounded-sm" />
      <div class="space-y-2">
        <div class="skeleton h-3 w-full rounded-sm" />
        <div class="skeleton h-3 w-11/12 rounded-sm" />
      </div>
      <div class="skeleton h-5 w-24 rounded-sm pt-1" />
    </div>
  </article>
</template>
