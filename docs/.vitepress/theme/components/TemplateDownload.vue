<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, withBase } from 'vitepress'
import { findDownload } from '../template-downloads'

const route = useRoute()

const downloadTarget = computed(() => {
  const path = route.path.replace(/\/$/, '') || '/'
  const item = findDownload(path)
  if (!item) return null
  return {
    ...item,
    href: withBase(item.href),
    secondary: item.secondary
      ? {
          ...item.secondary,
          href: withBase(item.secondary.href),
        }
      : undefined,
  }
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
      スプレッドシートをダウンロード<span v-if="downloadTarget.label">（{{ downloadTarget.label }}）</span>
    </a>
    <a
      v-if="downloadTarget.secondary"
      class="org-download-link"
      :href="downloadTarget.secondary.href"
      :download="downloadTarget.secondary.filename"
    >
      {{ downloadTarget.secondary.label }}
    </a>
  </div>
</template>
