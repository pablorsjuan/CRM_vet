import { apiRequest } from '@/services/api'

export async function getAppointmentAvailability(date, serviceType) {
  const params = new URLSearchParams({
    fecha: date,
    tipo_cita: serviceType
  })
  const professionals = await apiRequest(`/appointments/availability?${params}`)
  if (!Array.isArray(professionals)) {
    throw new Error('El servidor devolvió disponibilidad inválida.')
  }

  return professionals
}

export function getMyAppointments() {
  return apiRequest('/appointments/mine')
}

export function createAppointment(appointment) {
  return apiRequest('/appointments', {
    method: 'POST',
    body: appointment
  })
}

export function cancelAppointment(appointmentId) {
  return apiRequest(`/appointments/${appointmentId}/cancel`, {
    method: 'PATCH'
  })
}
