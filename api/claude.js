// Vercel Serverless Function — /api/claude
// Recibe { prompt, system?, max_tokens?, model? }
// Retorna { text, usage, model } o { error, detail }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Usa POST.' });
  }

  const apiKey = process.env.ANTHROPIC_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'ANTHROPIC_KEY no está configurada en Vercel Environment Variables.',
    });
  }

  try {
    const {
      prompt,
      system,
      max_tokens = 2200,
      model = 'claude-haiku-4-5-20251001',
    } = req.body || {};

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Falta el campo "prompt" (string).' });
    }

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens,
        system: system || 'Eres un asistente pedagógico experto en el modelo CLARA de Universidad Tecmilenio. Respondes en español, con estructura clara y acciones concretas para docentes.',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      return res.status(anthropicRes.status).json({
        error: `Anthropic API devolvió ${anthropicRes.status}`,
        detail: errText.slice(0, 500),
      });
    }

    const data = await anthropicRes.json();
    const text = (data.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim();

    return res.status(200).json({
      text,
      usage: data.usage || null,
      model: data.model || model,
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Error interno al llamar a Claude.',
      detail: String(err?.message || err),
    });
  }
}
