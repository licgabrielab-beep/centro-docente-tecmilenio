export function trackUso(herramienta, duracion) {
  try {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ herramienta, duracion }),
      keepalive: true
    }).catch(() => {})
  } catch (err) {
    // doble seguro
  }
}