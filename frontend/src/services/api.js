const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000'
const AUTH_TOKEN_KEY = 'crm_vet_access_token'
const AUTH_ROLE_KEY = 'crm_vet_role'

export async function apiRequest(path, { method = 'GET', body, signal } = {}) {
  const headers = { Accept: 'application/json' }
  const accessToken = sessionStorage.getItem(AUTH_TOKEN_KEY)
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal
    })
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error
    }

    throw new Error('No fue posible conectar con el servidor. Intenta nuevamente.')
  }

  const responseText = await response.text()
  let result = null
  if (responseText) {
    try {
      result = JSON.parse(responseText)
    } catch {
      result = { message: responseText }
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      clearAccessToken()
    }

    const message = Array.isArray(result?.message)
      ? result.message.join(' ')
      : result?.message || 'La solicitud no pudo completarse.'
    throw new Error(message)
  }

  return result
}

export function saveAccessToken(token, role) {
  sessionStorage.setItem(AUTH_TOKEN_KEY, token)
  sessionStorage.setItem(AUTH_ROLE_KEY, role)
}

export function clearAccessToken() {
  sessionStorage.removeItem(AUTH_TOKEN_KEY)
  sessionStorage.removeItem(AUTH_ROLE_KEY)
}

export function hasAccessToken() {
  return Boolean(sessionStorage.getItem(AUTH_TOKEN_KEY))
}

export function getSessionRole() {
  return sessionStorage.getItem(AUTH_ROLE_KEY)
}
