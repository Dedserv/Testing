import { defineStore } from 'pinia'
import {
  createAttempt,
  saveAnswer as engineSaveAnswer,
  finishAttempt as engineFinishAttempt,
  persistAttempt,
  getAttempts,
  getAttemptById,
  getAttemptsByTestId,
} from '@/utils/attemptEngine'
import type { Attempt, Test } from '@/types'

export const useAttemptsStore = defineStore('attempts', {
  state: () => ({
    currentAttempt: null as Attempt | null,
    attempts: [] as Attempt[],
  }),
  getters: {
    attemptsByTestId(): (testId: string) => Attempt[] {
      return (testId: string) => getAttemptsByTestId(testId)
    },
    recentAttempts(): (limit?: number) => Attempt[] {
      return (limit = 5) =>
        [...this.attempts]
          .filter((a) => a.finishedAt)
          .sort((a, b) => (b.finishedAt! > a.finishedAt! ? 1 : -1))
          .slice(0, limit)
    },
  },
  actions: {
    syncFromStorage() {
      this.attempts = getAttempts()
    },
    startAttempt(testId: string, testDate: string) {
      this.currentAttempt = createAttempt(testId, testDate)
    },
    saveAnswer(questionId: string, choiceId: string | null) {
      if (!this.currentAttempt) return
      this.currentAttempt = engineSaveAnswer(
        this.currentAttempt,
        questionId,
        choiceId
      )
    },
    finishAttempt(test: Test): Attempt | null {
      if (!this.currentAttempt) return null
      const finished = engineFinishAttempt(this.currentAttempt, test)
      persistAttempt(finished)
      this.attempts.push(finished)
      this.currentAttempt = null
      return finished
    },
    clearCurrentAttempt() {
      this.currentAttempt = null
    },
    getAttemptById(id: string): Attempt | null {
      return getAttemptById(id)
    },
  },
})
