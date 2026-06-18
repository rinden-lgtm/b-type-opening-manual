import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import ExcelJS from 'exceljs'
import {
  addArticle,
  addChecklistTable,
  addDataGrid,
  addFormTable,
  addMetaFields,
  addSectionHeader,
  addTitle,
  configureColumns,
  defaultPageSetup,
} from './lib/excel-helpers.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '../docs/public/downloads')
mkdirSync(outDir, { recursive: true })

async function writeWorkbook(workbook, filename) {
  await workbook.xlsx.writeFile(join(outDir, filename))
  console.log(`Generated: ${filename}`)
}

function createBook(creator = 'B型 開設準備手引書') {
  const wb = new ExcelJS.Workbook()
  wb.creator = creator
  return wb
}

function buildOpeningFinalChecklist(wb) {
  const ws = wb.addWorksheet('開所前最終チェックリスト')
  defaultPageSetup(ws)
  configureColumns(ws, [28, 8, 12, 12, 24])
  let row = addTitle(ws, 1, '開所前最終チェックリスト', 5)
  row = addMetaFields(ws, row, ['事業所名', '確認者', '確認日', '開所予定日'], 5)
  const sections = [
    {
      name: 'サビ管',
      items: [
        'サビ管が確定している',
        '研修修了証を確認した',
        '雇用契約書兼労働条件通知書を締結した',
        '勤務開始日が確定',
        '常勤配置を満たす勤務表',
        '上位店確認済み',
      ],
    },
    {
      name: '物件',
      items: ['上位店のアドバイスを受けて最終選定済み', '賃貸借契約締結', '内装・レイアウト完了', '作業室・相談室確保', '清掃完了'],
    },
    {
      name: '仕事',
      items: [
        'メイン作業決定',
        '発注元1社以上確保',
        '単価・作業量確認',
        '作業マニュアル作成',
        '検品ルール作成',
        '10名分の作業量確保',
      ],
    },
    { name: '資金', items: ['初期費用支払い完了', '運転資金確保（3〜6ヶ月分）', '資金繰り計画あり'] },
    {
      name: '職員',
      items: [
        '必要職種の採用完了',
        '雇用契約書兼労働条件通知書締結',
        '資格証確認',
        '勤務表作成・共有',
        '職員研修実施',
        '緊急連絡体制整備',
      ],
    },
    {
      name: '利用者募集',
      items: ['見学・体験受付体制', 'パンフレット準備', '案内用名刺準備（市役所・相談支援事業所等）', '問い合わせ対応フロー', '営業先案内実施'],
    },
    {
      name: '送迎・職員の食事',
      items: [
        '送迎用車両を確保した',
        '車両の保険・点検を確認した',
        '送迎ルート・担当を決めた',
        '弁当手配業者を決定した',
        '昼食の注文・費用ルールを共有した',
      ],
    },
    {
      name: '開所当日',
      items: ['初日スケジュール共有', '全職員集合・ブリーフィング', '上位店へ開所報告'],
    },
  ]
  for (const section of sections) {
    row = addSectionHeader(ws, row, section.name, 5)
    row = addChecklistTable(
      ws,
      row,
      ['確認項目', '確認済', '確認者', '日付', '備考'],
      section.items.map((item) => [item, '☐', '', '', '']),
      5,
    )
  }
  addMetaFields(ws, row, ['総合確認者', '総合確認日'], 5)
}

function buildPropertyChecklist(wb) {
  const ws = wb.addWorksheet('物件候補チェックリスト')
  defaultPageSetup(ws)
  configureColumns(ws, [24, 8, 28])
  let row = addTitle(ws, 1, '物件候補提出チェックリスト', 3)
  row = addMetaFields(ws, row, ['物件名', '住所', '確認日', '確認者'], 3)
  const sections = [
    {
      name: '基本情報',
      items: ['住所', '家賃（月額）', '敷金', '礼金', '面積（㎡）', '間取り'],
    },
    {
      name: '事業所として必要なスペース',
      items: ['作業室の確保', '相談室の確保', '事務スペース', 'トイレ', '駐車場'],
    },
    {
      name: '立地・環境',
      items: ['最寄駅・バス停', '周辺環境', 'バリアフリー対応', '消防設備'],
    },
    {
      name: '提出資料',
      items: ['物件概要', '間取り図', '外観写真', '内観写真', '周辺地図', '賃貸条件', '懸念点'],
    },
    {
      name: '最終確認',
      items: [
        '現地確認を実施した',
        '写真・図面の撮影許可を得た',
        '上位店への提出前に内容を再確認した',
        '契約前に上位店のアドバイスを受け、開設者が最終決定することを理解した',
      ],
    },
  ]
  for (const section of sections) {
    row = addSectionHeader(ws, row, section.name, 3)
    row = addChecklistTable(
      ws,
      row,
      ['確認項目', '確認済', '内容・備考'],
      section.items.map((item) => [item, '☐', '']),
      3,
    )
  }
}

