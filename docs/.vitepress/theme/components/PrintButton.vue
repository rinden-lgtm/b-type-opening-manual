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

const EMPLOYMENT_CONTRACT_PATHS = [
  '/templates/employment-contract-sabikan',
  '/templates/employment-contract-staff',
]

function usesInteractiveCheckboxes(path) {
  return (
    path === '/12-checklist' ||
    path === '/02-schedule' ||
    path.startsWith('/templates/')
  )
}

const isPrintable = computed(() => {
  const path = route.path.replace(/\/$/, '') || '/'
  if (
    path === '/templates/organization-chart' ||
    EMPLOYMENT_CONTRACT_PATHS.includes(path)
  ) {
    return false
  }
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

const isA3Print = computed(() => false)

const isLandscapePrint = computed(() => {
  const path = route.path.replace(/\/$/, '') || '/'
  return path === '/templates/wage-regulations'
})

function updatePageClasses() {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('printable-page', isPrintable.value)
  document.documentElement.classList.toggle('contract-print', isContractPrint.value)
  document.documentElement.classList.toggle('landscape-print', isLandscapePrint.value)
  document.documentElement.classList.toggle('a3-print', isA3Print.value)
}

watch([isPrintable, isContractPrint, isLandscapePrint, isA3Print], () => {
  updatePageClasses()
  const path = route.path.replace(/\/$/, '') || '/'
  if (usesInteractiveCheckboxes(path)) enableCheckboxes()
}, { immediate: true })

watch(() => route.path, () => {
  updatePageClasses()
  const path = route.path.replace(/\/$/, '') || '/'
  if (usesInteractiveCheckboxes(path)) enableCheckboxes()
})

onMounted(() => {
  updatePageClasses()
  const path = route.path.replace(/\/$/, '') || '/'
  if (usesInteractiveCheckboxes(path)) enableCheckboxes()
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
  const originalTitle = document.title
  document.title = ' '
  window.addEventListener(
    'afterprint',
    () => {
      document.title = originalTitle
    },
    { once: true },
  )
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
