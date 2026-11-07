const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000'

export async function searchOwners(query, { signal } = {}) {
  const params = new URLSearchParams({ query })
  const response = await fetch(`${API_BASE_URL}/users/search?${params}`, { signal })

  if (!response.ok) {
    throw new Error('No fue posible consultar los usuarios. Intenta nuevamente.')
  }

  const owners = await response.json()
  if (!Array.isArray(owners)) {
    throw new Error('La respuesta del servidor no tiene el formato esperado.')
  }

  return owners
}
