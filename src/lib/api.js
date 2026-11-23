function clientId() {
  try {
    let id = localStorage.getItem('shop.clientId')
    if (!id) { id = crypto.randomUUID(); localStorage.setItem('shop.clientId', id) }
    return id
  } catch { return 'anonymous-session' }
}

export async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch('/api' + path, {
    method,
    headers: { 'Content-Type': 'application/json', 'X-Client-Id': clientId() },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}
