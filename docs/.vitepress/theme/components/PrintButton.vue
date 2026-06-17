<script setup lang="ts">
import { useRoute } from 'vitepress'
import { computed, watch, onMounted } from 'vue'

const route = useRoute()

const isPrintable = computed(() => {
  const path = route.path.replace(/\/$/, '') || '/'
  return (
    path === '/12-checklist' ||
    path === '/02-schedule' ||
    path.startsWith('/templates/')
  )
})

function updatePrintableClass(show: boolean) {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('printable-page', show)
}

watch(isPrintable, (show) => {
  updatePrintableClass(show)
  if (show) enableCheckboxes()
}, { immediate: true })

watch(() => route.path, () => {
  if (isPrintable.value) enableCheckboxes()
})

onMounted(() => {
  updatePrintableClass(isPrintable.value)
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
      印刷する
    </button>
  </div>
</template>
