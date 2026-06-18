<script setup lang="ts">
import { useRoute } from 'vitepress'
import { watch, onMounted } from 'vue'
import { CHECKBOX_PATHS, findDownload } from '../template-downloads'

const route = useRoute()

function normalizePath(path: string) {
  return path.replace(/\/$/, '') || '/'
}

function updatePageClasses() {
  if (typeof document === 'undefined') return
  const path = normalizePath(route.path)
  const download = findDownload(path)
  document.documentElement.classList.toggle('printable-page', Boolean(download))
  document.documentElement.classList.toggle('contract-print', Boolean(download?.contractPrint))
  document.documentElement.classList.toggle('landscape-print', Boolean(download?.landscapePrint))
  document.documentElement.classList.toggle('a3-print', false)
}

function enableCheckboxes() {
  if (typeof document === 'undefined') return
  requestAnimationFrame(() => {
    document.querySelectorAll('.vp-doc input[type="checkbox"]').forEach((cb) => {
      cb.removeAttribute('disabled')
    })
  })
}

watch(() => route.path, () => {
  updatePageClasses()
  const path = normalizePath(route.path)
  if (CHECKBOX_PATHS.has(path)) enableCheckboxes()
}, { immediate: true })

onMounted(() => {
  updatePageClasses()
  const path = normalizePath(route.path)
  if (CHECKBOX_PATHS.has(path)) enableCheckboxes()
})
</script>

<template />
