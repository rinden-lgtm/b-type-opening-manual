<script setup lang="ts">
import { useRoute } from 'vitepress'
import { computed, watch, onMounted } from 'vue'

const CONTRACT_PATHS = [
  '/templates/employment-contract-sabikan',
  '/templates/employment-contract-staff',
  '/templates/user-service-contract',
  '/templates/important-matters-notice',
  '/templates/facility-rules',
  '/templates/privacy-policy',
  '/templates/wage-regulations',
  '/templates/individual-support-plan',
]

const route = useRoute()

const isPrintable = computed(() => {
  const path = route.path.replace(/\/$/, '') || '/'
  return (
    path === '/12-checklist' ||
    path === '/02-schedule' ||
    path.startsWith('/templates/')
  )
})

const isContractPrint = computed(() => {
  const path = route.path.replace(/\/$/, '') || '/'
  return CONTRACT_PATHS.includes(path)
})

const isLandscapePrint = computed(() => {
  const path = route.path.replace(/\/$/, '') || '/'
  return path === '/templates/wage-regulations'
})

function updatePageClasses() {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('printable-page', isPrintable.value)
  document.documentElement.classList.toggle('contract-print', isContractPrint.value)
  document.documentElement.classList.toggle('landscape-print', isLandscapePrint.value)
}

watch([isPrintable, isContractPrint, isLandscapePrint], () => {
  updatePageClasses()
  if (isPrintable.value) enableCheckboxes()
}, { immediate: true })

watch(() => route.path, () => {
  updatePageClasses()
  if (isPrintable.value) enableCheckboxes()
})

onMounted(() => {
  updatePageClasses()
  if (isPrintable.value) enableCheckboxes()
})

function enableCheckboxes() {
  if (typeof document === 'undefined') return
  requestAnimationFrame(() => {
    document.querySelectorAll('.vp-doc input[type="checkbox"]').forEach((cb) => {
      cb.removeAttribute('disabled')
    })
  })
}

function handlePrint() {
  window.print()
}
</script>

<template>
  <div v-if="isPrintable" class="print-button-wrap">
    <button type="button" class="print-button" @click="handlePrint">
      <span aria-hidden="true">🖨</span>
      {{ isContractPrint ? '書類として印刷' : '印刷する' }}
    </button>
  </div>
</template>
