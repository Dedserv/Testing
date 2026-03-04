<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAttemptsStore } from '@/stores/attempts'
import LayoutHeader from '@/components/LayoutHeader.vue'
import EmptyState from '@/components/EmptyState.vue'

const attemptsStore = useAttemptsStore()

onMounted(() => {
  attemptsStore.syncFromStorage()
})

const attempts = computed(() =>
  [...attemptsStore.attempts]
    .filter((a) => a.finishedAt)
    .sort((a, b) => (b.finishedAt! > a.finishedAt! ? 1 : -1))
)

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="min-h-screen">
    <LayoutHeader />
    <main class="container mx-auto px-4 py-8 max-w-2xl">
      <h1 class="text-2xl font-bold mb-6">История попыток</h1>
      <div v-if="attempts.length === 0">
        <EmptyState
          title="Попыток пока нет"
          description="Пройдите тест на главной странице"
        />
      </div>
      <div v-else class="space-y-2">
        <RouterLink
          v-for="a in attempts"
          :key="a.attemptId"
          :to="`/attempt/${a.attemptId}`"
          class="flex items-center justify-between rounded-xl border p-4 hover:bg-accent/50 transition-colors"
        >
          <div>
            <p class="font-medium">{{ a.testId }}</p>
            <p class="text-sm text-muted-foreground">{{ formatDate(a.finishedAt!) }}</p>
          </div>
          <span class="text-lg font-semibold">
            {{ a.score.correct }}/{{ a.score.total }}
          </span>
        </RouterLink>
      </div>
    </main>
  </div>
</template>
