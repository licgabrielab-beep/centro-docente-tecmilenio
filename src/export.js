import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'
import { saveAs } from 'file-saver'

// ============================================================
// LECTURA DE ARCHIVOS · TXT, DOCX, PDF
// Toda la lectura es local en el navegador (sin servidor).
// ============================================================

// Lee un archivo y retorna su texto extraído. Soporta .txt, .docx, .pdf.
export async function readFileText(file) {
  const name = (file.name || '').toLowerCase()

  if (name.endsWith('.txt')) {
    return await file.text()
  }

  if (name.endsWith('.docx')) {
    const mammoth = await import('mammoth/mammoth.browser.js')
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    return result.value || ''
  }

  if (name.endsWith('.pdf')) {
    const pdfjsLib = await import('pdfjs-dist/build/pdf.mjs')
    // Configura worker con CDN (compatible con Vite/Vercel)
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.7.76/pdf.worker.min.mjs'
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    let text = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const strs = content.items.map((it) => it.str)
      text += strs.join(' ') + '\n\n'
    }
    return text.trim()
  }

  throw new Error('Formato no soportado. Usa .txt, .docx o .pdf')
}

// ============================================================
// EXPORTAR A WORD (.docx)
// ============================================================

function markdownToDocx(md) {
  const lines = md.split('\n')
  const paragraphs = []

  for (const raw of lines) {
    const line = raw.trimEnd()
    if (!line.trim()) {
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: '' })] }))
      continue
    }

    if (line.startsWith('# ')) {
      paragraphs.push(new Paragraph({
        text: line.slice(2).trim(),
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 120 },
      }))
      continue
    }
    if (line.startsWith('## ')) {
      paragraphs.push(new Paragraph({
        text: line.slice(3).trim(),
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 180, after: 100 },
      }))
      continue
    }
    if (line.startsWith('### ')) {
      paragraphs.push(new Paragraph({
        text: line.slice(4).trim(),
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 160, after: 80 },
      }))
      continue
    }

    if (/^[-*]\s+/.test(line)) {
      const content = line.replace(/^[-*]\s+/, '')
      paragraphs.push(new Paragraph({
        children: parseInlineToRuns(content),
        bullet: { level: 0 },
      }))
      continue
    }

    if (/^\d+\.\s+/.test(line)) {
      const content = line.replace(/^\d+\.\s+/, '')
      paragraphs.push(new Paragraph({
        children: parseInlineToRuns(content),
        numbering: { reference: 'default-numbering', level: 0 },
      }))
      continue
    }

    paragraphs.push(new Paragraph({
      children: parseInlineToRuns(line),
      spacing: { after: 100 },
    }))
  }
  return paragraphs
}

function parseInlineToRuns(text) {
  const runs = []
  const regex = /(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|`[^`]+`)/g
  let last = 0
  let match
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      runs.push(new TextRun({ text: text.slice(last, match.index) }))
    }
    const token = match[0]
    if (token.startsWith('**') || token.startsWith('__')) {
      runs.push(new TextRun({ text: token.slice(2, -2), bold: true }))
    } else if (token.startsWith('*')) {
      runs.push(new TextRun({ text: token.slice(1, -1), italics: true }))
    } else if (token.startsWith('`')) {
      runs.push(new TextRun({ text: token.slice(1, -1), font: 'Consolas' }))
    }
    last = match.index + token.length
  }
  if (last < text.length) runs.push(new TextRun({ text: text.slice(last) }))
  if (runs.length === 0) runs.push(new TextRun({ text }))
  return runs
}

export async function exportToWord(title, content) {
  const titleParagraph = new Paragraph({
    children: [new TextRun({ text: title, bold: true, size: 32, color: '0b3c3a' })],
    alignment: AlignmentType.LEFT,
    spacing: { after: 240 },
  })

  const metadata = new Paragraph({
    children: [new TextRun({
      text: `Generado el ${new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })} con Aula CLARA · Tecmilenio`,
      italics: true,
      size: 18,
      color: '888888',
    })],
    spacing: { after: 320 },
  })

  const doc = new Document({
    creator: 'Aula CLARA Tecmilenio',
    title,
    numbering: {
      config: [{
        reference: 'default-numbering',
        levels: [{
          level: 0,
          format: 'decimal',
          text: '%1.',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 360, hanging: 260 } } },
        }],
      }],
    },
    sections: [{
      properties: {},
      children: [titleParagraph, metadata, ...markdownToDocx(content)],
    }],
  })

  const blob = await Packer.toBlob(doc)
  const safeName = title.replace(/[^a-z0-9áéíóúñ\s]/gi, '').replace(/\s+/g, '_').slice(0, 60)
  saveAs(blob, `${safeName || 'documento'}.docx`)
}

// ============================================================
// COPIAR AL PORTAPAPELES
// ============================================================

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    try {
      document.execCommand('copy')
      document.body.removeChild(ta)
      return true
    } catch {
      document.body.removeChild(ta)
      return false
    }
  }
}

// ============================================================
// IMPRIMIR / EXPORTAR A PDF
// ============================================================

export function printContent(title, htmlContent) {
  const w = window.open('', '_blank', 'width=900,height=800')
  if (!w) {
    alert('Tu navegador bloqueó la ventana de impresión. Permite pop-ups para este sitio.')
    return
  }
  w.document.write(`<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>${title}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 780px; margin: 40px auto; padding: 0 30px; color: #1a1f2b; line-height: 1.6; }
  h1 { color: #0b3c3a; font-size: 26px; border-bottom: 3px solid #1a5f5a; padding-bottom: 8px; }
  h2 { color: #0b3c3a; font-size: 19px; margin-top: 28px; }
  h3 { color: #1a5f5a; font-size: 16px; margin-top: 20px; }
  table { border-collapse: collapse; width: 100%; margin: 14px 0; }
  th { background: #d6f0e4; color: #0b3c3a; padding: 10px; text-align: left; border: 1px solid #9fd9c7; }
  td { padding: 9px 10px; border: 1px solid #dfe3e8; vertical-align: top; }
  ul, ol { padding-left: 22px; }
  li { margin-bottom: 4px; }
  .meta { color: #888; font-size: 12px; font-style: italic; margin-bottom: 28px; }
  @media print { body { margin: 0; padding: 20px; } }
</style>
</head>
<body>
<h1>${title}</h1>
<p class="meta">Generado con Aula CLARA · Tecmilenio · ${new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
${htmlContent}
<script>window.addEventListener('load', () => setTimeout(() => window.print(), 250));</script>
</body>
</html>`)
  w.document.close()
}