function buildSabikanChecklist(wb) {
  const ws = wb.addWorksheet('サビ管確認チェックリスト')
  defaultPageSetup(ws)
  configureColumns(ws, [24, 8, 28])
  let row = addTitle(ws, 1, 'サビ管確認チェックリスト', 3)
  row = addMetaFields(ws, row, ['候補者氏名', '面談日', '確認者'], 3)
  row = addSectionHeader(ws, row, '書類確認', 3)
  row = addChecklistTable(
    ws,
    row,
    ['書類', '確認済', '備考'],
    [
      ['サービス管理責任者研修修了証', '☐', '修了年月：'],
      ['履歴書', '☐', ''],
      ['職務経歴書', '☐', ''],
      ['資格証の写し', '☐', ''],
      ['身分証明書', '☐', ''],
    ],
    3,
  )
  row = addSectionHeader(ws, row, '面談確認項目', 3)
  row = addChecklistTable(
    ws,
    row,
    ['確認項目', '確認済', '内容・備考'],
    [
      ['サービス管理責任者研修修了証', '☐', ''],
      ['実務経験', '☐', '年数： / 内容：'],
      ['常勤勤務可否', '☐', ''],
      ['勤務開始可能日', '☐', ''],
      ['雇用条件（給与・勤務時間・休日）', '☐', ''],
      ['他事業所との兼務有無', '☐', ''],
      ['個別支援計画作成経験', '☐', ''],
      ['利用者対応経験', '☐', ''],
    ],
    3,
  )
  row = addSectionHeader(ws, row, '雇用前最終確認', 3)
  row = addChecklistTable(
    ws,
    row,
    ['確認項目', '確認済', '備考'],
    [
      ['研修修了証の有効性を確認した', '☐', '→ 上位店へ確認'],
      ['兼務の可否を確認した', '☐', '→ 上位店へ確認'],
      ['雇用条件を合意した', '☐', ''],
      ['勤務開始日を確定した', '☐', ''],
      ['指定申請用職員情報を上位店に共有した', '☐', ''],
    ],
    3,
  )
  row = addSectionHeader(ws, row, '面談メモ', 3)
  addFormTable(
    ws,
    row,
    [
      ['印象・所感', ''],
      ['懸念点', ''],
      ['次のアクション', ''],
    ],
    3,
  )
}

function buildUserInquirySheet(wb) {
  const ws = wb.addWorksheet('問い合わせシート')
  defaultPageSetup(ws)
  configureColumns(ws, [22, 38])
  let row = addTitle(ws, 1, '利用希望者問い合わせシート', 2)
  row = addSectionHeader(ws, row, '問い合わせ情報', 2)
  row = addFormTable(
    ws,
    row,
    [
      ['受付日', ''],
      ['受付時間', ''],
      ['受付方法', '電話 / メール / LINE / 来所 / 紹介 / その他'],
      ['受付者', ''],
    ],
    2,
  )
  row = addSectionHeader(ws, row, '問い合わせ者情報', 2)
  row = addFormTable(
    ws,
    row,
    [
      ['氏名', ''],
      ['ふりがな', ''],
      ['本人 / 家族 / 支援者', ''],
      ['連絡先（電話）', ''],
      ['連絡先（メール）', ''],
      ['利用希望者氏名（本人以外の場合）', ''],
      ['利用希望者年齢', '歳'],
    ],
    2,
  )
  row = addSectionHeader(ws, row, '問い合わせ内容', 2)
  row = addFormTable(
    ws,
    row,
    [
      ['問い合わせ概要', ''],
      ['障害種別（分かる範囲）', ''],
      ['現在の状況', ''],
      ['通所希望時期', ''],
      ['希望曜日・時間帯', ''],
      ['希望送迎', '必要 / 不要 / 未定'],
      ['紹介元', ''],
    ],
    2,
  )
  row = addSectionHeader(ws, row, '対応記録', 2)
  row = addFormTable(
    ws,
    row,
    [
      ['初回対応日', ''],
      ['対応内容', ''],
      ['見学予定日', ''],
      ['次回フォロー予定', ''],
      ['備考', ''],
    ],
    2,
  )
  addSectionHeader(ws, row, 'ステータス', 2)
  addFormTable(ws, row + 1, [['ステータス', '見学待ち / 体験待ち / 契約手続中 / 見送り / その他']], 2)
}

