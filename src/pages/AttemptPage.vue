<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAttemptsStore } from '@/stores/attempts'
import { useTestsStore } from '@/stores/tests'
import LayoutHeader from '@/components/LayoutHeader.vue'
import QuestionBlock from '@/components/QuestionBlock.vue'
import ResultSummary from '@/components/ResultSummary.vue'
import { Button } from '@/components/ui/button'

const route = useRoute()
const router = useRouter()
const attemptsStore = useAttemptsStore()
const testsStore = useTestsStore()

const attemptId = computed(() => route.params.attemptId as string)
const attempt = ref(attemptsStore.getAttemptById(attemptId.value))
const test = ref<Awaited<ReturnType<typeof testsStore.loadTest>>>(null)

onMounted(async () => {
  attemptsStore.syncFromStorage()
  attempt.value = attemptsStore.getAttemptById(attemptId.value)
  if (!attempt.value) {
    router.replace('/')
    return
  }
  await testsStore.loadIndex()
  test.value = await testsStore.loadTest(attempt.value.testId)
  if (!test.value) {
    router.replace('/')
  }
})

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

function goBack() {
  router.push('/history')
}
</script>

<template>
  <div v-if="attempt && test" class="min-h-screen">
    <LayoutHeader />
    <main class="container mx-auto px-4 py-8 max-w-2xl">
      <div class="mb-6 flex items-center gap-4">
        <Button variant="ghost" @click="goBack">← Назад</Button>
      </div>
      <ResultSummary :correct="attempt.score.correct" :total="attempt.score.total" />
      <p class="text-sm text-muted-foreground mt-4">
        Тест: {{ attempt.testId }} · {{ formatDate(attempt.finishedAt) }}
      </p>
      <div class="mt-8 space-y-8">
        <div
          v-for="(q, i) in test.questions"
          :key="q.id"
          v-motion
          :initial="{ opacity: 0, y: 10 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 250, delay: i * 50 } }"
          class="rounded-xl border p-6"
        >
          <QuestionBlock
            :question="q"
            :selected-choice-id="attempt.answers[q.id]"
            :show-result="true"
            :correct-choice-id="q.answer"
          />
        </div>
      </div>
    </main>
  </div>
</template>
