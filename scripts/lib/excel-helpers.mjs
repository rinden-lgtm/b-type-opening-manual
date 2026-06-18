export const COLORS = {
  title: 'FF1E3A5F',
  label: 'FF334155',
  text: 'FF0F172A',
  border: 'FFCBD5E1',
  labelFill: 'FFF8FAFC',
  editFill: 'FFFFF7ED',
  sectionFill: 'FFF1F5F9',
}

const borderThin = { style: 'thin', color: { argb: COLORS.border } }

export const fonts = {
  title: { name: 'Yu Gothic', size: 14, bold: true, color: { argb: COLORS.title } },
  section: { name: 'Yu Gothic', size: 11, bold: true, color: { argb: COLORS.label } },
  label: { name: 'Yu Gothic', size: 10, bold: true, color: { argb: COLORS.label } },
  body: { name: 'Yu Gothic', size: 10, color: { argb: COLORS.text } },
}

export function allBorders() {
  return { top: borderThin, left: borderThin, bottom: borderThin, right: borderThin }
}

export function setCell(ws, row, col, value, options = {}) {
  const cell = ws.getCell(row, col)
  cell.value = value
  cell.alignment = {
    horizontal: options.horizontal ?? 'left',
    vertical: options.vertical ?? 'top',
    wrapText: options.wrapText ?? true,
  }
  cell.font = options.font ?? fonts.body
  if (options.border) cell.border = options.border
  if (options.fill) cell.fill = options.fill
  return cell
}

export function mergeRow(ws, row, fromCol, toCol, value, options = {}) {
  ws.mergeCells(row, fromCol, row, toCol)
  setCell(ws, row, fromCol, value, options)
  ws.getRow(row).height = options.rowHeight ?? 22
  return row + 1
}

export function addTitle(ws, row, title, colSpan = 8) {
  return mergeRow(ws, row, 1, colSpan, title, {
    horizontal: 'center',
    font: fonts.title,
    rowHeight: 28,
  })
}

export function addMetaFields(ws, row, fields, colSpan = 8) {
  for (const field of fields) {
    row = mergeRow(ws, row, 1, colSpan, `${field}：`, { font: fonts.body, rowHeight: 20 })
    row = mergeRow(ws, row, 1, colSpan, '', {
      border: { bottom: borderThin },
      rowHeight: 22,
    })
  }
  return row + 1
}

export function addSectionHeader(ws, row, title, colSpan = 8) {
  return mergeRow(ws, row, 1, colSpan, title, {
    font: fonts.section,
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.sectionFill } },
    rowHeight: 24,
  })
}

export function addChecklistTable(ws, row, headers, items, colSpan = 8) {
  const colCount = headers.length
  const colWidth = Math.floor(colSpan / colCount)
  for (let c = 0; c < colCount; c += 1) {
    const start = c * colWidth + 1
    const end = c === colCount - 1 ? colSpan : start + colWidth - 1
    ws.mergeCells(row, start, row, end)
    setCell(ws, row, start, headers[c], {
      font: fonts.label,
      horizontal: 'center',
      vertical: 'middle',
      border: allBorders(),
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.labelFill } },
    })
  }
  ws.getRow(row).height = 20
  row += 1

  for (const item of items) {
    for (let c = 0; c < colCount; c += 1) {
      const start = c * colWidth + 1
      const end = c === colCount - 1 ? colSpan : start + colWidth - 1
      ws.mergeCells(row, start, row, end)
      const value = Array.isArray(item) ? item[c] ?? '' : c === 0 ? item : c === 1 ? '☐' : ''
      setCell(ws, row, start, value, {
        border: allBorders(),
        horizontal: c === 1 ? 'center' : 'left',
        vertical: 'middle',
      })
    }
    ws.getRow(row).height = 20
    row += 1
  }
  return row + 1
}

export function addFormTable(ws, row, rows, colSpan = 8) {
  const labelCols = colSpan <= 2 ? 1 : Math.min(3, Math.floor(colSpan / 3))
  const valueStart = labelCols + 1
  const valueEnd = Math.max(valueStart, colSpan)
  for (const [label, hint] of rows) {
    ws.mergeCells(row, 1, row, labelCols)
    setCell(ws, row, 1, label, {
      font: fonts.label,
      border: allBorders(),
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.labelFill } },
      vertical: 'middle',
    })
    ws.mergeCells(row, valueStart, row, valueEnd)
    setCell(ws, row, valueStart, hint ?? '', {
      border: allBorders(),
      fill: hint
        ? undefined
        : { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.editFill } },
    })
    ws.getRow(row).height = 22
    row += 1
  }
  return row + 1
}

export function addDataGrid(ws, row, headers, dataRows, colSpan = headers.length) {
  for (let c = 0; c < headers.length; c += 1) {
    setCell(ws, row, c + 1, headers[c], {
      font: fonts.label,
      horizontal: 'center',
      border: allBorders(),
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.labelFill } },
    })
  }
  ws.getRow(row).height = 20
  row += 1

  for (const dataRow of dataRows) {
    for (let c = 0; c < headers.length; c += 1) {
      setCell(ws, row, c + 1, dataRow[c] ?? '', {
        border: allBorders(),
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.editFill } },
      })
    }
    ws.getRow(row).height = 20
    row += 1
  }
  return row + 1
}

export function addArticle(ws, row, title, lines, colSpan = 8) {
  row = mergeRow(ws, row, 1, colSpan, title, { font: fonts.section, rowHeight: 22 })
  for (const line of lines) {
    row = mergeRow(ws, row, 1, colSpan, line, { rowHeight: 18 })
  }
  return row + 1
}

export function addEditableLine(ws, row, label, placeholder, colSpan = 8) {
  row = mergeRow(ws, row, 1, colSpan, `${label}${placeholder}`, {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.editFill } },
    rowHeight: 20,
  })
  return row
}

export function configureColumns(ws, widths) {
  widths.forEach((width, index) => {
    ws.getColumn(index + 1).width = width
  })
}

export function defaultPageSetup(ws, landscape = false) {
  ws.pageSetup = {
    paperSize: 9,
    orientation: landscape ? 'landscape' : 'portrait',
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    margins: { left: 0.5, right: 0.5, top: 0.6, bottom: 0.6, header: 0.2, footer: 0.2 },
  }
}
