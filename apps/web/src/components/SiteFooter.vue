<script setup lang="ts">
const githubUrl = 'https://github.com/monicasofiarestrepo'
const linkedinUrl = 'https://www.linkedin.com/in/monicasofiarestrepo'
const email = 'monicarestrepoleon@gmail.com'
const phoneDisplay = '+57 314 285 8111'
const phoneHref = '+573142858111'
</script>

<template>
  <footer class="mt-auto border-t border-border bg-ink-deep">
    <div class="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <p class="text-xs font-semibold uppercase tracking-widest text-brand-bright">
        Producto de entrevista técnica hecha por:
      </p>

      <div class="mt-3 space-y-1.5">
        <p class="text-lg font-bold text-surface sm:text-xl">
          Mónica Sofía Restrepo León
        </p>
        <p class="text-sm text-surface/85">
          Full-Stack Mobile Engineer — Flutter | React Native | JavaScript | Python
        </p>
      </div>

      <p
        class="mt-4 flex flex-col gap-2 text-sm text-surface/75 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-0"
      >
        <a
          class="focus-visible:outline-brand-bright underline-offset-2 hover:text-brand-bright hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
          :href="`tel:${phoneHref}`"
        >
          {{ phoneDisplay }}
        </a>
        <span class="hidden px-2 text-surface/40 sm:inline" aria-hidden="true">|</span>
        <span>UTC-05:00</span>
        <span class="hidden px-2 text-surface/40 sm:inline" aria-hidden="true">|</span>
        <a
          class="focus-visible:outline-brand-bright underline-offset-2 hover:text-brand-bright hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
          :href="`mailto:${email}`"
        >
          {{ email }}
        </a>
        <span class="hidden px-2 text-surface/40 sm:inline" aria-hidden="true">|</span>
        <a
          class="focus-visible:outline-brand-bright underline-offset-2 hover:text-brand-bright hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
          :href="githubUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub: monicasofiarestrepo
        </a>
        <span class="hidden px-2 text-surface/40 sm:inline" aria-hidden="true">|</span>
        <a
          class="focus-visible:outline-brand-bright underline-offset-2 hover:text-brand-bright hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
          :href="linkedinUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
      </p>
    </div>
  </footer>
</template>
