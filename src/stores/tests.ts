import { defineStore } from 'pinia'
import {
  fetchIndex,
  fetchTest,
  getTodayTest,
  getLatestTests,
} from '@/api/tests'
import type { Test, TestIndexEntry } from '@/types'

export const useTestsStore = defineStore('tests', {
  state: () => ({
    index: [] as TestIndexEntry[],
    loadedTests: new Map<string, Test>(),
  }),
  getters: {
    todayTest(): TestIndexEntry | undefined {
      return getTodayTest(this.index)
    },
    latestTests(): (limit?: number) => TestIndexEntry[] {
      return (limit = 5) => getLatestTests(this.index, limit)
    },
    getTest(): (id: string) => Test | undefined {
      return (id: string) => this.loadedTests.get(id)
    },
  },
  actions: {
    async loadIndex() {
      this.index = await fetchIndex()
    },
    async loadTest(id: string): Promise<Test | null> {
      if (this.loadedTests.has(id)) {
        return this.loadedTests.get(id) ?? null
      }
      const entry = this.index.find((e) => e.id === id)
      if (!entry) return null
      const test = await fetchTest(entry.path)
      if (test) this.loadedTests.set(id, test)
      return test
    },
  },
})
