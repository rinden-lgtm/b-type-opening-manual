import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import ExcelJS from 'exceljs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '../docs/public/downloads')
mkdirSync(outDir, { recursive: true })

const COLORS = {
  title: 'FF1E3A5F',
  label: 'FF334155',
  text: 'FF0F172A',
  border: 'FFCBD5E1',
  labelFill: 'FFF8FAFC',
  editFill: 'FFFFF7ED',
}

const borderThin = { style: 'thin', color: { argb: COLORS.border } }
const allBorders = () => ({
  top: borderThin,
  left: borderThin,
  bottom: borderThin,
  right: borderThin,
})

const labelFont = { name: 'Yu Gothic', size: 10, bold: true, color: { argb: COLORS.label } }
const bodyFont = { name: 'Yu Gothic', size: 10, color: { argb: COLORS.text } }
const titleFont = { name: 'Yu Gothic', size: 16, bold: true, color: { argb: COLORS.title } }

function setCell(ws, row, col, value, options = {}) {
  const cell = ws.getCell(row, col)
  cell.value = value
  cell.alignment = {
    horizontal: options.horizontal ?? 'left',
    vertical: options.vertical ?? 'top',
    wrapText: true,
  }
  cell.font = options.font ?? bodyFont
  if (options.border) cell.border = options.border
  if (options.fill) cell.fill = options.fill
}

function estimateWrappedLineCount(text, charsPerLine) {
  if (!text) return 1
  return String(text)
    .split('\n')
    .reduce((sum, part) => sum + Math.max(1, Math.ceil(part.length / charsPerLine)), 0)
}

function estimateSectionHeight(label, lines, options = {}) {
  const labelChars = options.labelCharsPerLine ?? 15
  const contentChars = options.contentCharsPerLine ?? 58
  const nonEmptyLines = lines.filter((line) => String(line).trim() !== '')

  const labelLineCount = estimateWrappedLineCount(label, labelChars)
  const explicitContentLines = Math.max(nonEmptyLines.length, 1)
  const wrappedContentLines = estimateWrappedLineCount(nonEmptyLines.join('\n'), contentChars)
  const contentLineCount = Math.max(explicitContentLines, wrappedContentLines)

  const height = Math.max(labelLineCount, contentLineCount, options.minRows ?? 1)
  return options.maxRows ? Math.min(height, options.maxRows) : height
}

function addSection(ws, row, label, lines, options = {}) {
  const contentLines = lines.filter((line) => String(line).trim() !== '')
  const height = estimateSectionHeight(label, contentLines, options)
  const bottom = row + height - 1
  ws.mergeCells(row, 1, bottom, 1)
  ws.mergeCells(row, 2, bottom, 8)
  setCell(ws, row, 1, label, {
    font: labelFont,
    vertical: 'top',
    horizontal: 'center',
    border: allBorders(),
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.labelFill } },
  })
  setCell(ws, row, 2, contentLines.join('\n'), {
    border: allBorders(),
    fill: options.editable
      ? { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.editFill } }
      : undefined,
  })
  const rowHeight = options.rowHeight ?? 18
  for (let r = row; r <= bottom; r += 1) {
    ws.getRow(r).height = rowHeight
  }
  return bottom + 1
}

const COMMON_WORKPLACES = [
  '〇〇県〇〇市〇〇1-2-3　〇〇就労継続支援B型事業所',
  '（複数事業所がある場合は行を追加）',
]

const COMMON_RENEWAL = [
  '契約の更新の有無',
  '☐ 更新する場合がある',
  '☐ 契約の更新はしない',
  '契約の更新は次により判断する',
  '・契約期間満了時の業務量',
  '・勤務成績、勤務態度',
  '・能力',
  '・会社の経営状況',
  '・従事している業務の進捗状況',
]

const COMMON_EMPLOYMENT_TYPE = [
  '☐ 正社員（期間の定めなし）',
  '☐ 有期契約社員',
  '☐ パート・アルバイト',
]

const COMMON_WORK_HOURS = [
  '1. 始業・終業',
  '2. 休憩時間',
  '・（始業）8時30分 ～ （終業）17時30分',
  '・ 60分',
]