function buildVisitRecord(wb) {
  const ws = wb.addWorksheet('見学対応記録')
  defaultPageSetup(ws)
  configureColumns(ws, [22, 38])
  let row = addTitle(ws, 1, '見学対応記録', 2)
  row = addSectionHeader(ws, row, '基本情報', 2)
  row = addFormTable(
    ws,
    row,
    [
      ['見学日', ''],
      ['見学時間', '〜'],
      ['対応者', ''],
      ['見学者氏名', ''],
      ['ふりがな', ''],
      ['年齢', '歳'],
      ['性別', ''],
      ['連絡先（電話）', ''],
      ['連絡先（メール）', ''],
    ],
    2,
  )
  row = addSectionHeader(ws, row, '見学者情報', 2)
  row = addFormTable(
    ws,
    row,
    [
      ['障害種別', '身体 / 精神 / 知的 / 発達 / その他'],
      ['現在の状況', '在宅 / 他事業所利用中 / 就労中 / その他'],
      ['紹介元', '相談支援事業所 / 病院 / 学校 / 自己申込 / その他'],
      ['紹介元名称', ''],
      ['通所希望日', ''],
      ['送迎', '必要 / 不要 / 未定'],
    ],
    2,
  )
  row = addSectionHeader(ws, row, '見学内容', 2)
  row = addFormTable(
    ws,
    row,
    [
      ['案内したエリア', '作業室 / 相談室 / 事務室 / トイレ / その他'],
      ['説明した作業内容', ''],
      ['見学者の反応・質問', ''],
      ['特記事項', ''],
    ],
    2,
  )
  row = addSectionHeader(ws, row, '見学後の対応', 2)
  row = addFormTable(
    ws,
    row,
    [
      ['体験利用の希望', 'あり / なし / 検討中'],
      ['体験利用予定日', ''],
      ['フォロー方法', '電話 / メール / LINE / その他'],
      ['フォロー予定日', ''],
      ['次のアクション', ''],
    ],
    2,
  )
  addSectionHeader(ws, row, '担当者所感', 2)
  addFormTable(
    ws,
    row + 1,
    [
      ['受入可否の所見', ''],
      ['懸念点', ''],
      ['サビ管への共有事項', ''],
    ],
    2,
  )
}

function buildWorkClientList(wb) {
  const ws = wb.addWorksheet('作業発注元リスト')
  defaultPageSetup(ws, true)
  configureColumns(ws, [5, 16, 10, 10, 14, 14, 10, 10, 14])
  let row = addTitle(ws, 1, '作業発注元リスト', 9)
  row = addMetaFields(ws, row, ['事業所名', '最終更新日'], 9)
  row = addSectionHeader(ws, row, '営業先一覧', 9)
  row = addDataGrid(
    ws,
    row,
    ['No.', '会社名', '業種', '担当者', '連絡先', '想定作業', 'ステータス', '商談日', '備考'],
    Array.from({ length: 10 }, (_, i) => [String(i + 1), '', '', '', '', '', '', '', '']),
  )
  row = addSectionHeader(ws, row, '契約済み発注元サマリー', 9)
  row = addDataGrid(
    ws,
    row,
    ['No.', '会社名', '作業内容', '単価', '月間作業量', '納期', '契約日', '', ''],
    [
      ['1', '', '', '', '', '', '', '', ''],
      ['2', '', '', '', '', '', '', '', ''],
      ['3', '', '', '', '', '', '', '', ''],
    ],
  )
  addSectionHeader(ws, row, '作業量の目安', 9)
  addDataGrid(
    ws,
    row + 1,
    ['利用者数', '必要作業量', '確保状況', '', '', '', '', '', ''],
    [
      ['10名', '', '☐ 確保済 / ☐ 不足', '', '', '', '', '', ''],
      ['15名', '', '☐ 確保済 / ☐ 不足', '', '', '', '', '', ''],
      ['20名', '', '☐ 確保済 / ☐ 不足', '', '', '', '', '', ''],
    ],
  )
}

