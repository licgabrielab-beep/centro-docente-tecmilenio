# Aula CLARA · Centro Docente Tecmilenio

App web con **8 herramientas** para docentes profesionales Tecmilenio basadas en el modelo CLARA oficial dentro del modelo educativo MAPS.

> Tu espacio para diseñar, dar y reflexionar la clase Tecmilenio.

**URL pública:** https://centro-docente-tecmilenio.vercel.app
**GitHub:** https://github.com/licgabrielab-beep/centro-docente-tecmilenio
**Versión:** 4.1.0 (beta)

---

## Cambios en v4.1 (refinamiento de calendario)

**Mi periodo · ahora con fecha de fin y semanas no lectivas.** Se identificó que el modelo MAPS pide 8 semanas pedagógicas inamovibles, pero el calendario real puede ser más largo si hay semana santa u otra pausa institucional. La nueva versión:

- Captura **fecha de inicio Y fecha de fin** del periodo (en lugar de calcular automáticamente 8 semanas).
- Permite **marcar semanas no lectivas** (semana santa, evaluaciones institucionales, etc.) con motivo personalizable.
- Calcula automáticamente: semanas calendario - semanas no lectivas = semanas pedagógicas.
- Muestra resumen en vivo: "9 semanas calendario - 1 no lectiva = 8 semanas pedagógicas ✓"
- Si el cálculo no da 8 semanas, el sistema avisa pero permite guardar (algunos casos pueden requerir ajuste).
- En el calendario visual, las semanas no lectivas aparecen en gris claro con su motivo.
- La numeración de semanas pedagógicas se salta automáticamente las semanas no lectivas.
- La semana de presentación final es siempre la última semana pedagógica.

**Ejemplo real (Mód. 2 actual):**
- Inicio: 16 de marzo · Fin: 15 de mayo = 9 semanas calendario.
- Semana 3 (30 mar - 5 abr) marcada como semana santa (no lectiva).
- Resultado: 8 semanas pedagógicas distribuidas correctamente.

---

## Cambios en v4.0 (changelog para los docentes)

**Renombre de la app:** TeacherHub → **Aula CLARA**.

**Nuevo módulo:** **Mi periodo** · configura tu calendario real de 8 semanas con feriados, semana del reto y semana 8 de presentación. El dashboard ahora muestra tu semana real con fechas concretas.

**Renombrada:** "Planeación CLARA" → **"Diseño de clase"**.

**Replanteada por completo:** "Reto Final" → **"Asistente de Reto Final"**. Ya no rediseña el reto (que viene de Canvas), genera el plan de acompañamiento al estudiante con cronograma, tutoriales sugeridos, recomendaciones por fase y plantillas de mensajes.

**Nuevo en Simplificador:** carga directa de archivos **DOCX, PDF y TXT**. El archivo se procesa en el navegador, no se sube a ningún servidor.

**Nuevo en Timer CLARA:** auto-registro de tiempos reales por fase + autoevaluación de 1 clic al cierre. Después de cada clase ves cuánto te alargaste/recortaste en cada fase.

**Reescrito el mini-curso:** ahora se llama **"El porqué de CLARA"**. Tono más reflexivo, lección 3 reescrita sobre feedback EN clase (no en Canvas), conexión real con el trabajo de propósito de vida de los estudiantes Tecmilenio.

**Mejoras visuales:** vista "Modelo CLARA" con 3 niveles de fondo diferenciados (verde oscuro / crema / verde claro) para que las secciones CLARA, REFEREENTE y Pilares no se sientan planas.

**Eliminada:** "Feedback individual" — duplicaba lo que Canvas Speed Grader ya hace.

**Eliminadas:** plantillas rápidas de materias en Diseño de clase y Asistente de Reto. Ahora se escribe materia y competencia directamente.

**Nuevo:** aviso discreto de "versión beta" con recomendación de descargar a Word/PDF las planeaciones importantes.

---

## Guía corta para subir esta versión a GitHub + Vercel

Esta vez es **mucho más simple** que la primera vez porque ya tienes el repo conectado y la variable de entorno bien configurada. Solo subes los archivos modificados sobre los actuales.

### Paso 1 · Descomprimir el ZIP

Descomprime `aula-clara-v4.zip` en tu computadora. Verás una carpeta llamada `aula-clara`.

### Paso 2 · Subir a GitHub

