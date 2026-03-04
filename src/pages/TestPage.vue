<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTestsStore } from '@/stores/tests'
import { useAttemptsStore } from '@/stores/attempts'
import LayoutHeader from '@/components/LayoutHeader.vue'
import QuestionBlock from '@/components/QuestionBlock.vue'
import ResultSummary from '@/components/ResultSummary.vue'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Test, Question } from '@/types'

const route = useRoute()
const router = useRouter()
const testsStore = useTestsStore()
const attemptsStore = useAttemptsStore()

const testId = computed(() => route.params.id as string)
const test = ref<Test | null>(null)
const currentIndex = ref(0)
const showConfirmDialog = ref(false)
const finishedAttempt = ref<ReturnType<typeof useAttemptsStore.finishAttempt>>(null)

const currentQuestion = computed<Question | null>(() => {
  const t = test.value
  if (!t?.questions?.length) return null
  return t.questions[currentIndex.value] ?? null
})

const totalQuestions = computed(() => test.value?.questions?.length ?? 0)
const progress = computed(() =>
  totalQuestions.value
    ? ((currentIndex.value + 1) / totalQuestions.value) * 100
    : 0
)

const allAnswered = computed(() => {
  const a = attemptsStore.currentAttempt
  const t = test.value
  if (!a || !t) return false
  return t.questions.every((q) => a.answers[q.id] != null && a.answers[q.id] !== '')
})

const selectedChoice = computed(() => {
  const q = currentQuestion.value
  const a = attemptsStore.currentAttempt
  if (!q || !a) return null
  return a.answers[q.id] ?? null
})

async function loadTest() {
  test.value = await testsStore.loadTest(testId.value)
  if (!test.value) {
    router.replace('/')
    return
  }
  attemptsStore.startAttempt(test.value.id, test.value.date)
}

onMounted(async () => {
  await testsStore.loadIndex()
  await loadTest()
})

watch(
  testId,
  async (id) => {
    if (id) await loadTest()
  },
  { immediate: false }
)

function selectChoice(choiceId: string) {
  const q = currentQuestion.value
  if (q) attemptsStore.saveAnswer(q.id, choiceId)
}

function prev() {
  if (currentIndex.value > 0) currentIndex.value--
}

function next() {
  if (currentIndex.value < totalQuestions.value - 1) currentIndex.value++
}

function requestFinish() {
  if (allAnswered.value) {
    doFinish()
  } else {
    showConfirmDialog.value = true
  }
}

function doFinish() {
  showConfirmDialog.value = false
  const t = test.value
  if (!t) return
  finishedAttempt.value = attemptsStore.finishAttempt(t)
}

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen">
    <LayoutHeader />
    <main v-if="test" class="container mx-auto px-4 py-8 max-w-2xl">
      <div v-if="finishedAttempt">
        <ResultSummary :correct="finishedAttempt.score.correct" :total="finishedAttempt.score.total" />
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
              :selected-choice-id="finishedAttempt.answers[q.id]"
              :show-result="true"
              :correct-choice-id="q.answer"
            />
          </div>
        </div>
        <div class="mt-8">
          <Button @click="goHome">На главную</Button>
        </div>
      </div>

      <div v-else>
        <p class="text-sm text-muted-foreground mb-2">
          Вопрос {{ currentIndex + 1 }} из {{ totalQuestions }}
        </p>
        <Progress :model-value="progress" class="mb-6" />
        <Transition mode="out-in" name="slide">
          <div v-if="currentQuestion" :key="currentQuestion.id" class="rounded-xl border p-6">
            <QuestionBlock
              :question="currentQuestion"
              :selected-choice-id="selectedChoice"
              @select="selectChoice"
            />
          </div>
        </Transition>
        <div class="mt-6 flex gap-3 flex-wrap">
          <Button variant="outline" :disabled="currentIndex === 0" @click="prev">
            Назад
          </Button>
          <Button
            v-if="currentIndex < totalQuestions - 1"
            @click="next"
          >
            Дальше
          </Button>
          <Button
            :variant="currentIndex < totalQuestions - 1 ? 'outline' : 'default'"
            @click="requestFinish"
          >
            Завершить тест
          </Button>
        </div>
      </div>
    </main>
  </div>

  <Dialog v-model:open="showConfirmDialog">
    <DialogContent :show-close-button="true">
      <DialogHeader>
        <DialogTitle>Завершить тест?</DialogTitle>
        <DialogDescription>
          Остались неотвеченные вопросы. Завершить всё равно?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" @click="showConfirmDialog = false">Отмена</Button>
        <Button @click="doFinish">Завершить</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
