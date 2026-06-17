import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import PrintButton from './components/PrintButton.vue'
import OrganizationChartDownload from './components/OrganizationChartDownload.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => [h(PrintButton), h(OrganizationChartDownload)],
    })
  },
} satisfies Theme
