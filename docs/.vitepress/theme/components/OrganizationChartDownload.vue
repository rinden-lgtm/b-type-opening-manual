<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, withBase } from 'vitepress'

const route = useRoute()

const isOrgChart = computed(() => {
  const path = route.path.replace(/\/$/, '') || '/'
  return path === '/templates/organization-chart'
})

const xlsxUrl = withBase('/downloads/organization-chart.xlsx')
const csvUrl = withBase('/downloads/organization-chart.csv')
</script>

<template>
  <div v-if="isOrgChart" class="print-button-wrap org-download-wrap">
    <a
      class="print-button print-button--download"
      :href="xlsxUrl"
      download="組織図_就労継続支援B型.xlsx"
    >
      <span aria-hidden="true">📊</span>
      スプレッドシートをダウンロード
    </a>
    <a
      class="org-download-link"
      :href="csvUrl"
      download="組織図_就労継続支援B型.csv"
    >
      CSV版をダウンロード
    </a>
  </div>
</template>
