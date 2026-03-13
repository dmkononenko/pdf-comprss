<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { CompressionLevel, type CompressionLevel as CompressionLevelType } from '../types'

const STORAGE_KEY = 'pdf-compression-level'

const props = defineProps<{
  modelValue: CompressionLevelType
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: CompressionLevelType): void
}>()

const selectedLevel = ref<CompressionLevelType>(props.modelValue)

const levels = [
  { value: CompressionLevel.LOW, label: 'Light', description: 'High quality, less compression' },
  { value: CompressionLevel.MEDIUM, label: 'Medium', description: 'Good quality, good compression' },
  { value: CompressionLevel.HIGH, label: 'Strong', description: 'Less quality, high compression' }
]

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved && Object.values(CompressionLevel).includes(saved as CompressionLevelType)) {
    selectedLevel.value = saved as CompressionLevelType
    emit('update:modelValue', selectedLevel.value)
  }
})

watch(selectedLevel, (newValue) => {
  localStorage.setItem(STORAGE_KEY, newValue)
  emit('update:modelValue', newValue)
})
</script>

<template>
  <div class="space-y-2">
    <p class="text-xs font-medium text-gray-700">Compression level</p>
    <div class="flex gap-2">
      <button
        v-for="level in levels"
        :key="level.value"
        class="flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all duration-200"
        :class="[
          selectedLevel === level.value
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
        @click="selectedLevel = level.value"
      >
        {{ level.label }}
      </button>
    </div>
    <p class="text-xs text-gray-500">{{ levels.find(l => l.value === selectedLevel)?.description }}</p>
  </div>
</template>
