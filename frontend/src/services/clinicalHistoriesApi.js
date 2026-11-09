import { apiRequest } from '@/services/api'

export async function createClinicalHistory(history) {
  return apiRequest('/clinical-histories', {
    method: 'POST',
    body: history
  })
}