function buildSalesTalkScript(wb) {
  const ws = wb.addWorksheet('営業トークスクリプト')
  defaultPageSetup(ws)
  configureColumns(ws, [18, 50])
  let row = addTitle(ws, 1, '作業受託営業トークスクリプト', 2)
  row = addSectionHeader(ws, row, '初回アプローチ（電話）', 2)
  row = addArticle(ws, row, '自己紹介', [
    'お世話になっております。○○（事業所名）の△△と申します。',
    '突然のお電話失礼いたします。',
  ], 2)
  row = addArticle(ws, row, '用件説明', [
    '当方は、就労継続支援B型事業所を開設予定しており、',
    '貴社の業務で外注可能な軽作業がないか、ご相談させていただきたくお電話しました。',
  ], 2)
  row = addArticle(ws, row, '事業所の説明', [
    '就労継続支援B型とは、障害のある方が自分のペースで働ける場所を提供する福祉サービスです。',
    'シール貼り、封入、検品、梱包、データ入力など、様々な作業に対応可能です。',
  ], 2)
  row = addArticle(ws, row, 'アポイント取得', [
    '詳しいご説明と、どのような作業が可能かお話しできればと思います。',
    '15〜30分程度、お時間をいただけないでしょうか。',
  ], 2)
  row = addSectionHeader(ws, row, '訪問・商談時（事業所概要）', 2)
  addFormTable(
    ws,
    row,
    [
      ['事業所名', '○○就労継続支援B型事業所'],
      ['所在地', '△△県□□市...'],
      ['開所予定', '○年○月'],
      ['定員', '約○名'],
      ['対応作業', 'シール貼り、封入、検品、梱包、データ入力等'],
    ],
    2,
  )
}

function buildScheduleChecklist(wb) {
  const ws = wb.addWorksheet('開設スケジュール')
  defaultPageSetup(ws)
  configureColumns(ws, [14, 50])
  let row = addTitle(ws, 1, '開設スケジュール', 2)
  const phases = [
    {
      name: '120日前',
      items: [
        '開設意思決定・体制確認',
        'サビ管候補者のリストアップ・確認開始',
        '物件候補探し開始（エリア・条件の整理）・上位店へ候補提出（1件以上）',
        '作業提供先のリストアップ',
        '開設資金の概算確認・資金計画のたたき台作成',
        '採用計画の策定（必要職種・人数・時期）',
        '上位店への進捗共有',
      ],
    },
    {
      name: '90日前',
      items: [
        'サビ管候補者との面談実施',
        '作業発注元との商談開始',
        '採用開始（求人掲載・募集）',
        '備品リスト作成',
        '送迎用車両・弁当手配業者の候補リストアップ',
        '内装・レイアウトの検討開始',
        '利用者募集の準備開始（パンフレット案・見学導線）',
      ],
    },
    {
      name: '60日前',
      items: [
        'サビ管の雇用条件合意・勤務開始日調整',
        '物件の最終選定結果を上位店から確認',
        '主要職員（管理者・生援・職指）の採用決定',
        '指定申請に必要な資料の準備（上位店の指示に従う）',
        'IT環境整備開始（HP・SNS・電話・メール）',
        '運転資金の最終確認',
        '弁当手配業者の見積・試食',
      ],
    },
    {
      name: '45日前',
      items: [
        '作業発注元との契約・単価・作業量の確定',
        '市役所・相談支援事業所等への案内用名刺を準備',
        '送迎用車両の手配方針を上位店と確認',
      ],
    },
    {
      name: '14日前',
      items: [
        'サビ管・主要職員の雇用契約書兼労働条件通知書の締結',
        '物件契約・内装工事の進捗確認（契約前は上位店のアドバイスを受ける）',
        '作業マニュアル・検品ルールの作成',
        '備品の発注・納品スケジュール確認',
        '送迎用車両の確保・保険・点検の完了',
        '弁当手配業者の契約・注文ルールの確定',
        '見学・体験利用の受付体制整備',
        '指定申請の進捗確認（上位店と連携）',
        '職員研修の日程確定',
        '利用者募集の営業活動開始（相談支援事業所等）',
      ],
    },
    {
      name: '7日前',
      items: [
        '備品設置・PC設定・Wi-Fi確認',
        '書類ファイル整備',
        '職員研修実施',
        '緊急連絡体制の確認',
        '掲示物・受入導線の確認',
        '初日の流れ・役割分担の確認',
        '清掃・最終レイアウト確認',
        '開所前最終チェックリストの実施',
      ],
    },
    {
      name: '前日',
      items: [
        '全エリアの最終清掃',
        'PC・プリンター・電話の動作確認',
        '初日スケジュールの全職員への共有',
        '見学・問い合わせ対応の最終確認',
        '鍵・セキュリティの確認',
        '緊急連絡先リストの配布',
        '開所前最終チェックリスト（テンプレート）の最終確認',
      ],
    },
    {
      name: '開所日',
      items: [
        '開所時間前に全職員集合・最終ブリーフィング',
        '利用者受入導線の最終確認',
        '作業エリア・相談室の準備完了確認',
        '問い合わせ対応体制の確認',
        '初日の記録・振り返りの実施',
        '上位店への開所報告',
      ],
    },
  ]
  for (const phase of phases) {
    row = addSectionHeader(ws, row, phase.name, 2)
    row = addChecklistTable(
      ws,
      row,
      ['確認', '項目'],
      phase.items.map((item) => ['☐', item]),
      2,
    )
  }
}

