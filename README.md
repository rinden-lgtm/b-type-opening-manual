# 就労継続支援B型 開設準備手引書

就労継続支援B型事業所の開設準備を進めるための社内向け手引書サイトです。

**公開URL（想定）:** https://manual.store-ash.jp

---

## ローカル開発

```bash
npm install
npm run docs:dev
```

ブラウザで http://localhost:5173 を開いてください。

```bash
npm run docs:build    # ビルド
npm run docs:preview  # ビルド結果のプレビュー
```

---

## 公開方法（GitHub → Vercel）

ASHの既存運用（`store-ash.jp` 系サイト）と同じフローで公開します。

```
Cursor → GitHub → Vercel → manual.store-ash.jp
```

### 1. GitHub リポジトリにプッシュ

**リポジトリ名:** `b-type-opening-manual`  
**GitHub アカウント:** `rinden-lgtm`（既存 ASH サイトと同じ）

#### 初回のみ：GitHub CLI ログイン

```powershell
gh auth login
```

#### プッシュ（自動スクリプト）

```powershell
.\scripts\publish.ps1
```

#### 手動で行う場合

```powershell
gh repo create b-type-opening-manual --private --source=. --remote=origin --description "就労継続支援B型 開設準備手引書"
git branch -M main
git push -u origin main
```

---

### 2. Vercel でリポジトリを連携

1. [Vercel](https://vercel.com) にログイン
2. **Add New Project** → GitHub から `b-type-opening-manual` を Import
3. 以下のビルド設定を確認（`vercel.json` で自動適用されます）

| 項目 | 値 |
|------|-----|
| Framework Preset | VitePress |
| Build Command | `npm run docs:build` |
| Output Directory | `docs/.vitepress/dist` |
| Install Command | `npm install` |

4. **Deploy** をクリック

以降、`main` ブランチへのプッシュで自動デプロイされます。

---

### 3. カスタムドメイン設定

Vercel ダッシュボード → 対象プロジェクト → **Settings** → **Domains**

追加するドメイン:

```
manual.store-ash.jp
```

---

### 4. DNS 設定

`store-ash.jp` を管理している DNS 側で、以下を追加します。

| タイプ | ホスト | 値 |
|--------|--------|-----|
| CNAME | `manual` | `cname.vercel-dns.com` |

DNS 反映後、Vercel の Domains 画面で **Valid Configuration** になることを確認してください。

---

### 5. 公開完了の確認

- [ ] GitHub にコードが保存されている（https://github.com/rinden-lgtm/b-type-opening-manual）
- [ ] Vercel で自動デプロイが成功している
- [ ] https://manual.store-ash.jp で手引書サイトが閲覧できる
- [ ] 社内メンバーに URL を共有可能
- [ ] Cursor で修正 → GitHub へ push → 自動更新される

---

## 更新方法

1. Cursor で `docs/` 内の Markdown を編集
2. 変更をコミット
3. `git push origin main`
4. Vercel が自動デプロイ（1〜2分）

---

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
vercel.json                   # Vercel デプロイ設定
scripts/publish.ps1           # GitHub 公開スクリプト
```
