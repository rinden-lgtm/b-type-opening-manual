# 就労継続支援B型 開設準備手引書

就労継続支援B型事業所の開設準備を進めるための社内向け手引書サイトです。

想定URL: `manual.store-ash.jp`

## セットアップ

```bash
npm install
```

## 開発サーバー起動

```bash
npm run docs:dev
```

ブラウザで http://localhost:5173 を開いてください。

## ビルド

```bash
npm run docs:build
```

## プレビュー

```bash
npm run docs:preview
```

## デプロイ（ASH運用）

ASHの既存運用に合わせ、以下のフローで公開します。

```
Cursor → GitHub → Vercel → manual.store-ash.jp
```

## ディレクトリ構成

```
docs/
  index.md                    # トップページ
  01-overview.md              # 開設準備の全体像
  02-schedule.md              # 開設スケジュール
  03-sabikan.md               # サビ管確保
  04-property.md              # 物件候補
  05-work.md                  # 作業・仕事の確保
  06-funding.md               # 開設資金
  07-staff.md                 # 人員採用
  08-application-support.md   # 指定申請協力
  09-user-recruitment.md      # 利用者募集
  10-it-marketing.md          # IT・集客
  11-opening-preparation.md   # 開所前準備
  12-checklist.md             # 最終チェックリスト
  templates/                  # テンプレート
  .vitepress/config.ts        # VitePress設定
```
