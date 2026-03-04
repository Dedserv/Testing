<script setup lang="ts">
import type { Question } from '@/types'
import { cn } from '@/lib/utils'

defineProps<{
  question: Question
  selectedChoiceId: string | null
  showResult?: boolean
  correctChoiceId?: string | null
}>()

defineEmits<{
  select: [choiceId: string]
}>()
</script>

<template>
  <div class="space-y-4">
    <p class="font-medium text-foreground">{{ question.prompt }}</p>
    <div class="space-y-2">
      <button
        v-for="choice in question.choices"
        :key="choice.id"
        type="button"
        :disabled="showResult"
        :class="cn(
          'w-full rounded-lg border px-4 py-3 text-left transition-colors',
          'hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-ring',
          selectedChoiceId === choice.id && !showResult && 'border-primary bg-primary/10 ring-2 ring-primary/30',
          showResult && choice.id === correctChoiceId && 'border-green-500 bg-green-500/10',
          showResult && selectedChoiceId === choice.id && selectedChoiceId !== correctChoiceId && 'border-destructive bg-destructive/10'
        )"
        @click="$emit('select', choice.id)"
      >
        {{ choice.text }}
      </button>
    </div>
    <p
      v-if="showResult && correctChoiceId && selectedChoiceId !== correctChoiceId && question.explain"
      class="text-sm text-muted-foreground border-l-4 border-primary pl-3 py-2 bg-muted/50 rounded-r"
    >
      {{ question.explain }}
    </p>
  </div>
</template>