1. Entra a https://github.com/licgabrielab-beep/centro-docente-tecmilenio
2. Botón **"Add file" → "Upload files"**.
3. Arrastra **todo el contenido** de la carpeta `aula-clara` (no la carpeta en sí, sino lo que está adentro: `api/`, `src/`, `package.json`, `index.html`, etc.).
4. GitHub detectará automáticamente qué archivos cambiaron y cuáles son nuevos.
5. Hay archivos eliminados que también deberíamos quitar para mantener limpio el repo (FeedbackIndividual, PlaneacionCLARA, RetoFinal). Los puedes borrar manualmente después del upload, o ignorarlos (no rompen nada, simplemente quedan sin uso).
6. Mensaje de commit: `Aula CLARA v4 · update grande`
7. Click **"Commit changes"**.

### Paso 3 · Limpiar archivos viejos (opcional pero recomendado)

Después del upload, en GitHub borra estos archivos que ya no se usan:

- `src/tools/FeedbackIndividual.jsx`
- `src/tools/PlaneacionCLARA.jsx`
- `src/tools/RetoFinal.jsx`

Ve al archivo, click al ícono de bote de basura, commit. Repite para los 3.

### Paso 4 · Esperar a que Vercel redespliegue

Vercel detectará automáticamente el commit y arrancará un deploy. En **1-2 minutos** verás el deploy completarse en https://vercel.com/dashboard. URL no cambia: https://centro-docente-tecmilenio.vercel.app

### Paso 5 · Probar

Visita la URL. Deberías ver "Aula CLARA" en el sidebar y un módulo nuevo "Mi periodo" para configurar el calendario.

---

## Si algo falla

**El build falla con `npm install` o módulo no encontrado:**
Verifica que `package.json` se haya subido bien. Las dependencias nuevas en v4 son `mammoth` y `pdfjs-dist`.

**La app abre pero parece la versión vieja:**
Refresca con Ctrl+F5 (o Cmd+Shift+R en Mac) para limpiar caché.

**Las generaciones IA dan error:**
La variable `ANTHROPIC_KEY` debe seguir configurada en Vercel Settings → Environment Variables, aplicada a Production y Preview. Si la borraste por accidente, agrégala de nuevo y dale Redeploy.

---

## Estructura del proyecto

```
aula-clara/
├── api/
│   └── claude.js           ← Serverless function
├── src/
│   ├── App.jsx             ← Orquestador principal
│   ├── main.jsx
│   ├── index.css           ← Paleta Tecmilenio
│   ├── data.js             ← Mini-curso, prompts, banco, feriados
│   ├── storage.js          ← localStorage helpers
│   ├── export.js           ← Word, PDF + lectura DOCX/PDF/TXT
│   ├── components.jsx      ← Iconos, tooltip, callClaude
│   ├── tools/              ← 7 herramientas
│   │   ├── DisenoDeClase.jsx
│   │   ├── BancoActividades.jsx
│   │   ├── PromptsIA.jsx
│   │   ├── Simplificador.jsx
│   │   ├── TimerCLARA.jsx
│   │   ├── Mensajes.jsx
│   │   └── AsistenteReto.jsx
│   └── views/
│       ├── Dashboard.jsx
│       ├── MiPeriodo.jsx   ← NUEVO
│       ├── ModeloCLARA.jsx
│       ├── MiniCurso.jsx
│       └── Guardados.jsx
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
├── .gitignore
└── README.md
```

---

## Costo

Todas las llamadas IA usan `claude-haiku-4-5-20251001`. Cada generación cuesta centavos. Con $5 USD alcanzas para cientos de generaciones de docentes piloto.

---

## Backlog para fase 2 (no incluido en v4)

- **Cruce con certificación** ⭐ priorizado · para materias con doble currículum (Cisco, AWS, Scrum, Six Sigma, Google). Permite cargar el contenido del certificado externo + el contenido de Canvas y la IA hace una comparación semántica que clasifica los temas en: iguales (ahorra tiempo), similares con enfoque distinto (aclarar matices), únicos del certificado (profundizar extra), únicos de Canvas (no cubiertos por certificado). Salida con sugerencia de calendarización por semana pedagógica. Aplicable solo a materias marcadas como "con certificación" en Mi Periodo.
- Migrar a Supabase para soporte real de 50+ docentes con cuentas individuales
- "Mis materias" institucionales (catálogo central con certificaciones y temarios)
- Banner Generator para Canvas (imágenes de anuncios)
- Compartir planeaciones via link
- Biblioteca curada de tutoriales
- Etapa 2 del calendario (auto-reagendado al cancelar, comprimir contenido con IA)
- Modo institucional para líder docente (estadísticas agregadas anónimas)