function buildMainChecklist(wb) {
  const ws = wb.addWorksheet('開所前最終チェック')
  defaultPageSetup(ws)
  configureColumns(ws, [8, 42])
  let row = addTitle(ws, 1, '開所前最終チェックリスト', 2)
  const sections = [
    {
      name: 'サビ管',
      items: [
        'サービス管理責任者が確定している',
        'サビ管研修修了証を確認した',
        '雇用契約書兼労働条件通知書を締結した',
        '勤務開始日が確定している',
        '常勤配置を満たす勤務表になっている → 上位店確認済み',
        '個別支援計画作成の準備ができている',
      ],
    },
    {
      name: '物件',
      items: [
        '物件の最終選定を決定した（上位店のアドバイスを反映）',
        '賃貸借契約を締結した（アドバイス反映後・開設者決定）',
        '内装・レイアウトが完了している',
        '作業室・相談室・事務スペースが確保されている',
        '消防設備・バリアフリー等を確認した',
      ],
    },
    {
      name: '仕事',
      items: [
        'メイン作業が決定している',
        '作業発注元が1社以上確保されている',
        '単価・月間作業量・納期を確認した',
        '作業マニュアルを作成した',
        '検品ルールを作成した',
        '10名分の作業量を確保している',
      ],
    },
    {
      name: '資金',
      items: [
        '初期費用の支払いが完了している',
        '運転資金（3〜6ヶ月分）を確保している',
        '開所後の入金タイムラグを考慮している',
        '月次の資金繰り計画がある',
      ],
    },
    {
      name: '職員',
      items: [
        '必要職種の採用が完了している',
        '全職員の雇用契約書兼労働条件通知書を締結した',
        '資格証を確認した',
        '勤務表を作成・共有した',
        '職員研修を実施した',
        '緊急連絡体制を整備した',
      ],
    },
    {
      name: '利用者募集',
      items: [
        '見学・体験の受付体制が整っている',
        'パンフレットを準備した',
        '市役所・相談支援事業所等への案内用名刺を準備した',
        '相談支援事業所等へ案内した',
        '問い合わせ対応フローが整っている',
        '見学記録・問い合わせ記録のフォーマットがある',
      ],
    },
    {
      name: 'IT環境',
      items: [
        'ホームページを公開した',
        'Googleビジネスプロフィールを登録した',
        'LINE公式アカウントを開設した',
        'メールアドレス・電話番号が使える',
        '問い合わせフォームが動作する',
        'PC・Wi-Fi・プリンターが動作する',
      ],
    },
    {
      name: '備品',
      items: [
        '作業机・椅子を配置した',
        'PC・モニターを設置した',
        '事務用品・消耗品を準備した',
        '救急箱等を配置した',
        '掲示物を設置した',
      ],
    },
    {
      name: '送迎・職員の食事',
      items: [
        '送迎用車両を確保した',
        '車両の保険・点検・車検を確認した',
        '送迎担当・ルートのたたき台を作成した',
        '弁当手配業者を決定した',
        '昼食の注文方法・費用負担を職員に共有した',
      ],
    },
    {
      name: '書類',
      items: [
        '利用者ファイルのフォーマットがある',
        '記録用紙・帳票を準備した',
        '契約書類のテンプレートがある',
        '協力医療機関協定書を締結・保管した',
        '個人情報保護等の掲示物がある',
        '指定申請関連資料を上位店に提出済み',
      ],
    },
    {
      name: '開所当日準備',
      items: [
        '全エリアの清掃が完了している',
        '初日スケジュールを全職員に共有した',
        '利用者受入導線を確認した',
        '緊急時対応を全職員が理解している',
        '上位店へ開所報告の連絡先を確認した',
      ],
    },
  ]
  for (const section of sections) {
    row = addSectionHeader(ws, row, section.name, 2)
    row = addChecklistTable(
      ws,
      row,
      ['確認', '項目'],
      section.items.map((item) => ['☐', item]),
      2,
    )
  }
  addMetaFields(ws, row, ['確認者', '確認日', '開所予定日'], 2)
}

