<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useTestsStore } from '@/stores/tests'
import { useAttemptsStore } from '@/stores/attempts'
import LayoutHeader from '@/components/LayoutHeader.vue'
import TestCard from '@/components/TestCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const testsStore = useTestsStore()
const attemptsStore = useAttemptsStore()

onMounted(async () => {
  attemptsStore.syncFromStorage()
  await testsStore.loadIndex()
})

const todayEntry = computed(() => testsStore.todayTest)
const latestTests = computed(() => testsStore.latestTests(5))
const recentAttempts = computed(() => attemptsStore.recentAttempts(5))
</script>

<template>
  <div class="min-h-screen">
    <LayoutHeader />
    <main class="container mx-auto px-4 py-8 max-w-2xl">
      <section class="mb-10">
        <h2 class="text-lg font-semibold mb-4">Тест дня</h2>
        <div v-if="testsStore.index.length === 0" class="space-y-2">
          <Skeleton class="h-32 w-full" />
        </div>
        <Card v-else-if="todayEntry" class="transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle>{{ todayEntry.title }}</CardTitle>
            <p class="text-sm text-muted-foreground">{{ todayEntry.date }}</p>
          </CardHeader>
          <CardContent>
            <Button as-child>
              <RouterLink :to="`/test/${todayEntry.id}`">Начать тест</RouterLink>
            </Button>
          </CardContent>
        </Card>
        <EmptyState v-else title="Тест на сегодня пока не добавлен">
          <template #default>
            <p class="text-sm text-muted-foreground mb-3">
              Можете пройти последний доступный тест
            </p>
            <Button v-if="latestTests[0]" as-child>
              <RouterLink :to="`/test/${latestTests[0].id}`">
                Пройти последний тест
              </RouterLink>
            </Button>
          </template>
        </EmptyState>
      </section>

      <section class="mb-10">
        <h2 class="text-lg font-semibold mb-4">Последние тесты</h2>
        <div v-if="latestTests.length === 0" class="space-y-3">
          <Skeleton v-for="i in 3" :key="i" class="h-24 w-full" />
        </div>
        <div v-else class="grid gap-4">
          <TestCard v-for="entry in latestTests" :key="entry.id" :entry="entry" />
        </div>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-4">Последние попытки</h2>
        <div v-if="recentAttempts.length === 0">
          <EmptyState title="Попыток пока нет" description="Пройдите первый тест, чтобы здесь появилась история" />
        </div>
        <div v-else class="space-y-2">
          <RouterLink
            v-for="a in recentAttempts"
            :key="a.attemptId"
            :to="`/attempt/${a.attemptId}`"
            class="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors"
          >
            <span class="font-medium">{{ a.testId }}</span>
            <span class="text-sm text-muted-foreground">
              {{ a.score.correct }}/{{ a.score.total }}
            </span>
          </RouterLink>
        </div>
      </section>
    </main>
  </div>
</template>