const COMMON_OVERTIME = [
  '1. 所定時間外労働の有無',
  '   ☐ 有　　☐ 無',
  '2. 休日労働の有無',
  '   ☐ 有　　☐ 無',
]

const COMMON_LEAVE = ['年次有給休暇', '※ 詳細は、就業規則による']

const COMMON_WAGE_FOOTER = [
  '・ 当月　末',
  '・ 翌月　20日',
  '・ 所得税、雇用保険、健康保険、厚生年金',
  '・ 昇給　☐ 年次昇給有　　☐ なし',
]

const COMMON_RETIREMENT = [
  '1. 定年制',
  '   ☐ 有　　☐ 無',
  '2. 自己都合退職の手続',
  '・ 30日以上前までに届出が必要',
  '3. 解雇の事由及び手続',
  '・ 詳細は、就業規則による',
]

const COMMON_INSURANCE = [
  '・社会保険の加入',
  '   ☐ 有　　☐ 無',
  '・雇用保険の適用',
  '   ☐ 有　　☐ 無',
]

const COMMON_DISCIPLINE = [
  '・甲は雇用において、乙の執務態度、能力、成績、勤怠などについて不適格と認める場合は解雇する。また試用期間終了時において乙の執務態度、能力、成績、勤怠などについて不適格と認められた場合は試用期間満了とし、契約を解除する',
]

const COMMON_NOTE = [
  '・この雇用契約書に定めのない事項については労働基準法及び就業規則の定める所による',
  '・本契約書は甲乙1部ずつ作成し、各々で保管する。',
]

function buildLaborNoticeSheet(workbook, config) {
  const ws = workbook.addWorksheet('雇用契約書兼労働条件通知書', {
    views: [{ showGridLines: false }],
    pageSetup: {
      paperSize: 9,
      orientation: 'portrait',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: { left: 0.5, right: 0.5, top: 0.6, bottom: 0.6, header: 0.2, footer: 0.2 },
    },
  })

  ws.columns = [
    { width: 18 },
    { width: 14 },
    { width: 14 },
    { width: 14 },
    { width: 14 },
    { width: 14 },
    { width: 14 },
    { width: 14 },
  ]

  ws.mergeCells('A1:H1')
  setCell(ws, 1, 1, '雇用契約書兼労働条件通知書', {
    horizontal: 'center',
    font: { ...titleFont, size: 14 },
  })
  ws.getRow(1).height = 30

  ws.mergeCells('A2:H2')
  setCell(ws, 2, 1, `氏名　${config.workerNamePlaceholder}　殿`, {
    horizontal: 'center',
    font: { ...bodyFont, size: 11, bold: true },
  })
  ws.getRow(2).height = 24

  let row = 4
  row = addSection(ws, row, '契 約 期 間', [config.contractPeriod], { editable: true, rowHeight: 22 })
  row = addSection(ws, row, '更新の有無', COMMON_RENEWAL, { rowHeight: 18 })
  row = addSection(ws, row, '雇用形態', COMMON_EMPLOYMENT_TYPE, { editable: true, rowHeight: 20 })
  row = addSection(ws, row, '就業の場所', COMMON_WORKPLACES, { editable: true, rowHeight: 22 })
  row = addSection(ws, row, '従事する業務の内容', [config.jobDescription], { editable: true, rowHeight: 24 })
  row = addSection(ws, row, '始業終業の時刻\n及び休憩時間', COMMON_WORK_HOURS, { rowHeight: 18 })
  row = addSection(ws, row, '所定外労働の有無', COMMON_OVERTIME, { rowHeight: 18 })
  row = addSection(ws, row, '休 日', ['施設休業日、その他事業所カレンダーで定める日とする'])
  row = addSection(ws, row, '休 暇', COMMON_LEAVE)
  row = addSection(ws, row, '賃 金', [...config.wageLines, ...COMMON_WAGE_FOOTER], {
    editable: true,
    rowHeight: 18,
  })
  row = addSection(ws, row, '退 職 に 関 す る 事 項', COMMON_RETIREMENT, { rowHeight: 18 })
  row = addSection(ws, row, '社会保険等の加入', COMMON_INSURANCE)
  row = addSection(ws, row, '解雇、退職、懲戒、\n服務規律、契約解除、\nその他', COMMON_DISCIPLINE, {
    rowHeight: 18,
    contentCharsPerLine: 64,
  })
  row = addSection(ws, row, '備考', COMMON_NOTE, { rowHeight: 18 })

  row += 1
  ws.mergeCells(row, 1, row, 8)
  setCell(ws, row, 1, '令和　　　年　　　月　　　日', { horizontal: 'right' })
  row += 2

  ws.mergeCells(row, 1, row, 8)
  setCell(ws, row, 1, '事業場所在地　〇〇県〇〇市〇〇1-2-3　〇〇就労継続支援B型事業所', {
    editable: true,
  })
  row += 1
  ws.mergeCells(row, 1, row, 8)
  setCell(ws, row, 1, '名　　　　称　株式会社〇〇〇〇', { editable: true })
  row += 1
  ws.mergeCells(row, 1, row, 8)
  setCell(ws, row, 1, '使用者職氏名　〇〇　〇〇　　　　　　　　　　　　　　　　　印', {
    editable: true,
  })
  row += 2
  ws.mergeCells(row, 1, row, 8)
  setCell(ws, row, 1, '労働者住所', { font: labelFont })
  row += 1
  ws.mergeCells(row, 1, row, 8)
  setCell(ws, row, 1, '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　', {
    border: { bottom: borderThin },
  })
  row += 1
  ws.mergeCells(row, 1, row, 8)
  setCell(ws, row, 1, '氏名　　　　　　　　　　　　　　　　　　　　　　　　　印', {
    border: { bottom: borderThin },
  })
}

