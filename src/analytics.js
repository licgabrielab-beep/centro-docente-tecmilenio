export function trackUso(herramienta, duracion, materia) {
  try {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ herramienta, duracion, materia }),
      keepalive: true
    }).catch(() => {})
  } catch (err) {
    // doble seguro
  }
}
