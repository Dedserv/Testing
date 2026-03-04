<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { TestIndexEntry } from '@/types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

defineProps<{
  entry: TestIndexEntry
}>()
</script>

<template>
  <Card class="transition-shadow hover:shadow-md">
    <CardHeader>
      <CardTitle class="text-base">{{ entry.title }}</CardTitle>
      <p class="text-sm text-muted-foreground">{{ entry.date }}</p>
      <div v-if="entry.tags?.length" class="flex flex-wrap gap-1.5 mt-1">
        <Badge v-for="tag in entry.tags" :key="tag" variant="secondary" class="text-xs">
          {{ tag }}
        </Badge>
      </div>
    </CardHeader>
    <CardContent class="pt-0" />
    <CardFooter>
      <Button as-child>
        <RouterLink :to="`/test/${entry.id}`">Пройти</RouterLink>
      </Button>
    </CardFooter>
  </Card>
</template>