async function buildWorkbooks() {
  const sabikanWb = new ExcelJS.Workbook()
  sabikanWb.creator = 'B型 開設準備手引書'
  buildLaborNoticeSheet(sabikanWb, {
    workerNamePlaceholder: '〇〇（サビ管）',
    contractPeriod: '期間の定めあり（令和　　年　　月　　日〜令和　　年　　月　　日）',
    employmentType: '（該当にチェック）',
    jobDescription: 'サービス管理責任者業務、他 付随する業務全般',
    wageLines: [
      '1. 基本給',
      '2. 諸手当',
      '3. 賃金締切日',
      '4. 賃金支払日',
      '5. 賃金からの控除',
      '6. 昇給',
      '・ 月給 〇〇〇,〇〇〇円（時間外労働〇〇時間分〇〇,〇〇〇円を含む）',
      '〇〇,〇〇〇円　処遇改善手当',
      '・ 通勤手当　上限15,000円まで（領収書提出分）',
    ],
  })
  await sabikanWb.xlsx.writeFile(join(outDir, 'employment-contract-sabikan.xlsx'))

  const staffWb = new ExcelJS.Workbook()
  staffWb.creator = 'B型 開設準備手引書'
  buildLaborNoticeSheet(staffWb, {
    workerNamePlaceholder: '〇〇（支援員）',
    contractPeriod: '期間の定めなし：令和　　年　　月　　日〜',
    employmentType: '（該当にチェック）',
    jobDescription: '就労継続支援B型業務、他 付随する業務全般（変更の場合あり）',
    wageLines: [
      '1. 基本給',
      '2. 諸手当',
      '3. 賃金締切日',
      '4. 賃金支払日',
      '5. 賃金からの控除',
      '6. 昇給',
      '・ 月給 〇〇〇,〇〇〇円（時間外労働〇〇時間分〇〇,〇〇〇円を含む）',
      '〇〇,〇〇〇円　処遇改善手当',
      '・ 通勤手当　上限15,000円まで（領収書提出分）',
    ],
  })
  await staffWb.xlsx.writeFile(join(outDir, 'employment-contract-staff.xlsx'))

  console.log('Generated: employment-contract-sabikan.xlsx')
  console.log('Generated: employment-contract-staff.xlsx')
}

buildWorkbooks().catch((error) => {
  console.error(error)
  process.exit(1)
})
