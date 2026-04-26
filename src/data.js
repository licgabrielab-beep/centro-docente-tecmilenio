// ============================================================
// MODELO CLARA OFICIAL TECMILENIO
// ============================================================

export const FASES_CLARA = [
  { key: 'C',  nombre: 'Contextualizar',       desc: 'Ofrecer un marco inicial para conectar con la realidad de los estudiantes.', pct: 15, min: 18, color: '#ffffff' },
  { key: 'L',  nombre: 'Llevar a la práctica', desc: 'Aplicar lo aprendido en ejemplos concretos.',                                 pct: 25, min: 30, color: '#c9ebd9' },
  { key: 'A1', nombre: 'Activar el diálogo',   desc: 'Interactuar continuamente con las y los estudiantes.',                        pct: 25, min: 30, color: '#9fd9c7' },
  { key: 'R',  nombre: 'Retroalimentar',       desc: 'Realizar comentarios que guíen el aprendizaje.',                              pct: 20, min: 24, color: '#5fb8a5' },
  { key: 'A2', nombre: 'Anclar el propósito',  desc: 'Conectar lo aprendido con el propósito de vida de los estudiantes.',          pct: 15, min: 18, color: '#2a8278' },
]

export const REFERENTE = [
  { letra: 'R', titulo: 'Responsable',   desc: 'Cumplo con compromiso cada clase, entrega y decisión formativa.' },
  { letra: 'E', titulo: 'Empático(a)',   desc: 'Conecto, escucho y acompaño a cada estudiante.' },
  { letra: 'F', titulo: 'Flexible',      desc: 'Me adapto a contextos diversos sin perder el rumbo académico.' },
  { letra: 'E', titulo: 'Exigente',      desc: 'Desafío a mis estudiantes para formar personas resilientes, autónomas y competentes.' },
  { letra: 'R', titulo: 'Reflexivo(a)',  desc: 'Ofrezco retroalimentación constante, honesta y empática.' },
  { letra: 'E', titulo: 'Excelente',     desc: 'Busco siempre la mejora y la calidad en cada experiencia educativa.' },
  { letra: 'N', titulo: 'Neutral',       desc: 'Facilito espacios de diálogo donde todas las voces se escuchan.' },
  { letra: 'T', titulo: 'Tech Savvy',    desc: 'Integro tecnologías e IA para enriquecer las experiencias de aprendizaje.' },
  { letra: 'E', titulo: 'Ético(a)',      desc: 'Actúo con integridad y formo desde el ejemplo.' },
]

export const PILARES = [
  { nombre: 'Calidad académica',
    puntos: [
      'Cultivamos la calidad en el aula mediante dominio disciplinar, habilidades pedagógicas y competencias técnicas y humanas.',
      'Facilitamos las clases con técnicas didácticas que promueven un aprendizaje activo.',
      'Impulsamos la formación integral como personas y profesionistas.',
    ] },
  { nombre: 'Exigencia académica',
    puntos: [
      'Establecemos altas expectativas y estrategias didácticas que promueven el máximo potencial del estudiante.',
      'Fortalecemos el aprendizaje con evaluaciones objetivas y acompañamiento constante.',
      'Fomentamos autonomía, resiliencia y responsabilidad como parte esencial del proceso formativo.',
    ] },
  { nombre: 'Integridad académica',
    puntos: [
      'Fomentamos una cultura ética: cada acción y decisión se alinea con honestidad, respeto y compromiso.',
      'Formamos personas íntegras, conscientes de su impacto en la sociedad y su entorno profesional.',
    ] },
]

// ============================================================
// BANCO DE 30 ACTIVIDADES (sin cambios respecto a v3)
// ============================================================

