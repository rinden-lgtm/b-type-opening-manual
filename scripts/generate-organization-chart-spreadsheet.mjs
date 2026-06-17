import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import ExcelJS from 'exceljs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '../docs/public/downloads')
mkdirSync(outDir, { recursive: true })

const COLORS = {
  title: 'FF1E3A5F',
  label: 'FF64748B',
  text: 'FF0F172A',
  entityBorder: 'FF2563EB',
  entityFill: 'FFEFF6FF',
  sabikanBorder: 'FF3B82F6',
  sabikanFill: 'FFF0F9FF',
  staffBorder: 'FFCBD5E1',
  staffFill: 'FFF8FAFC',
  optionalBorder: 'FF94A3B8',
  connector: 'FF94A3B8',
  headerFill: 'FFF1F5F9',
  metaBorder: 'FFE2E8F0',
}

const thin = { style: 'thin', color: { argb: COLORS.connector } }
const mediumBlue = { style: 'medium', color: { argb: COLORS.entityBorder } }
const mediumSabikan = { style: 'medium', color: { argb: COLORS.sabikanBorder } }
const thinStaff = { style: 'thin', color: { argb: COLORS.staffBorder } }
const dashedStaff = { style: 'dashed', color: { argb: COLORS.optionalBorder } }

function allBorders(style) {
  return { top: style, left: style, bottom: style, right: style }
}

function setCell(ws, row, col, value, options = {}) {
  const cell = ws.getCell(row, col)
  cell.value = value
  cell.alignment = {
    horizontal: options.horizontal ?? 'left',
    vertical: options.vertical ?? 'middle',
    wrapText: options.wrapText ?? true,
  }
  if (options.font) cell.font = options.font
  if (options.border) cell.border = options.border
  if (options.fill) cell.fill = options.fill
  return cell
}

function mergeCard(ws, top, left, bottom, right, lines, options = {}) {
  ws.mergeCells(top, left, bottom, right)
  const cell = ws.getCell(top, left)
  cell.value = lines.filter(Boolean).join('\n')
  cell.alignment = {
    horizontal: 'center',
    vertical: 'middle',
    wrapText: true,
  }
  cell.font = {
    name: 'Yu Gothic',
    size: options.fontSize ?? 10,
    color: { argb: COLORS.text },
    bold: options.bold ?? false,
  }
  cell.border = allBorders(options.borderStyle ?? thinStaff)
  if (options.fill) {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: options.fill },
    }
  }
}

function drawConnectorDown(ws, row, col, height = 2) {
  for (let i = 0; i < height; i += 1) {
    const cell = ws.getCell(row + i, col)
    cell.value = ''
    cell.border = {
      left: thin,
      right: thin,
      top: i === 0 ? thin : undefined,
      bottom: i === height - 1 ? thin : undefined,
    }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFFFF' },
    }
  }
}

function drawStaffBranch(ws, row, cols) {
  cols.forEach((col) => {
    const cell = ws.getCell(row, col)
    cell.border = { top: thin, bottom: thin }
  })
  for (let c = cols[0]; c <= cols[cols.length - 1]; c += 1) {
    if (!cols.includes(c)) {
      const cell = ws.getCell(row, c)
      cell.border = { top: thin }
    }
  }
  const mid = cols[Math.floor(cols.length / 2)]
  const above = ws.getCell(row - 1, mid)
  above.border = {
    ...above.border,
    bottom: thin,
  }
}

