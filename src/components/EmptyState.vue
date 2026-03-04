<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-muted-foreground/30 bg-muted/30 py-12 px-6 text-center"
  >
    <p v-if="title" class="font-medium text-muted-foreground">
      {{ title }}
    </p>
    <p v-if="description" class="text-sm text-muted-foreground/80 max-w-sm">
      {{ description }}
    </p>
    <slot />
  </div>
</template>