function buildUserServiceContract(wb) {
  const ws = wb.addWorksheet('サービス利用契約書')
  defaultPageSetup(ws)
  configureColumns(ws, [80])
  let row = addTitle(ws, 1, '就労継続支援B型 サービス利用契約書', 1)
  row = addArticle(
    ws,
    row,
    '当事者',
    [
      '甲：〇〇株式会社（〇〇就労継続支援B型事業所）',
      '乙：利用者氏名',
      '甲は乙に対し就労継続支援B型のサービスを提供し、乙はこれを利用する。',
    ],
    1,
  )
  const articles = [
    [
      '第1条（契約の性質）',
      [
        '本契約は障害者総合支援法に基づく就労継続支援B型の利用に関する契約であり、雇用契約ではない。',
        '乙に支払われる工賃は雇用の賃金ではなく、作業等に対する対価である。',
      ],
    ],
    [
      '第2条（サービスの内容）',
      [
        '就労の機会の提供（作業、訓練等）',
        '就労に必要な知識・能力の向上のための支援',
        '日常生活能力の向上のための支援',
        '個別支援計画に基づく支援',
      ],
    ],
    [
      '第3条（利用期間）',
      ['利用開始日：2026年　　月　　日', '利用期間：1年（自動更新／更新の都度協議）'],
    ],
    [
      '第4条（利用日・利用時間）',
      ['利用可能曜日：月〜金（祝日除く）', '利用時間：10:00〜16:00（個別支援計画に従う）'],
    ],
    [
      '第5条（利用料・工賃）',
      [
        '利用者負担額（1日あたり）：〇〇〇円',
        '工賃は甲の規定（工賃規程）に基づき支払う。',
        '支払方法・時期：月末締め、翌月15日払い、銀行振込等',
      ],
    ],
    [
      '第6条（個別支援計画）',
      ['サービス管理責任者が個別支援計画を作成し、乙の同意を得る。'],
    ],
    [
      '第7条（利用者の遵守事項）',
      ['事業所の利用規約・運営規程を守る。', '他の利用者・職員への迷惑行為をしない。'],
    ],
    [
      '第8条（契約の変更・解除）',
      ['変更・解除は双方協議の上、書面で行う。'],
    ],
    [
      '第9条（退所）',
      ['乙または甲都合による退所手続は、所定の通知期間を守る。'],
    ],
    [
      '第10条（その他）',
      ['本契約に定めのない事項は、関係法令および甲の運営規程による。'],
    ],
  ]
  for (const [title, lines] of articles) {
    row = addArticle(ws, row, title, lines, 1)
  }
  addArticle(
    ws,
    row,
    '署名',
    ['甲（事業所）：事業所名・所在地・代表者氏名・㊞', '乙（利用者）：住所・氏名・㊞', '法定代理人（必要な場合）：氏名・㊞'],
    1,
  )
}

function buildImportantMattersNotice(wb) {
  const ws = wb.addWorksheet('重要事項説明書')
  defaultPageSetup(ws)
  configureColumns(ws, [22, 38])
  let row = addTitle(ws, 1, '重要事項説明書', 2)
  row = addMetaFields(ws, row, ['事業所名', '説明日', '説明者'], 2)
  const sections = [
    ['1. サービスの内容', ['就労の機会の提供、就労支援、日常生活支援、その他関連支援']],
    ['2. 利用料・工賃', ['利用者負担額の算定方法、工賃の支払方法（工賃規程に基づく）']],
    ['3. 利用時間・休日', ['利用可能曜日・時間、休業日、欠席時の取り扱い']],
    ['4. 個別支援計画', ['作成・見直しのタイミング、本人・家族への説明']],
    ['5. 苦情・相談', ['苦情受付窓口、対応方法']],
    ['6. 確認・同意', ['上記について説明を受け、内容を理解しました。']],
  ]
  for (const [title, lines] of sections) {
    row = addArticle(ws, row, title, lines, 2)
  }
  addFormTable(
    ws,
    row,
    [
      ['利用者氏名', ''],
      ['利用者署名・日付', ''],
      ['説明者氏名', ''],
      ['説明者署名・日付', ''],
      ['代理人・家族（必要な場合）', ''],
    ],
    2,
  )
}