async function buildWorkbook() {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'B型 開設準備手引書'
  workbook.created = new Date()

  const ws = workbook.addWorksheet('組織図', {
    views: [{ showGridLines: false }],
    pageSetup: {
      paperSize: 8,
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 1,
      margins: { left: 0.4, right: 0.4, top: 0.5, bottom: 0.5, header: 0.2, footer: 0.2 },
    },
  })

  ws.columns = [
    { width: 2.5 },
    { width: 11 },
    { width: 11 },
    { width: 11 },
    { width: 11 },
    { width: 11 },
    { width: 11 },
    { width: 11 },
    { width: 11 },
    { width: 11 },
    { width: 11 },
    { width: 11 },
    { width: 2.5 },
  ]

  ws.mergeCells('B2:L2')
  setCell(ws, 2, 2, '就労継続支援B型 組織図', {
    horizontal: 'center',
    font: { name: 'Yu Gothic', size: 16, bold: true, color: { argb: COLORS.title } },
  })
  ws.getRow(2).height = 28

  ws.mergeCells('B4:C4')
  setCell(ws, 4, 2, '【基本情報】', {
    font: { name: 'Yu Gothic', size: 11, bold: true, color: { argb: COLORS.title } },
  })

  const metaRows = [
    ['事業所名', '〇〇就労継続支援B型事業所'],
    ['運営法人', '株式会社〇〇〇〇'],
    ['所在地', '〒000-0000　〇〇県〇〇市〇〇'],
    ['作成日', '令和　　　年　　月　　日'],
    ['基準日', '令和　　　年　　月　　日現在'],
  ]

  metaRows.forEach(([label, value], index) => {
    const row = 5 + index
    ws.mergeCells(row, 2, row, 3)
    ws.mergeCells(row, 4, row, 11)
    setCell(ws, row, 2, label, {
      font: { name: 'Yu Gothic', size: 10, bold: true, color: { argb: COLORS.label } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.headerFill } },
      border: allBorders({ style: 'thin', color: { argb: COLORS.metaBorder } }),
    })
    setCell(ws, row, 4, value, {
      font: { name: 'Yu Gothic', size: 10, color: { argb: COLORS.text } },
      border: allBorders({ style: 'thin', color: { argb: COLORS.metaBorder } }),
    })
    ws.getRow(row).height = 22
  })

  ws.mergeCells('B11:L11')
  setCell(ws, 11, 2, '【組織体制】', {
    horizontal: 'center',
    font: { name: 'Yu Gothic', size: 11, bold: true, color: { argb: COLORS.title } },
  })

  mergeCard(
    ws,
    13,
    5,
    16,
    8,
    ['運営法人', '株式会社〇〇〇〇', '代表者：〇〇　〇〇'],
    { borderStyle: mediumBlue, fill: COLORS.entityFill, fontSize: 10 },
  )
  drawConnectorDown(ws, 17, 6, 2)

  mergeCard(
    ws,
    19,
    5,
    22,
    8,
    ['事業所', '〇〇就労継続支援B型事業所', '管理者：〇〇　〇〇'],
    { borderStyle: mediumBlue, fill: COLORS.entityFill, fontSize: 10 },
  )
  drawConnectorDown(ws, 23, 6, 2)

  mergeCard(
    ws,
    25,
    5,
    28,
    8,
    ['管理者', '（氏名を記入）', '雇用形態：常勤', '週所定：40時間'],
    { borderStyle: mediumSabikan, fill: COLORS.sabikanFill, fontSize: 10 },
  )
  drawConnectorDown(ws, 29, 6, 2)

  mergeCard(
    ws,
    31,
    5,
    35,
    8,
    [
      'サービス管理責任者',
      '（氏名を記入）',
      '雇用形態：常勤　／　週所定：40時間',
      'サビ管研修修了',
    ],
    { borderStyle: mediumSabikan, fill: COLORS.sabikanFill, fontSize: 10 },
  )
  drawConnectorDown(ws, 36, 6, 1)
  drawStaffBranch(ws, 37, [3, 6, 9])

  mergeCard(
    ws,
    38,
    2,
    42,
    4,
    ['生活支援員', '（氏名を記入）', '雇用形態：常勤', '週所定：40時間'],
    { borderStyle: thinStaff, fill: COLORS.staffFill, fontSize: 9 },
  )
  mergeCard(
    ws,
    38,
    5,
    42,
    7,
    ['生活支援員', '（氏名を記入）', '雇用形態：非常勤', '週所定：20時間'],
    { borderStyle: thinStaff, fill: COLORS.staffFill, fontSize: 9 },
  )
  mergeCard(
    ws,
    38,
    8,
    42,
    10,
    ['職業指導員', '（氏名を記入）', '雇用形態：常勤', '週所定：40時間'],
    { borderStyle: thinStaff, fill: COLORS.staffFill, fontSize: 9 },
  )
  mergeCard(
    ws,
    38,
    11,
    42,
    12,
    ['事務・その他', '（氏名を記入）', '雇用形態：非常勤', '不要な枠は削除可'],
    { borderStyle: dashedStaff, fill: COLORS.staffFill, fontSize: 9 },
  )

  ;[13, 19, 25, 31, 38].forEach((row) => {
    ws.getRow(row).height = 18
    ws.getRow(row + 1).height = 18
    ws.getRow(row + 2).height = 18
    if (row >= 31) ws.getRow(row + 3).height = 18
  })

  ws.mergeCells('B44:C44')
  setCell(ws, 44, 2, '常勤換算（人）', {
    font: { name: 'Yu Gothic', size: 10, bold: true, color: { argb: COLORS.label } },
  })
  ws.mergeCells('D44:F44')
  setCell(ws, 44, 4, '', {
    border: { bottom: { style: 'thin', color: { argb: COLORS.metaBorder } } },
  })
  setCell(ws, 44, 7, '（配置基準の確認は上位店へ）', {
    font: { name: 'Yu Gothic', size: 9, color: { argb: COLORS.label } },
  })

  ws.mergeCells('B46:L46')
  setCell(ws, 46, 2, '兼務・兼務内容（該当する場合）', {
    font: { name: 'Yu Gothic', size: 10, bold: true, color: { argb: COLORS.label } },
  })
  ws.mergeCells('B47:L48')
  setCell(ws, 47, 2, '', {
    border: allBorders({ style: 'thin', color: { argb: COLORS.metaBorder } }),
  })
  ws.getRow(47).height = 20
  ws.getRow(48).height = 20

  ws.mergeCells('B50:L50')
  setCell(ws, 50, 2, '備考（指導体制・欠員時の体制等）', {
    font: { name: 'Yu Gothic', size: 10, bold: true, color: { argb: COLORS.label } },
  })
  ws.mergeCells('B51:L52')
  setCell(ws, 51, 2, '', {
    border: allBorders({ style: 'thin', color: { argb: COLORS.metaBorder } }),
  })

  ws.mergeCells('B54:E54')
  setCell(ws, 54, 2, '作成者：', {
    font: { name: 'Yu Gothic', size: 10, color: { argb: COLORS.text } },
    border: { bottom: { style: 'thin', color: { argb: COLORS.metaBorder } } },
  })
  ws.mergeCells('G54:J54')
  setCell(ws, 54, 7, '確認者（上位店）：', {
    font: { name: 'Yu Gothic', size: 10, color: { argb: COLORS.text } },
    border: { bottom: { style: 'thin', color: { argb: COLORS.metaBorder } } },
  })

  const staffWs = workbook.addWorksheet('職員一覧', {
    views: [{ state: 'frozen', ySplit: 3 }],
  })

  staffWs.mergeCells('A1:G1')
  setCell(staffWs, 1, 1, '職員一覧', {
    horizontal: 'center',
    font: { name: 'Yu Gothic', size: 14, bold: true, color: { argb: COLORS.title } },
  })

  const headers = ['No.', '職種', '氏名', '雇用形態', '週所定労働時間', '保有資格・研修', '備考']
  headers.forEach((header, index) => {
    setCell(staffWs, 3, index + 1, header, {
      horizontal: 'center',
      font: { name: 'Yu Gothic', size: 10, bold: true, color: { argb: COLORS.text } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.headerFill } },
      border: allBorders({ style: 'thin', color: { argb: COLORS.metaBorder } }),
    })
  })

  const staffRows = [
    ['1', '管理者', '', '常勤', '40', '', ''],
    ['2', 'サービス管理責任者', '', '常勤', '40', 'サビ管研修修了', ''],
    ['3', '生活支援員', '', '常勤', '40', '実務者研修修了', ''],
    ['4', '生活支援員', '', '非常勤', '20', '', ''],
    ['5', '職業指導員', '', '常勤', '40', '', ''],
    ['6', '', '', '', '', '', ''],
    ['7', '', '', '', '', '', ''],
    ['8', '', '', '', '', '', ''],
  ]

  staffRows.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      setCell(staffWs, rowIndex + 4, colIndex + 1, value, {
        horizontal: colIndex === 0 ? 'center' : 'left',
        font: { name: 'Yu Gothic', size: 10, color: { argb: COLORS.text } },
        border: allBorders({ style: 'thin', color: { argb: COLORS.metaBorder } }),
      })
    })
    staffWs.getRow(rowIndex + 4).height = 24
  })

  staffWs.getColumn(1).width = 6
  staffWs.getColumn(2).width = 24
  staffWs.getColumn(3).width = 16
  staffWs.getColumn(4).width = 12
  staffWs.getColumn(5).width = 16
  staffWs.getColumn(6).width = 22
  staffWs.getColumn(7).width = 20

  setCell(staffWs, 13, 1, '常勤換算（人）', {
    font: { name: 'Yu Gothic', size: 10, bold: true, color: { argb: COLORS.label } },
  })
  setCell(staffWs, 14, 1, '配置基準の確認', {
    font: { name: 'Yu Gothic', size: 10, bold: true, color: { argb: COLORS.label } },
  })
  setCell(staffWs, 14, 2, '上位店へ確認', {
    font: { name: 'Yu Gothic', size: 10, color: { argb: COLORS.text } },
  })

  const xlsxPath = join(outDir, 'organization-chart.xlsx')
  await workbook.xlsx.writeFile(xlsxPath)

  const csvLines = [
    ['就労継続支援B型 組織図'],
    [],
    ...metaRows.map(([label, value]) => [label, value]),
    [],
    ['階層', '区分', '職種', '氏名', '雇用形態', '週所定労働時間', '保有資格・研修', '備考'],
    ['1', '運営法人', '運営法人', '株式会社〇〇〇〇', '', '', '', '代表者：〇〇　〇〇'],
    ['2', '事業所', '事業所', '〇〇就労継続支援B型事業所', '', '', '', '管理者：〇〇　〇〇'],
    ['3', '管理者', '管理者', '', '常勤', '40', '', ''],
    ['4', 'サビ管', 'サービス管理責任者', '', '常勤', '40', 'サビ管研修修了', ''],
    ['5', '職員', '生活支援員', '', '常勤', '40', '実務者研修修了', ''],
    ['6', '職員', '生活支援員', '', '非常勤', '20', '', ''],
    ['7', '職員', '職業指導員', '', '常勤', '40', '', ''],
    ['8', '職員', '事務・その他', '', '非常勤', '', '', '不要な行は削除可'],
  ]

  const csvPath = join(outDir, 'organization-chart.csv')
  const csv = csvLines
    .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\r\n')
  writeFileSync(csvPath, `\uFEFF${csv}`, 'utf8')

  console.log(`Generated: ${xlsxPath}`)
  console.log(`Generated: ${csvPath}`)
}

buildWorkbook().catch((error) => {
  console.error(error)
  process.exit(1)
})
