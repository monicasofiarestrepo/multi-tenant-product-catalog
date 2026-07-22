<script setup lang="ts">
const githubUrl = 'https://github.com/monicasofiarestrepo'
const linkedinUrl = 'https://www.linkedin.com/in/monicasofiarestrepo'
const email = 'monicarestrepoleon@gmail.com'
const phoneDisplay = '+57 314 285 8111'
const phoneHref = '+573142858111'
</script>

<template>
  <footer class="site-footer mt-auto border-t">
    <div class="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <p class="site-footer__eyebrow text-xs font-semibold uppercase tracking-widest">
        Producto de entrevista técnica hecha por:
      </p>

      <div class="mt-3 space-y-1.5">
        <p class="site-footer__title text-lg font-bold sm:text-xl">
          Mónica Sofía Restrepo León
        </p>
        <p class="site-footer__role text-sm">
          Full-Stack Mobile Engineer — Flutter | React Native | JavaScript | Python
        </p>
      </div>

      <p
        class="site-footer__meta mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-0"
      >
        <a :href="`tel:${phoneHref}`">{{ phoneDisplay }}</a>
        <span class="site-footer__sep hidden px-2 sm:inline" aria-hidden="true">|</span>
        <span>UTC-05:00</span>
        <span class="site-footer__sep hidden px-2 sm:inline" aria-hidden="true">|</span>
        <a :href="`mailto:${email}`">{{ email }}</a>
        <span class="site-footer__sep hidden px-2 sm:inline" aria-hidden="true">|</span>
        <a :href="githubUrl" target="_blank" rel="noopener noreferrer">
          GitHub: monicasofiarestrepo
        </a>
        <span class="site-footer__sep hidden px-2 sm:inline" aria-hidden="true">|</span>
        <a :href="linkedinUrl" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </p>
    </div>
  </footer>
</template>