export const BANCO_ACTIVIDADES = [
  { id: 1,  nombre: 'Pregunta detonadora personal',       fase: 'Contextualizar',       duracion: 5,  formato: 'Presencial', noLector: true,  descripcion: 'El docente abre con "¿Alguna vez te has encontrado con...?" conectando el tema a una experiencia cotidiana del estudiante.' },
  { id: 2,  nombre: 'Caso breve de la vida real',         fase: 'Contextualizar',       duracion: 10, formato: 'Híbrido',    noLector: false, descripcion: 'Leer un caso de 1 párrafo y responder en pareja "¿qué harías tú en esa situación?".' },
  { id: 3,  nombre: 'Nube de palabras en Mentimeter',     fase: 'Contextualizar',       duracion: 10, formato: 'Híbrido',    noLector: true,  descripcion: 'Pregunta detonadora en pantalla; cada estudiante responde desde su celular en 1-3 palabras y se visualiza en vivo.' },
  { id: 4,  nombre: 'Video disparador de 2-3 min',        fase: 'Contextualizar',       duracion: 10, formato: 'Híbrido',    noLector: true,  descripcion: 'Ver clip breve cotidiano relacionado al tema + 1 pregunta en voz alta al grupo.' },
  { id: 5,  nombre: 'Imagen o meme detonador',            fase: 'Contextualizar',       duracion: 5,  formato: 'Presencial', noLector: true,  descripcion: 'Mostrar una imagen provocadora y preguntar "¿qué ves? ¿qué opinas?" sin lectura previa.' },
  { id: 6,  nombre: 'Noticia de hoy',                     fase: 'Contextualizar',       duracion: 10, formato: 'Online',     noLector: false, descripcion: 'Llevar un titular reciente del tema y discutir 5 min su conexión con la materia.' },
  { id: 7,  nombre: 'Anécdota del docente',               fase: 'Contextualizar',       duracion: 10, formato: 'Presencial', noLector: true,  descripcion: 'Compartir una historia personal (o profesional) breve + pregunta abierta al grupo.' },
  { id: 8,  nombre: 'I do · We do · You do',              fase: 'Llevar a la práctica', duracion: 30, formato: 'Presencial', noLector: false, descripcion: 'Docente resuelve 1 ejemplo, el grupo resuelve 1 junto, cada estudiante resuelve 1 solo.' },
  { id: 9,  nombre: 'Simulación profesional',             fase: 'Llevar a la práctica', duracion: 40, formato: 'Presencial', noLector: true,  descripcion: 'Role-play de un escenario real del sector con roles asignados; el estudiante aplica el concepto en acción.' },
  { id: 10, nombre: 'Caso real con rúbrica corta',        fase: 'Llevar a la práctica', duracion: 25, formato: 'Híbrido',    noLector: false, descripcion: 'Resolver un caso en equipo de 3 usando rúbrica simple de 3 criterios.' },
  { id: 11, nombre: 'Ejercicio cronometrado',             fase: 'Llevar a la práctica', duracion: 15, formato: 'Presencial', noLector: false, descripcion: '5 min para resolver individual + 10 min revisar en pareja con corrección cruzada.' },
  { id: 12, nombre: 'Laboratorio express',                fase: 'Llevar a la práctica', duracion: 30, formato: 'Presencial', noLector: true,  descripcion: 'Experimento o prototipo simple con materiales básicos; "hacer" antes de "explicar".' },
  { id: 13, nombre: 'Análisis de documento auténtico',    fase: 'Llevar a la práctica', duracion: 25, formato: 'Híbrido',    noLector: false, descripcion: 'Contrato real, artículo, reporte o estado de cuenta; responder 3 preguntas guía.' },
  { id: 14, nombre: 'Mini-producto personal',             fase: 'Llevar a la práctica', duracion: 20, formato: 'Online',     noLector: true,  descripcion: 'Crear post, audio de 1 min o infografía que demuestre el concepto; ideal para no-lectores.' },
  { id: 15, nombre: 'Transferencia al contexto propio',   fase: 'Llevar a la práctica', duracion: 15, formato: 'Híbrido',    noLector: false, descripcion: 'Aplicar el concepto a la propia carrera, trabajo o interés del estudiante en un ejemplo concreto.' },
  { id: 16, nombre: 'Think · Pair · Share',               fase: 'Activar el diálogo',   duracion: 10, formato: 'Presencial', noLector: true,  descripcion: 'Pensar 1 min en silencio, dialogar 2 min en pareja, 1 pareja comparte al grupo.' },
  { id: 17, nombre: 'Debate estructurado',                fase: 'Activar el diálogo',   duracion: 30, formato: 'Presencial', noLector: false, descripcion: 'Dos equipos defienden posturas opuestas con evidencia; moderador rota cada 5 min.' },
  { id: 18, nombre: 'Seminario socrático',                fase: 'Activar el diálogo',   duracion: 25, formato: 'Presencial', noLector: false, descripcion: 'Círculo con preguntas guía del docente; nadie levanta la mano, todos participan.' },
  { id: 19, nombre: 'Jamboard/Miro colaborativo',         fase: 'Activar el diálogo',   duracion: 20, formato: 'Híbrido',    noLector: true,  descripcion: 'Lluvia de ideas en pizarrón digital; post-its con dibujos o frases cortas permitidas.' },
  { id: 20, nombre: 'Tarjetas de colores',                fase: 'Activar el diálogo',   duracion: 10, formato: 'Presencial', noLector: true,  descripcion: 'Verde = acuerdo · Amarillo = duda · Rojo = desacuerdo. El docente lanza afirmaciones y ve reacciones.' },
  { id: 21, nombre: 'Jigsaw (expertos)',                  fase: 'Activar el diálogo',   duracion: 35, formato: 'Presencial', noLector: false, descripcion: 'Cada miembro del equipo aprende un sub-tema y luego lo enseña al resto como experto.' },
  { id: 22, nombre: 'Fishbowl (pecera)',                  fase: 'Activar el diálogo',   duracion: 25, formato: 'Presencial', noLector: false, descripcion: '4 estudiantes debaten al centro; el resto observa y luego rotan y aportan.' },
  { id: 23, nombre: 'Feedback 3 · 2 · 1',                 fase: 'Retroalimentar',       duracion: 10, formato: 'Híbrido',    noLector: false, descripcion: 'Sobre cada entregable: 3 fortalezas · 2 áreas de mejora · 1 pregunta para el autor.' },
  { id: 24, nombre: 'Coevaluación con rúbrica simple',    fase: 'Retroalimentar',       duracion: 15, formato: 'Híbrido',    noLector: false, descripcion: 'Pares evalúan con rúbrica de 3 criterios y dan 1 comentario específico cada uno.' },
  { id: 25, nombre: 'Semáforo de comprensión',            fase: 'Retroalimentar',       duracion: 5,  formato: 'Presencial', noLector: true,  descripcion: 'Cada estudiante levanta tarjeta verde/amarillo/rojo según qué tan claro tiene el tema.' },
  { id: 26, nombre: 'Ticket de salida',                   fase: 'Retroalimentar',       duracion: 10, formato: 'Presencial', noLector: false, descripcion: '2 preguntas escritas al cierre: ¿qué aprendí? ¿qué me confundió? Se responden al inicio de la siguiente clase.' },
  { id: 27, nombre: 'Audio-feedback por WhatsApp',        fase: 'Retroalimentar',       duracion: 15, formato: 'Online',     noLector: true,  descripcion: 'El docente graba audio de 1 min personalizado por estudiante; cercano y accionable.' },
  { id: 28, nombre: '¿Cómo usarás esto?',                 fase: 'Anclar el propósito',  duracion: 10, formato: 'Híbrido',    noLector: true,  descripcion: 'Cada estudiante responde en 1 frase cómo aplicará este aprendizaje en su vida o carrera.' },
  { id: 29, nombre: 'Carta al yo del futuro',             fase: 'Anclar el propósito',  duracion: 15, formato: 'Online',     noLector: false, descripcion: 'Escribir carta breve al yo de 3 años en el futuro conectando el aprendizaje con una meta personal.' },
  { id: 30, nombre: 'Pitch de impacto',                   fase: 'Anclar el propósito',  duracion: 10, formato: 'Presencial', noLector: true,  descripcion: 'Presentar en 60 segundos cómo este aprendizaje modifica o fortalece su ruta profesional.' },
]

