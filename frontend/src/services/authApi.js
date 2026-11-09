import {
  apiRequest,
  clearAccessToken,
  saveAccessToken
} from '@/services/api'

const DASHBOARD_BY_ROLE = {
  dueno: '/user_dashboard',
  veterinario: '/vet_dashboard',
  peluquero: '/groomer_dashboard',
  paseador: '/walker_dashboard'
}

export async function registerUser(user) {
  return apiRequest('/auth/register', { method: 'POST', body: user })
}

export async function loginUser(credentials) {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: credentials
  })

  if (!response?.access_token || !response.user?.rol) {
    throw new Error('El servidor devolvió una respuesta de inicio de sesión inválida.')
  }

  if (!dashboardForRole(response.user.rol)) {
    throw new Error('Este tipo de cuenta no tiene un panel disponible.')
  }

  saveAccessToken(response.access_token, response.user.rol)
  return response.user
}

export function dashboardForRole(role) {
  return DASHBOARD_BY_ROLE[role] || null
}

export function logoutUser() {
  clearAccessToken()
}
