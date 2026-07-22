<template>
  <div class="flex flex-col gap-4" aria-busy="true" aria-label="Cargando producto">
    <div class="grid gap-8 lg:grid-cols-2">
      <div class="overflow-hidden rounded-lg border border-border bg-surface-elevated">
        <div class="skeleton aspect-square w-full rounded-none" />
      </div>
      <div class="space-y-4">
        <div class="skeleton h-4 w-24 rounded-sm" />
        <div class="skeleton h-9 w-full max-w-md rounded-sm" />
        <div class="space-y-2 pt-1">
          <div class="skeleton h-4 w-full rounded-sm" />
          <div class="skeleton h-4 w-full rounded-sm" />
          <div class="skeleton h-4 w-4/5 rounded-sm" />
        </div>
        <div class="skeleton h-8 w-32 rounded-sm" />
        <div class="flex flex-wrap gap-3 pt-4">
          <div class="skeleton h-10 w-24 rounded-md" />
          <div class="skeleton h-10 w-24 rounded-md" />
        </div>
      </div>
    </div>
  </div>
</template>
