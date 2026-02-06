<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { CompressionResult, ErrorInfo } from '../../src/types'
import { CompressionLevel, COMPRESSION_PRESETS, type CompressionLevel as CompressionLevelType } from '../../src/types'
import { formatFileSize, addCompressedSuffix } from '../../src/utils/formatters'
import ThemeToggle from '../../src/components/ThemeToggle.vue'
import CompressionLevelSelector from '../../src/components/CompressionLevelSelector.vue'

// UI State
const currentSection = ref<'selector' | 'progress' | 'results' | 'error'>('selector')
const progress = ref(0)
const progressStatus = ref('')
const originalSize = ref('')
const compressedSize = ref('')
const compressionRatio = ref('')
const errorMessage = ref('')

// File handling
const fileInput = ref<HTMLInputElement>()
const downloadData = ref<{ file: Blob; filename: string } | null>(null)
const isDragging = ref(false)

// Compression level
const compressionLevel = ref<CompressionLevelType>(CompressionLevel.MEDIUM)

// Services (lazy loaded)
let fileHandler: any = null
let compressionEngine: any = null
let errorHandler: any = null
let stateManager: any = null

onMounted(async () => {
  // Initialize services
  const { FileHandler } = await import('../../src/services/fileHandler')
  const { CompressionEngine } = await import('../../src/services/compressionEngine')
  const { ErrorHandler } = await import('../../src/services/errorHandler')
  const { AppStateManager } = await import('../../src/services/stateManager')

  fileHandler = new FileHandler()
  compressionEngine = new CompressionEngine()
  errorHandler = new ErrorHandler()
  stateManager = new AppStateManager()

  // Subscribe to state changes
  stateManager.subscribe((state: any) => {
    handleStateChange(state)
  })
})

function handleStateChange(state: any) {
  // Update UI based on state changes
}

async function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  await processFile(file)
}

async function compressFile(file: File) {
  try {
    stateManager.setState({ currentState: 'loading' })
    progress.value = 30
    progressStatus.value = 'Uploading file...'

    const fileData = await fileHandler.readFile(file)

    stateManager.setState({ currentState: 'compressing', progress: 50 })
    progress.value = 50
    progressStatus.value = 'Compressing PDF...'

    const compressionResult = await compressionEngine.compressPDF(fileData, COMPRESSION_PRESETS[compressionLevel.value])

    if (!compressionResult.success) {
      throw new Error(compressionResult.error || 'Compression failed')
    }

    stateManager.setState({
      currentState: 'completed',
      compressionResult,
      progress: 100
    })

    showResults(compressionResult)

    const compressedBlob = new Blob([compressionResult.compressedData], {
      type: 'application/pdf'
    })
    const downloadFilename = addCompressedSuffix(file.name)

    downloadData.value = { file: compressedBlob, filename: downloadFilename }
  } catch (error) {
    const errorInfo = errorHandler.mapToErrorInfo(error, 'compression')
    stateManager.setState({
      currentState: 'error',
      error: errorInfo
    })
    showError(errorInfo)
  }
}

function showResults(result: CompressionResult) {
  currentSection.value = 'results'
  originalSize.value = formatFileSize(result.originalSize)
  compressedSize.value = formatFileSize(result.compressedSize)
  compressionRatio.value = `${result.compressionRatio.toFixed(2)}%`
}

function showError(error: ErrorInfo) {
  currentSection.value = 'error'
  errorMessage.value = error.message
}

function triggerDownload() {
  if (downloadData.value) {
    const url = URL.createObjectURL(downloadData.value.file)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = downloadData.value.filename
    anchor.style.display = 'none'

    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)

    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 100)
  }
}

function reset() {
  currentSection.value = 'selector'
  progress.value = 0
  progressStatus.value = ''
  originalSize.value = ''
  compressedSize.value = ''
  compressionRatio.value = ''
  errorMessage.value = ''
  downloadData.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  // Note: compressionLevel is not reset as it's saved in localStorage
}

// Drag and drop handlers
function onDragEnter(event: DragEvent) {
  event.preventDefault()
  event.stopPropagation()
  isDragging.value = true
}

function onDragLeave(event: DragEvent) {
  event.preventDefault()
  event.stopPropagation()
  isDragging.value = false
}

function onDragOver(event: DragEvent) {
  event.preventDefault()
  event.stopPropagation()
}

async function onDrop(event: DragEvent) {
  event.preventDefault()
  event.stopPropagation()
  isDragging.value = false

  const files = event.dataTransfer?.files
  if (!files || files.length === 0) return

  const file = files[0]
  await processFile(file)
}

