import { apiRequest } from '@/services/api'

export async function searchOwners(query, { signal } = {}) {
  const params = new URLSearchParams({ query })
  const owners = await apiRequest(`/users/search?${params}`, { signal })
  if (!Array.isArray(owners)) {
    throw new Error('La respuesta del servidor no tiene el formato esperado.')
  }

  return owners
}
