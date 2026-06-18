export type TemplateDownload = {
  path: string
  href: string
  filename: string
  label?: string
  secondary?: {
    href: string
    filename: string
    label: string
  }
  contractPrint?: boolean
  landscapePrint?: boolean
}

export const TEMPLATE_DOWNLOADS: TemplateDownload[] = [
  {
    path: '/02-schedule',
    href: '/downloads/opening-schedule.xlsx',
    filename: '開設スケジュール.xlsx',
  },
  {
    path: '/12-checklist',
    href: '/downloads/opening-checklist.xlsx',
    filename: '開所前最終チェックリスト.xlsx',
  },
  {
    path: '/templates/opening-final-checklist',
    href: '/downloads/opening-final-checklist.xlsx',
    filename: '開所前最終チェックリスト_記入用.xlsx',
  },
  {
    path: '/templates/property-checklist',
    href: '/downloads/property-checklist.xlsx',
    filename: '物件候補提出チェックリスト.xlsx',
  },
  {
    path: '/templates/sabikan-checklist',
    href: '/downloads/sabikan-checklist.xlsx',
    filename: 'サビ管確認チェックリスト.xlsx',
  },
  {
    path: '/templates/user-inquiry-sheet',
    href: '/downloads/user-inquiry-sheet.xlsx',
    filename: '問い合わせシート.xlsx',
  },
  {
    path: '/templates/visit-record',
    href: '/downloads/visit-record.xlsx',
    filename: '見学対応記録.xlsx',
  },
  {
    path: '/templates/work-client-list',
    href: '/downloads/work-client-list.xlsx',
    filename: '作業発注元リスト.xlsx',
    landscapePrint: true,
  },
  {
    path: '/templates/sales-talk-script',
    href: '/downloads/sales-talk-script.xlsx',
    filename: '営業トークスクリプト.xlsx',
  },
  {
    path: '/templates/employment-contract-sabikan',
    href: '/downloads/employment-contract-sabikan.xlsx',
    filename: '雇用契約書兼労働条件通知書_サビ管.xlsx',
    label: 'サビ管用',
    contractPrint: true,
  },
  {
    path: '/templates/employment-contract-staff',
    href: '/downloads/employment-contract-staff.xlsx',
    filename: '雇用契約書兼労働条件通知書_支援員.xlsx',
    label: '支援員用',
    contractPrint: true,
  },
  {
    path: '/templates/user-service-contract',
    href: '/downloads/user-service-contract.xlsx',
    filename: '利用者サービス利用契約書.xlsx',
    contractPrint: true,
  },
  {
    path: '/templates/important-matters-notice',
    href: '/downloads/important-matters-notice.xlsx',
    filename: '重要事項説明書.xlsx',
    contractPrint: true,
  },
  {
    path: '/templates/facility-rules',
    href: '/downloads/facility-rules.xlsx',
    filename: '利用規約・運営規程.xlsx',
    contractPrint: true,
  },
  {
    path: '/templates/privacy-policy',
    href: '/downloads/privacy-policy.xlsx',
    filename: '個人情報保護方針.xlsx',
    contractPrint: true,
  },
  {
    path: '/templates/wage-regulations',
    href: '/downloads/wage-regulations.xlsx',
    filename: '工賃規程.xlsx',
    contractPrint: true,
    landscapePrint: true,
  },
  {
    path: '/templates/medical-institution-agreement',
    href: '/downloads/medical-institution-agreement.xlsx',
    filename: '協力医療機関協定書.xlsx',
    contractPrint: true,
  },
  {
    path: '/templates/individual-support-plan',
    href: '/downloads/individual-support-plan.xlsx',
    filename: '個別支援計画.xlsx',
    contractPrint: true,
  },
  {
    path: '/templates/organization-chart',
    href: '/downloads/organization-chart.xlsx',
    filename: '組織図_就労継続支援B型.xlsx',
    secondary: {
      href: '/downloads/organization-chart.csv',
      filename: '組織図_就労継続支援B型.csv',
      label: 'CSV版をダウンロード',
    },
  },
]

export const DOWNLOAD_PATHS = new Set(TEMPLATE_DOWNLOADS.map((item) => item.path))

export const CHECKBOX_PATHS = new Set([
  '/12-checklist',
  '/02-schedule',
  ...TEMPLATE_DOWNLOADS.map((item) => item.path).filter((path) => path.startsWith('/templates/')),
])

export function findDownload(path: string) {
  const normalized = path.replace(/\/$/, '') || '/'
  return TEMPLATE_DOWNLOADS.find((item) => item.path === normalized) ?? null
}