// ============================================================
// PROMPTS PARA IA (sin cambios)
// ============================================================

export const PROMPTS_IA = [
  {
    titulo: '1. Abrir clase · fase Contextualizar',
    uso: 'Para diseñar los primeros 18 min de la sesión (15% del tiempo) con un marco que conecte al estudiante.',
    prompt: `Actúa como docente Tecmilenio siguiendo el modelo CLARA. Diseña 3 opciones distintas para CONTEXTUALIZAR el tema [TEMA] durante 15 minutos al inicio de clase. Cada opción debe: conectar con la realidad cotidiana del estudiante, no requerir lectura larga, generar curiosidad. Formato: lista numerada, cada opción con título + pasos + recurso necesario.`,
  },
  {
    titulo: '2. Explicación simple de un tema',
    uso: 'Para traducir un concepto a lenguaje accesible antes de la fase Llevar a la práctica.',
    prompt: `Actúa como docente Tecmilenio. Explica el tema [TEMA] para estudiantes de nivel profesional. Usa lenguaje simple, 2 ejemplos cotidianos y 1 analogía. Máximo 200 palabras. Cierra con una pregunta que active el diálogo con el grupo.`,
  },
  {
    titulo: '3. Resumen para estudiantes no-lectores',
    uso: 'Para adaptar un texto largo a estudiantes con baja comprensión lectora.',
    prompt: `Resume el siguiente texto en 5 viñetas cortas (máx 15 palabras cada una) con lenguaje simple. Si hay términos técnicos, defínelos entre paréntesis. Al final, sugiere 1 recurso visual o auditivo que complemente. Texto: [PEGAR TEXTO].`,
  },
  {
    titulo: '4. Diseñar actividad para Llevar a la práctica',
    uso: 'Fase L: aplicar lo aprendido en ejemplos concretos (parte del 50% central de la clase).',
    prompt: `Diseña una actividad práctica de 30 min para un grupo de 25 estudiantes de Tecmilenio que apliquen [CONCEPTO]. Entrega: objetivo, pasos, roles por equipo, material necesario y entregable concreto. La actividad debe permitir transferir el concepto al contexto real del estudiante. Competencia evaluada: [COMPETENCIA].`,
  },
  {
    titulo: '5. Crear rúbrica de evaluación',
    uso: 'Para evaluar entregables con criterios observables y alineados a competencia.',
    prompt: `Crea una rúbrica de evaluación para [ENTREGABLE] alineada a los 3 pilares Tecmilenio (calidad, exigencia e integridad académica). Usa 4 criterios y 4 niveles (Excelente, Bueno, Suficiente, Insuficiente). Describe cada nivel con conductas observables. Competencia evaluada: [COMPETENCIA]. Formato: tabla markdown.`,
  },
  {
    titulo: '6. Retroalimentación oral en clase',
    uso: 'Para preparar feedback que darás en vivo durante la fase Retroalimentar (no para Canvas).',
    prompt: `Diseña 5 frases breves de retroalimentación oral que pueda usar en clase para responder a una participación de estudiante en el tema [TEMA]. Cada frase debe: empezar reconociendo algo concreto, sugerir un siguiente paso, mantener tono cercano y respetuoso. Formato: lista con la situación + la frase exacta.`,
  },
  {
    titulo: '7. Preguntas tipo competencia',
    uso: 'Para evaluar aplicación y criterio, no memorización.',
    prompt: `Diseña 3 preguntas tipo competencia sobre [TEMA]. Cada pregunta debe: plantear una situación real, requerir aplicar el conocimiento, permitir más de una ruta de solución. Nivel: profesional. Incluye criterios de éxito al final de cada pregunta.`,
  },
  {
    titulo: '8. Cerrar clase · Anclar el propósito',
    uso: 'Para los últimos 18 min (15%): conectar el aprendizaje con el propósito de vida.',
    prompt: `Propone 3 opciones de cierre de clase (10-15 min) que ANCLEN EL PROPÓSITO del tema [TEMA] al proyecto de vida del estudiante Tecmilenio. Cada opción debe llevar al estudiante a responder: ¿cómo usaré esto? ¿qué cambia en mí con este aprendizaje? Formato: título + pasos + entregable concreto.`,
  },
]

