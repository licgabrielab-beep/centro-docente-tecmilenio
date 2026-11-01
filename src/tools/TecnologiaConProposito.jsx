import { useState } from 'react'
import { Icon, MarkdownOutput, markdownToHtml, HelpTip } from '../components.jsx'
import { copyToClipboard, exportToWord, printContent } from '../export.js'
import { trackUso } from '../analytics.js'

// ============================================================
// Tecnología con propósito
// Espacio SOLO para docentes (nivel Profesional).
// Plantillas para Canvas, guion del acuerdo con el grupo y guía rápida.
// No usa IA, no guarda datos de estudiantes, no reporta a nadie.
// Propuesta de autoría: Gabriela Martínez Bello, desarrollada con Claude (Anthropic).
// ============================================================

const TABS = [
  { id: 'acuerdo', label: 'Acuerdo de dispositivos' },
  { id: 'aviso',   label: 'Aviso de IA' },
  { id: 'grupo',   label: 'Acuerdo con el grupo' },
  { id: 'guia',    label: 'Guía rápida' },
]

// Quita el formato **negrita** para que al pegar en Canvas no aparezcan asteriscos
function aTextoPlano(md) {
  return md.replace(/\*\*/g, '').replace(/^#+\s*/gm, '').replace(/^> ?/gm, '')
}

function valor(v, marcador) {
  return v && v.trim() ? v.trim() : `[${marcador}]`
}

export default function TecnologiaConProposito({ onBack }) {
  const [tab, setTab] = useState('acuerdo')
  const [materia, setMateria] = useState('')
  const [periodo, setPeriodo] = useState('')

  // Acuerdo de dispositivos
  const [usoProposito, setUsoProposito] = useState('')
  const [guardados, setGuardados] = useState('')
  const [noPermitido, setNoPermitido] = useState('')
  const [copiado, setCopiado] = useState('')

  // Aviso de IA
  const [conIA, setConIA] = useState('')
  const [sinIA, setSinIA] = useState('')
  const [citar, setCitar] = useState('')
  const [yoUso, setYoUso] = useState('')

  const acuerdoMd = `## Acuerdo de uso de dispositivos · ${valor(materia, 'Materia')} · ${valor(periodo, 'Periodo')}

Queremos que cada uno decida con conciencia dónde pone su atención. Este acuerdo lo construimos juntos en la primera sesión.

**Cuándo y para qué los usamos:** ${valor(usoProposito, 'ej. celular o laptop solo en las actividades marcadas con «uso con propósito»')}

**Cuándo van guardados:** ${valor(guardados, 'ej. explicaciones, discusiones, retroalimentación y cierres')}

**Qué no se permite:** ${valor(noPermitido, 'ej. grabar o fotografiar a compañeros sin su permiso; usarlos durante evaluaciones salvo indicación')}

**Responsabilidades:** el docente avisa en cada actividad qué momentos son con dispositivo y cuáles no; cada estudiante cuida su atención y avisa antes si necesita un uso especial (por ejemplo, salud o una situación familiar).

**Si no se cumple:** primero conversamos; si se repite, acordamos un compromiso; si persiste, se involucra a la mentora (figura de acompañamiento), conforme al Reglamento vigente.`

  const avisoMd = `## Aviso de IA · ${valor(materia, 'Materia')} · ${valor(periodo, 'Periodo')}

En este curso la IA puede ser una herramienta de aprendizaje si se usa con transparencia.

**Se permite IA en:** ${valor(conIA, 'actividades')}

**No se permite IA en:** ${valor(sinIA, 'actividades')}

**Cómo declarar:** al entregar, indica en una línea qué herramienta usaste, para qué y qué partes cambiaste.

**Cómo citar:** ${valor(citar, 'formato indicado por el curso')}

**Recuerda:** podré pedirte que me expliques tu trabajo. Tú eres responsable de lo que entregas, incluida su veracidad.

**Yo también la uso:** ${valor(yoUso, 'ej. para preparar ejemplos y reactivos; siempre los reviso antes de compartirlos')}`

  async function copiar(id, md, herramienta) {
    const ok = await copyToClipboard(aTextoPlano(md))
    if (ok) {
      setCopiado(id)
      trackUso(herramienta, null, materia)
      setTimeout(() => setCopiado(''), 1500)
    }
  }

  function bajarWord(titulo, md, herramienta) {
    exportToWord(titulo, md)
    trackUso(herramienta, null, materia)
  }

  function imprimir(titulo, md, herramienta) {
    printContent(titulo, markdownToHtml(md))
    trackUso(herramienta, null, materia)
  }

  function Acciones({ id, titulo, md, herramienta }) {
    return (
      <div className="btn-row">
        <button className="btn-secondary" onClick={() => copiar(id, md, herramienta)}>
          <Icon.Copy size={13} /> {copiado === id ? 'Copiado para Canvas' : 'Copiar para Canvas'}
        </button>
        <button className="btn-secondary" onClick={() => bajarWord(titulo, md, herramienta)}>
          <Icon.Download size={13} /> Word
        </button>
        <button className="btn-secondary" onClick={() => imprimir(titulo, md, herramienta)}>
          <Icon.Print size={13} /> PDF
        </button>
      </div>
    )
  }

  return (
    <div className="tool-panel">
      <div className="tool-panel-header">
        <div>
          <h2 className="tool-panel-title">Tecnología con propósito</h2>
          <p className="tool-panel-subtitle">
            Acuerdos y avisos listos para Canvas, y la ruta formativa para dispositivos e IA en tu clase.
          </p>
        </div>
        <button className="back-btn" onClick={onBack}><Icon.ChevronL size={12} /> Volver</button>
      </div>

      <div className="why-box">
        <b>¿Para qué sirve?</b> Los lineamientos piden que cada docente acuerde con su grupo cuándo se usan dispositivos e IA, y que lo documente en Canvas (Anuncios). Aquí armas ese acuerdo y el Aviso de IA en minutos. Es una herramienta de acompañamiento para ti: no vigila ni reporta a nadie. Si Vicerrectoría o Canvas publica una plantilla oficial, usa esa.
      </div>

      <div className="btn-row" style={{ marginBottom: 16 }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            className="btn-secondary"
            style={tab === t.id ? { background: 'var(--tec-green)', color: 'white' } : undefined}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {(tab === 'acuerdo' || tab === 'aviso') && (
        <div className="row">
          <div className="field">
            <div className="field-label">Materia</div>
            <input value={materia} onChange={(e) => setMateria(e.target.value)} placeholder="Ej. Innovación y emprendimiento" />
          </div>
          <div className="field">
            <div className="field-label">Periodo</div>
            <input value={periodo} onChange={(e) => setPeriodo(e.target.value)} placeholder="Ej. Ene-Mar 2027, módulo 1" />
          </div>
        </div>
      )}

      {tab === 'acuerdo' && (
        <>
          <div className="field">
            <div className="field-label">
              Cuándo y para qué se usan
              <HelpTip text="Describe las actividades donde el dispositivo es herramienta. Lo que importa es el impacto en el aprendizaje, no la posesión del dispositivo. Aplica igual para celular y audífonos." />
            </div>
            <textarea value={usoProposito} onChange={(e) => setUsoProposito(e.target.value)} placeholder="Ej. Celular o laptop solo en las actividades marcadas con «uso con propósito»" style={{ minHeight: 60 }} />
          </div>
          <div className="field">
            <div className="field-label">Cuándo van guardados</div>
            <textarea value={guardados} onChange={(e) => setGuardados(e.target.value)} placeholder="Ej. Explicaciones, discusiones, retroalimentación y cierres" style={{ minHeight: 60 }} />
          </div>
          <div className="field">
            <div className="field-label">Qué no se permite</div>
            <textarea value={noPermitido} onChange={(e) => setNoPermitido(e.target.value)} placeholder="Ej. Grabar o fotografiar a compañeros sin su permiso; usarlos durante evaluaciones salvo indicación" style={{ minHeight: 60 }} />
          </div>
          <div className="field-hint" style={{ marginBottom: 10 }}>
            Lo que dejes vacío aparece entre [corchetes] para que lo completes en Canvas. Ideal: construye el acuerdo con tu grupo (pestaña «Acuerdo con el grupo») y publícalo el mismo día.
          </div>
          <MarkdownOutput markdown={acuerdoMd} />
          <Acciones id="acuerdo" titulo={`Acuerdo de dispositivos · ${materia || 'Materia'}`} md={acuerdoMd} herramienta="Acuerdo de dispositivos" />
        </>
      )}

      {tab === 'aviso' && (
        <>
          <div className="field">
            <div className="field-label">Se permite IA en</div>
            <textarea value={conIA} onChange={(e) => setConIA(e.target.value)} placeholder="Ej. Lluvia de ideas, revisión de redacción, práctica de ejercicios (siempre declarada)" style={{ minHeight: 60 }} />
          </div>
          <div className="field">
            <div className="field-label">No se permite IA en</div>
            <textarea value={sinIA} onChange={(e) => setSinIA(e.target.value)} placeholder="Ej. Evaluaciones en clase, ejercicios de escritura en vivo, examen final" style={{ minHeight: 60 }} />
          </div>
          <div className="row">
            <div className="field">
              <div className="field-label">Cómo citar</div>
              <input value={citar} onChange={(e) => setCitar(e.target.value)} placeholder="Ej. Formato APA, herramienta + fecha de consulta" />
            </div>
            <div className="field">
              <div className="field-label">
                Cómo la uso yo
                <HelpTip text="Los lineamientos piden que el docente declare su propio uso de IA y asegure la veracidad de sus materiales. Declararlo da el ejemplo." />
              </div>
              <input value={yoUso} onChange={(e) => setYoUso(e.target.value)} placeholder="Ej. Preparo ejemplos y reactivos; siempre los reviso" />
            </div>
          </div>
          <MarkdownOutput markdown={avisoMd} />
          <Acciones id="aviso" titulo={`Aviso de IA · ${materia || 'Materia'}`} md={avisoMd} herramienta="Aviso de IA" />
          <div className="why-box" style={{ marginTop: 14 }}>
            <b>Ojo:</b> los detectores de IA son una guía, no una prueba (y Turnitin detecta IA solo en inglés). Por eso el aviso pide declarar y explicar el trabajo, no vigilar.
          </div>
        </>
      )}

      {tab === 'grupo' && <AcuerdoGrupo onCopy={(md) => { copyToClipboard(aTextoPlano(md)); trackUso('Acuerdo del grupo', null, materia) }} onIrAcuerdo={() => setTab('acuerdo')} />}

      {tab === 'guia' && <GuiaRapida onCopy={(md) => { copyToClipboard(aTextoPlano(md)); trackUso('Guía tecnología con propósito') }} />}
    </div>
  )
}

// ============================================================
// Acuerdo con el grupo · guion de 10 minutos
// ============================================================
const GUION_MD = `## Guion de 10 minutos para construir el acuerdo con tu grupo

1. **Abre con una pregunta (2 min).** «¿Cuándo el celular les ayuda en clase y cuándo les quita algo?»
2. **Pide propuestas (4 min).** Que sugieran reglas para los momentos de atención plena y para los de uso con propósito.
3. **Anótalo en pantalla (3 min)**, en cuatro partes: cuándo, qué no, responsabilidades y qué pasa si no se cumple.
4. **Cierra (1 min).** «Lo publico hoy en Canvas.» Publícalo ese mismo día en Anuncios, junto con el Aviso de IA.

## Primera intervención y cuándo escalar

- **Si interfiere:** en privado y breve, con una pregunta que devuelve la responsabilidad. Por ejemplo: «¿Qué decisión necesitas tomar para volver a enfocarte?». No se retira el dispositivo ni se confronta por tenerlo.
- **Si se repite:** conversación reflexiva y un compromiso concreto.
- **Si persiste:** avisa a la mentora (figura de acompañamiento) con los detalles: frecuencia, afectación, incumplimientos previos, contexto y disposición del estudiante. El reporte lo hace la mentora por el mecanismo institucional.
- Si hay una razón de salud o familiar, el estudiante la avisa antes al docente y a la mentora.`

function AcuerdoGrupo({ onCopy, onIrAcuerdo }) {
  return (
    <>
      <MarkdownOutput markdown={GUION_MD} />
      <div className="btn-row">
        <button className="btn-primary" onClick={onIrAcuerdo}>
          <Icon.ArrowR size={13} /> Redactar el acuerdo
        </button>
        <button className="btn-secondary" onClick={() => onCopy(GUION_MD)}><Icon.Copy size={13} /> Copiar guion</button>
        <button className="btn-secondary" onClick={() => printContent('Guion · Acuerdo con el grupo', markdownToHtml(GUION_MD))}><Icon.Print size={13} /> PDF</button>
      </div>
    </>
  )
}

// ============================================================
// Guía rápida
// ============================================================
const GUIA_MD = `## Tecnología con propósito en tu clase

- **Antes:** acuerda con el grupo cuándo se usan dispositivos e IA y qué pasa si no se cumple. Publícalo en Canvas (Anuncios) con el Aviso de IA.
- **Dos preguntas:** ¿está interfiriendo con el aprendizaje? ¿se usó para otra conducta que pueda ser falta (privacidad, acoso, integridad académica)?
- **Si interfiere:** orienta breve y en privado con una pregunta.
- **Si se repite:** conversación reflexiva con compromiso; si persiste, escala a la mentora (figura de acompañamiento) con detalles.
- **Lo que no hacemos:** retener dispositivos, confrontar por su posesión, sancionar por cuenta propia o usar nuestro celular con fines personales en clase.
- **Con la IA:** declara tu uso, pide que declaren el suyo y contrasta lo entregado con lo que el estudiante puede explicar. Los detectores son una guía, no una prueba.
- **Audífonos y celular:** mismo criterio, impacto en el aprendizaje.

## Cuando un trabajo sale demasiado perfecto

Conversa, no acuses. Pide al estudiante que explique su trabajo en dos minutos, contrástalo con lo entregado y retroalimenta. Si hay indicios de falta de integridad académica, sigue el procedimiento institucional. Un detector puede servir de apoyo pero no decide.

## En cada fase de CLARA

- **Contextualizar:** acuerdo y Aviso de IA; declara si el dispositivo es herramienta o va guardado.
- **Llevar a la práctica:** marca qué momentos son de atención plena y cuáles con dispositivo o IA.
- **Activar el diálogo:** pares, debate y preguntas detonantes reducen los tiempos muertos y contrastan lo entregado con lo explicado.
- **Retroalimentar:** preguntas que devuelven la responsabilidad.
- **Anclar el propósito:** cierre reflexivo sobre cómo usé mi atención y la IA hoy.`

function GuiaRapida({ onCopy }) {
  return (
    <>
      <MarkdownOutput markdown={GUIA_MD} />
      <div className="btn-row">
        <button className="btn-secondary" onClick={() => onCopy(GUIA_MD)}><Icon.Copy size={13} /> Copiar</button>
        <button className="btn-secondary" onClick={() => printContent('Tecnología con propósito · Guía rápida', markdownToHtml(GUIA_MD))}><Icon.Print size={13} /> PDF</button>
      </div>
      <div className="field-hint" style={{ marginTop: 10 }}>
        Basada en el Decálogo y los Lineamientos para el uso ético de la IA, el comunicado «Tecnología con propósito» (2 oct 2026) y el Lineamiento de dispositivos (versión docentes). Propuesta de Gabriela Martínez Bello, desarrollada con Claude.
      </div>
    </>
  )
}