function buildFacilityRules(wb) {
  const ws = wb.addWorksheet('利用規約・運営規程')
  defaultPageSetup(ws)
  configureColumns(ws, [80])
  let row = addTitle(ws, 1, '利用規約・運営規程', 1)
  const articles = [
    ['第1章 総則', ['本規程は〇〇就労継続支援B型事業所の運営に関する基本事項を定める。']],
    ['第2章 利用時間・休日', ['利用時間、休日、遅刻・早退・欠席の連絡方法を定める。']],
    ['第3章 利用者の遵守事項', ['安全の確保、他者への配慮、私物の持ち込み等']],
    ['第4章 禁止事項', ['暴力行為、迷惑行為、不正な物品の持ち込み等']],
    ['第5章 個人情報・その他', ['個人情報の取り扱い、規程の変更手続']],
  ]
  for (const [title, lines] of articles) {
    row = addArticle(ws, row, title, lines, 1)
  }
}

function buildPrivacyPolicy(wb) {
  const ws = wb.addWorksheet('個人情報保護方針')
  defaultPageSetup(ws)
  configureColumns(ws, [80])
  let row = addTitle(ws, 1, '個人情報保護方針', 1)
  const sections = [
    ['1. 基本方針', ['事業所は個人情報の適正管理に努める。']],
    ['2. 取得する情報', ['氏名、連絡先、障害情報、支援記録等']],
    ['3. 利用目的', ['サービス提供、請求、安全管理、法令に基づく報告']],
    ['4. 第三者提供', ['法令に基づく場合等を除き、本人同意なく提供しない。']],
    ['5. 安全管理', ['漏えい・滅失・毀損の防止措置を講じる。']],
    ['6. お問い合わせ', ['個人情報に関する問い合わせ窓口を設ける。']],
  ]
  for (const [title, lines] of sections) {
    row = addArticle(ws, row, title, lines, 1)
  }
}

function buildWageRegulations(wb) {
  const ws = wb.addWorksheet('工賃規程')
  defaultPageSetup(ws, true)
  configureColumns(ws, [8, 24, 10, 12, 20])
  let row = addTitle(ws, 1, '工賃規程', 5)
  row = addArticle(
    ws,
    row,
    '第1条（目的）',
    ['本規程は、就労継続支援B型事業所における工賃の算定・支払い方法を定める。'],
    5,
  )
  row = addArticle(ws, row, '第2条（工賃の算定）', ['作業内容・数量・品質に基づき算定する。'], 5)
  row = addSectionHeader(ws, row, '別表1 作業単価表', 5)
  addDataGrid(
    ws,
    row,
    ['No.', '作業名称', '単位', '単価（円）', '備考'],
    [
      ['1', '封入', '1通', '', ''],
      ['2', 'シール貼り', '100枚', '', ''],
      ['3', '検品', '1点', '', ''],
      ['4', '梱包', '1箱', '', ''],
      ['5', 'データ入力', '1件', '', ''],
    ],
  )
}

function buildIndividualSupportPlan(wb) {
  const ws = wb.addWorksheet('個別支援計画')
  defaultPageSetup(ws)
  configureColumns(ws, [18, 32, 18, 18])
  let row = addTitle(ws, 1, '個別支援計画', 4)
  row = addMetaFields(ws, row, ['事業所名', '利用者氏名', '作成日', 'サービス管理責任者'], 4)
  row = addSectionHeader(ws, row, '1. 利用者の状況', 4)
  row = addFormTable(
    ws,
    row,
    [
      ['障害・疾病の状況', ''],
      ['生活の状況', ''],
      ['就労・作業の状況', ''],
      ['本人の希望', ''],
    ],
    4,
  )
  row = addSectionHeader(ws, row, '2. 長期・短期目標', 4)
  row = addDataGrid(
    ws,
    row,
    ['区分', '目標', '期間', ''],
    [
      ['長期目標', '', '年　月頃', ''],
      ['短期目標①', '', '年　月頃', ''],
      ['短期目標②', '', '年　月頃', ''],
    ],
  )
  row = addSectionHeader(ws, row, '3. 支援内容', 4)
  addDataGrid(
    ws,
    row,
    ['支援項目', '具体的な支援内容', '頻度・時間', '担当'],
    [
      ['就労支援', '', '週　日', ''],
      ['日常生活支援', '', '', ''],
      ['作業内容', '', '', ''],
      ['その他', '', '', ''],
    ],
  )
}