// ============================================================
// MINI-CURSO · "EL PORQUÉ DE CLARA" (reescrito en tono reflexivo)
// ============================================================

export const MINI_CURSO = [
  {
    id: 1,
    titulo: '¿Por qué CLARA?',
    duracion: '3 min',
    contenido: `
# ¿Por qué CLARA?

Antes de aprender el modelo, vale la pena detenerse a pensar **por qué existe**.

Tecmilenio no eligió un modelo pedagógico al azar. CLARA responde a una observación concreta del aula contemporánea: las clases magistrales tradicionales **dejan al estudiante como espectador**, y un espectador rara vez transforma su pensamiento.

## Las 5 fases en una clase de 120 minutos

- **C · Contextualizar (15% · 18 min).** Conectas el tema con la realidad del estudiante antes de explicar nada. Una historia, una pregunta, un video corto.
- **L · Llevar a la práctica (25% · 30 min).** Aplican lo aprendido en ejemplos concretos. No explicas más, ellos hacen.
- **A · Activar el diálogo (25% · 30 min).** Interactúan continuamente. Preguntas, parejas, debate. El monólogo se rompe.
- **R · Retroalimentar (20% · 24 min).** Comentas para guiar el aprendizaje en el momento, no solo al final.
- **A · Anclar el propósito (15% · 18 min).** Conectas lo aprendido con el propósito de vida del estudiante.

## Lo que vale la pena observar

Las dos fases del centro — **Llevar a la práctica + Activar el diálogo** — suman el 50% del tiempo. Son la parte donde el estudiante deja de escuchar y empieza a construir. Ese 50% no es un número arbitrario: es el corazón del modelo.

Si tu clase típica suele ser 70% explicación tuya y 30% ejercicios, **CLARA te invita a darle la vuelta**. No para hablar menos, sino para que tu expertise llegue de otra forma.

## Una pausa para reflexionar

¿En cuál de las 5 fases te sientes más cómodo? ¿En cuál te cuesta más? La honestidad de esa respuesta es el primer paso para integrar CLARA a tu manera.
    `,
  },
  {
    id: 2,
    titulo: 'Contextualizar bien (fase C)',
    duracion: '4 min',
    contenido: `
# Contextualizar bien · primeros 18 minutos

Es la fase más subestimada de CLARA. Muchos docentes abren con "hoy veremos el tema X" y entran directo al contenido. Eso **apaga al estudiante** antes de que la clase empiece.

## ¿Qué busca esta fase?

Que el estudiante quiera saber qué viene después. Que el tema deje de ser "algo que el plan de estudios marca" y se vuelva "algo que tiene que ver conmigo".

## Algunas formas de hacerlo bien

- Empezar con una **pregunta directa a su vida**: "¿Alguna vez han tenido que convencer a alguien de algo y fallaron?" para un tema de argumentación.
- Una **historia real de 90 segundos**: tuya, de un exestudiante, de un caso noticioso.
- Mostrar **una imagen provocadora** sin explicarla todavía. Que el grupo opine primero.
- Validar respuestas sin juzgar. Si responden algo "erróneo", no corrijas en ese momento. Di "interesante, lo retomamos" y avanza.

## Lo que no funciona tanto

- Leer en voz alta el objetivo de la sesión que tienes proyectado.
- Repasar la clase anterior por 15 minutos.
- Empezar con la definición formal del tema antes de que haya curiosidad.

## Un ejemplo cercano

**Tema:** "Flujo de efectivo para emprendedores."

**Apertura común:** "Buenos días. Hoy veremos el flujo de efectivo. Primero definamos qué es."

**Apertura CLARA:** "Levanten la mano los que han pedido prestado a un familiar. ¿Por qué? ¿Qué no habían calculado?" — deja 3 minutos de conversación — "Eso se llama flujo de efectivo. Hoy van a aprender a verlo venir."

## Para reflexionar

¿Cómo abres tú típicamente una clase? Si tu apertura no genera curiosidad ni conexión personal en los primeros 5 minutos, vale la pena experimentar.
    `,
  },
  {
    id: 3,
    titulo: 'Retroalimentar dentro de clase (fase R)',
    duracion: '5 min',
    contenido: `
# Retroalimentar dentro de clase · fase R

La retroalimentación que importa **no es la que escribes en Canvas después**. Esa también cuenta, claro. Pero la que **transforma aprendizaje en tiempo real** es la que ofreces durante la clase, cuando el estudiante todavía puede ajustar su pensamiento.

## Un cambio de enfoque

Como docente profesional eres bueno detectando errores. Pero corregir en vivo sin frenar el ritmo del grupo es una habilidad distinta. Esta lección no es sobre cómo calificar bien — es sobre cómo retroalimentar mientras la clase sigue su curso.

## La regla de los 3 movimientos · adaptada al aula en vivo

Cuando un estudiante participa o entrega algo en clase, en lugar de solo decir "bien" o "no es así", intenta esto en orden:

1. **Reconoce algo específico** que dijo bien. *"Tu argumento sobre el costo de oportunidad es correcto."*
2. **Señala una sola cosa que ajustaría.** La más importante. *"Lo que valdría la pena revisar es el supuesto de demanda constante."*
3. **Da una pregunta o pista** para que él mismo encuentre el camino. *"¿Qué pasaría con tu modelo si la demanda cambia mes a mes?"*

Lo poderoso: el estudiante **piensa por sí mismo en vez de copiar tu corrección**. Y los demás aprenden mirándolo.

## El semáforo de comprensión

Una técnica que viene del banco de actividades. Mientras explicas algo nuevo, los estudiantes muestran:

- **Verde** · entiendo, sigue.
- **Amarillo** · tengo dudas pero puedo seguir.
- **Rojo** · necesito que regreses.

Nadie levanta la mano. Todos muestran al mismo tiempo (con tarjetas, con dedos, en una herramienta digital). Te da una lectura instantánea del grupo. Si ves muchos amarillos o rojos, sabes exactamente cuándo pausar.

## El feedback entre pares

A veces la mejor retroalimentación no viene de ti. Viene de otro estudiante. Cuando alguien presenta un trabajo o una idea, en lugar de evaluarla tú primero, pide al grupo:

> "¿Qué fortaleza ven en lo que acaba de presentar? ¿Qué le agregarían?"

Tres beneficios: el grupo se involucra, el presentador recibe feedback variado, y tú detectas qué tan bien internalizaron el tema observando cómo se evalúan entre sí.

## Para reflexionar

La pregunta no es "¿doy buen feedback?" sino **"¿mi feedback ayuda al estudiante a pensar mejor o solo lo corrige?"** El primero forma. El segundo solo informa.
    `,
  },
  {
    id: 4,
    titulo: 'Evaluar por competencia',
    duracion: '6 min',
    contenido: `
# Evaluar por competencia

El modelo MAPS evalúa **competencias**, no memorización. Esta es probablemente la diferencia más importante entre enseñar contenido y formar profesionistas.

## Una distinción clara

Una competencia es lo que el estudiante **será capaz de HACER** al final del curso. No lo que sabrá, sino lo que podrá ejecutar en una situación real.

**No es competencia:** "Conoce los tipos de estructuras organizacionales."

**Sí es competencia:** "Diseña la estructura organizacional adecuada para una empresa nueva dado su modelo de negocio."

La diferencia está en el verbo y en la situación.

## Los verbos cuentan

Los verbos de competencia son **de acción**: diseña, propone, resuelve, aplica, argumenta, construye, evalúa.

Los verbos de memorización son **pasivos**: conoce, identifica, comprende, recuerda.

Cuando escribas la competencia de tu clase o de tu reto, lee el verbo que usaste. Si es pasivo, probablemente sigue siendo memorización con otro nombre.

## Cómo evaluar lo que sí importa

No evalúes con examen de opción múltiple un curso que busca formar profesionistas. Evalúa con **entregables auténticos**:

- Un reporte que una empresa real podría usar.
- Una propuesta presentable en un pitch real.
- Un prototipo que resuelve un problema concreto.
- Un análisis que un consultor cobraría por entregar.

Si lo que pides al estudiante no se parece a algo que un profesional haría, probablemente estás evaluando contenido y no competencia.

## La rúbrica como herramienta de honestidad

Por cada competencia, 4 criterios × 4 niveles (Excelente, Bueno, Suficiente, Insuficiente). Cada celda describe una **conducta observable**, no un juicio.

**Criterio débil:** "El estudiante muestra buen trabajo."

**Criterio competente:** "El estudiante presenta 3 alternativas de solución y justifica la elección con al menos 2 datos del sector."

La rúbrica es honesta cuando dos docentes distintos, leyendo la misma rúbrica y el mismo trabajo, llegarían a calificaciones parecidas.

## Para reflexionar

¿Tu última evaluación midió competencia o memoria? Si fue memoria, ¿qué cambiaría si el examen fuera reemplazado por un entregable que un profesional haría?
    `,
  },
  {
    id: 5,
    titulo: 'Anclar el propósito (fase A)',
    duracion: '4 min',
    contenido: `
# Anclar el propósito · últimos 18 minutos

Esta es la fase más fácil de saltar cuando se acaba el tiempo. Por eso es la que más vale la pena defender.

## Algo importante que vale la pena saber

Tus estudiantes escriben su propósito de vida durante su trayectoria en Tecmilenio. No es un ejercicio aislado de un solo curso: es un trabajo institucional que recorre toda su formación.

La fase Anclar el propósito **no es algo aparte** de ese trabajo institucional. Es donde tú, como docente, **conectas tu materia con esa búsqueda mayor que ya están haciendo**. Cada vez que cierras una clase con "¿cómo usarás esto en tu propósito?", estás reforzando lo que toda la institución busca.

Eso cambia el sentido de la fase. No es un cierre por cumplir. Es un puente con su proyecto de vida.

## Tres formas concretas de hacerlo

### Pregunta directa al cierre · 5 a 10 min

> "Antes de irnos: en una frase, ¿cómo vas a usar esto el próximo mes?"

Pasa el micrófono a 4 o 5 estudiantes. Los demás escuchan. Es simple y poderoso.

### Micro-compromiso escrito · 10 min

> "Saquen una hoja. Escriban: 'el próximo lunes voy a aplicar este aprendizaje en ___'. Firmen y entreguen. Se las devuelvo en dos semanas."

Ese papel es poderoso. El estudiante se compromete consigo mismo. Cuando se lo regresas, recuerda lo que escribió.

### Pitch de 60 segundos · 10 a 15 min

> "En equipos de 3, preparen un pitch de 60 segundos: cómo este tema cambia la manera en que verán su carrera. Dos equipos presentan."

Conecta el tema con la identidad profesional en construcción.

## La diferencia que se siente

**Sin Anclar el propósito:** "Ya vimos el tema, nos vemos el jueves."

**Con Anclar el propósito:** "¿Notaron algo? El 70% de ustedes dijo que usará esto en contextos distintos. Eso es lo que Tecmilenio busca: que salgan con herramientas que **ustedes** elijan cómo aplicar."

## Para reflexionar

Cuando termines tu próxima clase, pregúntate: ¿cerré conectando el contenido con algo más grande que el tema mismo? Si no, hay 18 minutos que pueden cambiar la forma en que el estudiante recuerda esa clase.
    `,
  },
]

