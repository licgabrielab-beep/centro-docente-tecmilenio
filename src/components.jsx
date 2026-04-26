import { useState } from 'react'
import { marked } from 'marked'

// ============================================================
// ICONOS SVG
// ============================================================

const ic = (path, vb = '0 0 24 24') => ({ size = 16, color = 'currentColor' }) => (
  <svg viewBox={vb} width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {path}
  </svg>
)

export const Icon = {
  Home:       ic(<><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/></>),
  Calendar:   ic(<><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/></>),
  Diseno:     ic(<><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></>),
  Banco:      ic(<><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></>),
  Prompts:    ic(<><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6M9 13h6M9 17h4"/></>),
  Simplify:   ic(<><path d="M3 12h10M3 6h18M3 18h14"/></>),
  Timer:      ic(<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>),
  Message:    ic(<><path d="M4 4h16v12H5.17L4 17.17z"/></>),
  Target:     ic(<><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></>),
  Book:       ic(<><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>),
  Learn:      ic(<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></>),
  Sparkles:   ic(<><path d="M12 3v4M12 17v4M5 12H1M23 12h-4M18.36 5.64l-2.83 2.83M8.47 15.53l-2.83 2.83M18.36 18.36l-2.83-2.83M8.47 8.47L5.64 5.64"/></>),
  Idea:       ic(<><path d="M9 21h6M12 2a7 7 0 014 12.7V17H8v-2.3A7 7 0 0112 2z"/></>),
  Check:      ic(<path d="M20 6L9 17l-5-5"/>),
  Copy:       ic(<><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></>),
  Download:   ic(<><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/></>),
  Print:      ic(<><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z"/></>),
  Save:       ic(<><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8M7 3v5h8"/></>),
  Trash:      ic(<><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></>),
  ChevronR:   ic(<path d="M9 18l6-6-6-6"/>),
  ChevronL:   ic(<path d="M15 18l-6-6 6-6"/>),
  ArrowR:     ic(<><path d="M5 12h14M12 5l7 7-7 7"/></>),
  Plus:       ic(<><path d="M12 5v14M5 12h14"/></>),
  Warning:    ic(<><path d="M10.3 3.7L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.7a2 2 0 00-3.4 0z"/><path d="M12 9v4M12 17h0"/></>),
  Beta:       ic(<><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h0"/></>),
  Upload:     ic(<><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><path d="M17 8l-5-5-5 5M12 3v12"/></>),
  File:       ic(<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></>),
  User:       ic(<><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></>),
  Edit:       ic(<><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>),
  Star:       ic(<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>),
  Compass:    ic(<><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></>),
  Ladder:     ic(<><path d="M5 3v18M19 3v18M5 9h14M5 15h14M5 6h14M5 12h14M5 18h14"/></>),
  Scale:      ic(<><path d="M12 3v18M3 7h18"/><path d="M5 7l-3 7h6zM19 7l-3 7h6z"/></>),
}

// ============================================================
// TOOLTIP DE AYUDA
// ============================================================

export function HelpTip({ text }) {
  const [open, setOpen] = useState(false)
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        className="help-btn"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(e) => { e.preventDefault(); setOpen((v) => !v) }}
        aria-label="Ayuda"
      >
        ?
      </button>
      {open && <span className="help-tooltip" role="tooltip">{text}</span>}
    </span>
  )
}

// ============================================================
// MARKDOWN RENDERER
// ============================================================

marked.setOptions({ gfm: true, breaks: false })

export function MarkdownOutput({ markdown }) {
  const html = marked.parse(markdown || '')
  return <div className="output" dangerouslySetInnerHTML={{ __html: html }} />
}

export function markdownToHtml(markdown) {
  return marked.parse(markdown || '')
}

// ============================================================
// HELPER · Llamada a Claude
// ============================================================

export async function callClaude(prompt, system, max_tokens = 2200) {
  const res = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, system, max_tokens }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error desconocido')
  return data.text
}

export const SYSTEM_CLARA = `Eres un asistente pedagógico experto en el modelo CLARA de Universidad Tecmilenio, dentro del modelo educativo MAPS.

Modelo CLARA en una clase de 120 min:
- C · Contextualizar (15% · 18 min): marco inicial que conecta con la realidad del estudiante.
- L · Llevar a la práctica (25% · 30 min): aplicar lo aprendido en ejemplos concretos.
- A · Activar el diálogo (25% · 30 min): interactuar continuamente con estudiantes.
- R · Retroalimentar (20% · 24 min): comentarios que guíen el aprendizaje.
- A · Anclar el propósito (15% · 18 min): conectar con el propósito de vida.

"Llevar a la práctica + Activar el diálogo" suman 50% y ocurren entrelazadas.

3 pilares: calidad académica · exigencia académica · integridad académica.

Docente REFEREENTE: Responsable, Empático, Flexible, Exigente, Reflexivo, Excelente, Neutral, Tech Savvy, Ético.

Contexto: los docentes son profesionistas de su área (ingeniería, finanzas, marketing, etc.) con poca o nula formación pedagógica. Imparten a estudiantes de nivel profesional, periodos de 8 semanas, varias materias llevan certificación externa (Scrum, AWS, Google, Six Sigma, etc.). La semana 8 siempre se dedica a presentación final del reto.

Los estudiantes Tecmilenio escriben su propósito de vida durante su trayectoria — esto es un trabajo institucional al que la fase Anclar el propósito se conecta directamente.

Respondes siempre en español, con estructura clara (usa markdown: ## encabezados, - viñetas, tablas cuando útil), acciones concretas y alineadas al modelo CLARA. Evita jerga pedagógica sin explicarla.`
