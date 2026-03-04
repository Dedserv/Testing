import type { Test, TestIndexEntry } from '@/types'

const INDEX_PATH = '/tests/index.json'

export async function fetchIndex(): Promise<TestIndexEntry[]> {
  try {
    const base = import.meta.env.BASE_URL.replace(/\/$/, '')
    const res = await fetch(`${base}${INDEX_PATH}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (e) {
    console.warn('Failed to fetch index.json:', e)
    return []
  }
}

export async function fetchTest(path: string): Promise<Test | null> {
  try {
    const base = import.meta.env.BASE_URL.replace(/\/$/, '')
    const url = path.startsWith('/') ? `${base}${path}` : `${base}/${path}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (e) {
    console.warn('Failed to fetch test:', path, e)
    return null
  }
}

export function getTodayId(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function getTodayTest(entries: TestIndexEntry[]): TestIndexEntry | undefined {
  const today = getTodayId()
  return entries.find((e) => e.date === today || e.id === today)
}

export function getLatestTests(
  entries: TestIndexEntry[],
  limit = 5
): TestIndexEntry[] {
  return [...entries]
    .sort((a, b) => (b.date > a.date ? 1 : b.date < a.date ? -1 : 0))
    .slice(0, limit)
}