// ============================================================
// TIPS PEDAGÓGICOS DIARIOS (sin cambios)
// ============================================================

export const TIPS_DIARIOS = [
  { kicker: 'Administra el tiempo', msg: 'Si tus estudiantes pierden atención en la segunda mitad, revisa si la fase <b>Activar el diálogo</b> está llegando tarde. Debe intercalarse con Llevar a la práctica desde el minuto 20, no dejarse para el final.' },
  { kicker: 'No saltes el cierre', msg: '<b>Anclar el propósito</b> son solo 18 min pero es la fase que más impacto deja. Terminar con una pregunta sobre cómo usarán el tema en su carrera genera más retención que cualquier examen.' },
  { kicker: 'Feedback que mueve', msg: 'Cuando des retroalimentación, <b>empieza siempre por una fortaleza específica</b>. No genérica ("buen trabajo") sino concreta ("tu argumento en la página 2 está bien sustentado").' },
  { kicker: 'Contextualizar en 3 min', msg: 'Si no tienes mucho tiempo de preparar, abre la clase con <b>una sola pregunta directa a su vida</b>. Ej: "¿Quién ha tenido que convencer a alguien de algo y fracasó?" Contextualizar no necesita materiales.' },
  { kicker: 'Evalúa con producto', msg: 'Reemplaza un examen por un <b>entregable auténtico</b>: algo que un profesional real cobraría por hacer. Mide competencia, no memoria. Tus estudiantes lo agradecerán en el reto final.' },
  { kicker: 'Los no-lectores también aprenden', msg: 'Si un estudiante no lee, <b>no bajes expectativas, cambia el canal</b>. Reemplaza el texto por audio, video, infografía. La competencia se puede demostrar sin leer.' },
  { kicker: 'Diálogo > monólogo', msg: 'Regla simple: <b>nadie debe pasar 8 min escuchándote sin intervenir</b>. Si te pasas, haz una pausa activa: una pregunta rápida, un Think-Pair-Share de 3 min, una votación con la mano.' },
  { kicker: 'El pilar Integridad', msg: 'Cuando uses IA con tus estudiantes, <b>modela el uso ético</b>: enséñales a declarar cuándo usaron IA y cómo verificaron lo que produjo. La IA sin verificación destruye la integridad académica.' },
]

// ============================================================
// FERIADOS MÉXICO (oficiales pre-cargados para "Mi periodo")
// Solo los más relevantes para periodos académicos
// ============================================================

export const FERIADOS_MX = [
  // Fechas fijas
  { fecha: '01-01', nombre: 'Año Nuevo' },
  { fecha: '02-05', nombre: 'Día de la Constitución' }, // se mueve a primer lunes de feb pero damos opción
  { fecha: '03-21', nombre: 'Natalicio Benito Juárez' }, // se mueve a tercer lunes de mar
  { fecha: '05-01', nombre: 'Día del Trabajo' },
  { fecha: '05-05', nombre: 'Batalla de Puebla' },
  { fecha: '09-16', nombre: 'Independencia de México' },
  { fecha: '11-02', nombre: 'Día de Muertos' },
  { fecha: '11-20', nombre: 'Día de la Revolución' }, // se mueve a tercer lunes de nov
  { fecha: '12-12', nombre: 'Día de la Virgen de Guadalupe' },
  { fecha: '12-25', nombre: 'Navidad' },
]
