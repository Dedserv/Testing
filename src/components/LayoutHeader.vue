<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
</script>

<template>
  <header class="border-b bg-card/50 backdrop-blur sticky top-0 z-40">
    <div class="container mx-auto flex h-14 items-center justify-between px-4">
      <RouterLink to="/" class="font-semibold text-lg text-foreground hover:opacity-80 transition-opacity">
        Daily Frontend Tests
      </RouterLink>
      <nav class="flex gap-2">
        <Button variant="ghost" as-child>
          <RouterLink to="/">Главная</RouterLink>
        </Button>
        <Button variant="ghost" as-child>
          <RouterLink to="/history">История</RouterLink>
        </Button>
      </nav>
    </div>
  </header>
</template>