function onFileInputClick() {
  fileInput.value?.click()
}

async function processFile(file: File) {
  try {
    currentSection.value = 'progress'
    progress.value = 10
    progressStatus.value = 'Validating file...'

    stateManager.setState({
      currentState: 'validating',
      selectedFile: {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      }
    })

    const validationResult = fileHandler.validateFile(file)

    if (!validationResult.isValid) {
      const errorInfo = errorHandler.createInvalidFileTypeError()
      errorInfo.message = validationResult.error || errorInfo.message
      stateManager.setState({
        currentState: 'error',
        error: errorInfo
      })
      showError(errorInfo)
      return
    }

    await compressFile(file)
  } catch (error) {
    const errorInfo = errorHandler.mapToErrorInfo(error, 'file selection')
    stateManager.setState({
      currentState: 'error',
      error: errorInfo
    })
    showError(errorInfo)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-neutral-950 p-3">
    <div class="w-full">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-xl font-bold text-gray-900 dark:text-neutral-100">PDF Compressor</h1>
        <ThemeToggle />
      </div>

      <!-- Compression Level Selector -->
      <CompressionLevelSelector v-model="compressionLevel" class="mb-4" />

      <!-- File Selector -->
      <div v-show="currentSection === 'selector'" class="space-y-4">
        <input
          ref="fileInput"
          type="file"
          accept=".pdf,application/pdf"
          class="hidden"
          @change="handleFileSelect"
        />

        <div
          class="border-2 border-dashed rounded-xl p-4 text-center transition-all duration-200 cursor-pointer"
          :class="[
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
              : 'border-gray-300 dark:border-neutral-700 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-neutral-900'
          ]"
          @click="onFileInputClick"
          @dragenter="onDragEnter"
          @dragleave="onDragLeave"
          @dragover="onDragOver"
          @drop="onDrop"
        >
          <div class="flex flex-col items-center gap-2">
            <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
              <svg
                class="w-5 h-5 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>

            <div class="space-y-0.5">
              <p class="text-sm text-gray-700 dark:text-neutral-300 font-medium">
                {{ isDragging ? 'Drop PDF' : 'Drop PDF' }}
              </p>
              <p class="text-xs text-gray-500 dark:text-neutral-400">or click</p>
            </div>

            <p class="text-xs text-gray-400 dark:text-neutral-500">PDF files only</p>
          </div>
        </div>
      </div>

      <!-- Progress Section -->
      <div v-show="currentSection === 'progress'" class="space-y-3">
        <div class="w-full bg-gray-200 dark:bg-neutral-800 rounded-full h-2">
          <div
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
        <p class="text-xs text-gray-600 dark:text-neutral-400 text-center">{{ progressStatus }}</p>
      </div>

      <!-- Results Section -->
      <div v-show="currentSection === 'results'" class="space-y-3">
        <h2 class="text-base font-semibold text-gray-900 dark:text-neutral-100">Results</h2>
        <div class="bg-white dark:bg-neutral-900 rounded-lg shadow p-3 space-y-2">
          <p class="text-xs text-gray-600 dark:text-neutral-400">
            Original: <span class="font-medium text-gray-900 dark:text-neutral-100">{{ originalSize }}</span>
          </p>
          <p class="text-xs text-gray-600 dark:text-neutral-400">
            Compressed: <span class="font-medium text-gray-900 dark:text-neutral-100">{{ compressedSize }}</span>
          </p>
          <p class="text-xs text-gray-600 dark:text-neutral-400">
            Saved: <span class="font-medium text-green-600 dark:text-green-400">{{ compressionRatio }}</span>
          </p>
        </div>
        <button
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-3 rounded-md text-sm transition-colors"
          @click="triggerDownload"
        >
          Download compressed PDF
        </button>
        <button
          class="w-full bg-gray-200 hover:bg-gray-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-gray-700 dark:text-neutral-300 font-medium py-1.5 px-3 rounded-md text-sm transition-colors"
          @click="reset"
        >
          Compress another file
        </button>
      </div>

      <!-- Error Section -->
      <div v-show="currentSection === 'error'" class="space-y-3">
        <div class="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-3">
          <p class="text-xs text-red-800 dark:text-red-300">{{ errorMessage }}</p>
        </div>
        <button
          class="w-full bg-gray-200 hover:bg-gray-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-gray-700 dark:text-neutral-300 font-medium py-1.5 px-3 rounded-md text-sm transition-colors"
          @click="reset"
        >
          Try again
        </button>
      </div>
    </div>
  </div>
</template>