function buildMedicalInstitutionAgreement(wb) {
  const ws = wb.addWorksheet('協力医療機関協定書')
  defaultPageSetup(ws)
  configureColumns(ws, [80])
  let row = addTitle(ws, 1, '協力医療機関に関する協定書', 1)
  row = addArticle(
    ws,
    row,
    '当事者',
    [
      'GOOD HOLDINGS株式会社（以下「甲」という。）と「〇〇〇〇（医療機関名）」（以下「乙」という。）は、次のとおり協力医療機関に関する協定を締結する。',
      '※ 甲の法人名・事業所名・住所等は仮の記載例です。実際の内容に差し替えてください。',
    ],
    1,
  )
  const articles = [
    [
      '（協力医療機関）',
      [
        '甲は乙を甲が設置運営する就労継続支援B型事業所「M I R A I E久留米」の協力医療機関と定め、当該事業所の利用者に病状の急変が生じた場合、その他必要な場合には、甲が乙に連絡をとり、これに対して乙は迅速に適切な対応をとるものとする。',
      ],
    ],
    [
      '（協定期間）',
      [
        '1. この協定の期間は、令和　8年　2月　1日から令和　9年　1月　31日までとする。',
        '2. 前項の期間が満了する1か月前までに、甲又は乙が別段の意思表示をしなかったときは、この協定は1年間延長されるものとし、以後も同様とする。',
      ],
    ],
    [
      '（疑義等の決定）',
      ['この協定について疑義が生じたとき又はこの協定に定めない事項については、甲乙協議の上、決定する。'],
    ],
    [
      '（協定書の作成）',
      ['この協定を証するため、本書2通を作成し、甲乙記名押印の上、各自1通を保有する。'],
    ],
  ]
  for (const [title, lines] of articles) {
    row = addArticle(ws, row, title, lines, 1)
  }
  row = addSectionHeader(ws, row, '署名欄', 1)
  addFormTable(
    ws,
    row,
    [
      ['協定締結日', '令和　〇年　〇月　〇日'],
      ['（甲）住所', '福岡県福岡市南区大橋1-15-6 アルボーレ大橋4F'],
      ['（甲）商号', 'GOOD HOLDINGS株式会社'],
      ['（甲）代表取締役', '山口　祐典'],
      ['（乙）住所', '〇'],
      ['（乙）医療機関名', '〇'],
      ['（乙）氏名・役職', '〇'],
    ],
    1,
  )
}

async function buildWorkbooks() {
  const jobs = [
    ['opening-final-checklist.xlsx', buildOpeningFinalChecklist],
    ['property-checklist.xlsx', buildPropertyChecklist],
    ['sabikan-checklist.xlsx', buildSabikanChecklist],
    ['user-inquiry-sheet.xlsx', buildUserInquirySheet],
    ['visit-record.xlsx', buildVisitRecord],
    ['work-client-list.xlsx', buildWorkClientList],
    ['sales-talk-script.xlsx', buildSalesTalkScript],
    ['opening-schedule.xlsx', buildScheduleChecklist],
    ['opening-checklist.xlsx', buildMainChecklist],
    ['user-service-contract.xlsx', buildUserServiceContract],
    ['important-matters-notice.xlsx', buildImportantMattersNotice],
    ['facility-rules.xlsx', buildFacilityRules],
    ['privacy-policy.xlsx', buildPrivacyPolicy],
    ['wage-regulations.xlsx', buildWageRegulations],
    ['individual-support-plan.xlsx', buildIndividualSupportPlan],
    ['medical-institution-agreement.xlsx', buildMedicalInstitutionAgreement],
  ]

  for (const [filename, builder] of jobs) {
    const wb = createBook()
    builder(wb)
    await writeWorkbook(wb, filename)
  }
}

buildWorkbooks().catch((error) => {
  console.error(error)
  process.exit(1)
})
