<script setup lang="ts">
defineProps<{
  correct: number
  total: number
}>()
</script>

<template>
  <div
    class="rounded-xl border-2 border-primary/30 bg-primary/5 p-6 text-center"
    v-motion
    :initial="{ opacity: 0, y: -10 }"
    :enter="{ opacity: 1, y: 0, transition: { duration: 300 } }"
  >
    <p class="text-2xl font-bold">
      {{ correct }} из {{ total }}
    </p>
    <p class="text-sm text-muted-foreground mt-1">
      {{ correct === total ? 'Все верно!' : 'Есть ошибки — смотри разбор ниже' }}
    </p>
    <div class="mt-3 h-2 w-full rounded-full bg-muted overflow-hidden">
      <div
        class="h-full bg-primary rounded-full transition-all duration-500"
        :style="{ width: `${total ? (correct / total) * 100 : 0}%` }"
      />
    </div>
  </div>
</template>
