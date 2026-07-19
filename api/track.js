export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  try {
    await fetch(process.env.ANALYTICS_WEBHOOK_URL, {
      method: 'POST',
      body: JSON.stringify({
        herramienta: req.body?.herramienta || 'desconocida',
        duracion: req.body?.duracion || '',
        materia: req.body?.materia || ''
      })
    })
  } catch (err) {
    // Silencioso a propósito: si falla, la app sigue igual
  }
  res.status(200).json({ ok: true })
}
