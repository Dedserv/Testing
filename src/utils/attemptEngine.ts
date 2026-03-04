import type { Attempt, Test } from '@/types'

const STORAGE_KEY = 'dft-attempts'

export function createAttempt(testId: string, testDate: string): Attempt {
  const now = new Date().toISOString()
  return {
    attemptId: crypto.randomUUID(),
    testId,
    testDate,
    startedAt: now,
    finishedAt: '',
    answers: {},
    score: { correct: 0, total: 0 },
  }
}

export function saveAnswer(
  attempt: Attempt,
  questionId: string,
  choiceId: string | null
): Attempt {
  return {
    ...attempt,
    answers: {
      ...attempt.answers,
      [questionId]: choiceId,
    },
  }
}

export function finishAttempt(attempt: Attempt, test: Test): Attempt {
  let correct = 0
  for (const q of test.questions) {
    const userAnswer = attempt.answers[q.id]
    if (userAnswer === q.answer) correct++
  }
  return {
    ...attempt,
    finishedAt: new Date().toISOString(),
    score: { correct, total: test.questions.length },
  }
}

export function persistAttempt(attempt: Attempt): void {
  const list = getAttempts()
  list.push(attempt)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch (e) {
    console.warn('Failed to persist attempt:', e)
  }
}

export function getAttempts(): Attempt[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export function getAttemptById(id: string): Attempt | null {
  return getAttempts().find((a) => a.attemptId === id) ?? null
}

export function getAttemptsByTestId(testId: string): Attempt[] {
  return getAttempts()
    .filter((a) => a.testId === testId)
    .sort((a, b) => (b.finishedAt > a.finishedAt ? 1 : -1))
}
