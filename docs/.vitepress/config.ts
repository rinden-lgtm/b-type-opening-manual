import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '就労継続支援B型 開設準備手引書',
  description: '就労継続支援B型事業所の開設準備を進めるための社内向け手引書',
  lang: 'ja-JP',
  base: '/',
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'robots', content: 'noindex, nofollow' }],
  ],

  themeConfig: {
    siteTitle: '就労継続支援B型 開設準備手引書',

    nav: [
      { text: 'トップ', link: '/' },
      { text: '全体像', link: '/01-overview' },
      { text: 'チェックリスト', link: '/12-checklist' },
      {
        text: 'テンプレート',
        items: [
          { text: '物件候補提出チェックリスト', link: '/templates/property-checklist' },
          { text: 'サビ管確認チェックリスト', link: '/templates/sabikan-checklist' },
          { text: '作業発注元リスト', link: '/templates/work-client-list' },
          { text: '営業トークスクリプト', link: '/templates/sales-talk-script' },
          { text: '見学対応記録', link: '/templates/visit-record' },
          { text: '問い合わせシート', link: '/templates/user-inquiry-sheet' },
          { text: '開所前最終チェックリスト', link: '/templates/opening-final-checklist' },
        ],
      },
    ],

    sidebar: [
      {
        text: 'はじめに',
        items: [
          { text: 'トップ', link: '/' },
          { text: '開設準備の全体像', link: '/01-overview' },
          { text: '開設スケジュール', link: '/02-schedule' },
        ],
      },
      {
        text: '開設準備（開設者担当）',
        items: [
          { text: 'サービス管理責任者の確保', link: '/03-sabikan' },
          { text: '物件候補の準備と提出', link: '/04-property' },
          { text: '作業・仕事の確保', link: '/05-work' },
          { text: '開設資金の準備', link: '/06-funding' },
          { text: '人員採用と勤務体制', link: '/07-staff' },
          { text: '指定申請準備への協力', link: '/08-application-support' },
          { text: '利用者募集準備', link: '/09-user-recruitment' },
          { text: 'IT・集客環境整備', link: '/10-it-marketing' },
          { text: '開所前準備', link: '/11-opening-preparation' },
        ],
      },
      {
        text: 'チェックリスト',
        items: [
          { text: '開所前最終チェックリスト', link: '/12-checklist' },
        ],
      },
      {
        text: 'テンプレート',
        items: [
          { text: '物件候補提出チェックリスト', link: '/templates/property-checklist' },
          { text: 'サビ管確認チェックリスト', link: '/templates/sabikan-checklist' },
          { text: '作業発注元リスト', link: '/templates/work-client-list' },
          { text: '営業トークスクリプト', link: '/templates/sales-talk-script' },
          { text: '見学対応記録', link: '/templates/visit-record' },
          { text: '問い合わせシート', link: '/templates/user-inquiry-sheet' },
          { text: '開所前最終チェックリスト', link: '/templates/opening-final-checklist' },
        ],
      },
    ],

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '検索',
            buttonAriaLabel: '検索',
          },
          modal: {
            displayDetails: '詳細を表示',
            resetButtonTitle: 'リセット',
            backButtonTitle: '戻る',
            noResultsText: '結果が見つかりません',
            footer: {
              selectKey: '選択',
              navigateUpKey: '上へ',
              navigateDownKey: '下へ',
              closeKey: '閉じる',
              selectText: '移動',
              navigateText: '移動',
              closeText: '閉じる',
            },
          },
        },
      },
    },

    docFooter: {
      prev: '前のページ',
      next: '次のページ',
    },

    outline: {
      label: '目次',
    },

    lastUpdated: {
      text: '最終更新',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },
  },
})
