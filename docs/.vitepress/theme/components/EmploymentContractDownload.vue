<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, withBase } from 'vitepress'

const route = useRoute()

const downloadTarget = computed(() => {
  const path = route.path.replace(/\/$/, '') || '/'
  if (path === '/templates/employment-contract-sabikan') {
    return {
      href: withBase('/downloads/employment-contract-sabikan.xlsx'),
      filename: '労働条件通知書_サビ管.xlsx',
      label: 'サビ管用',
    }
  }
  if (path === '/templates/employment-contract-staff') {
    return {
      href: withBase('/downloads/employment-contract-staff.xlsx'),
      filename: '労働条件通知書_支援員.xlsx',
      label: '支援員用',
    }
  }
  return null
})
</script>

<template>
  <div v-if="downloadTarget" class="print-button-wrap org-download-wrap">
    <a
      class="print-button print-button--download"
      :href="downloadTarget.href"
      :download="downloadTarget.filename"
    >
      <span aria-hidden="true">📊</span>
      スプレッドシートをダウンロード（{{ downloadTarget.label }}）
    </a>
  </div>
</template>
