<template>
  <section class="worker-appointments" aria-label="Agenda del profesional">
    <AppointmentsSidebar
      :appointments="visibleAppointments"
      :worker-mode="true"
      @add-appointment="isModalOpen = true"
    />
    <p v-if="loadError" class="worker-appointments__error" role="alert">
      {{ loadError }}
    </p>
    <p v-if="statusMessage" class="worker-appointments__status" role="status">
      {{ statusMessage }}
    </p>

    <AppointmentModal
      v-if="isModalOpen"
      :pets="pets"
      :worker-role="role"
      :error-message="loadError"
      :is-saving="isSavingAppointment"
      @close="isModalOpen = false"
      @submit="createAppointment"
    />
  </section>
</template>

<script>
import AppointmentModal from '@/components/AppointmentModal.vue'
import AppointmentsSidebar from '@/components/AppointmentsSidebar.vue'
import {
  createAppointment,
  getMyAppointments
} from '@/services/appointmentsApi'
import { hasAccessToken } from '@/services/api'

export default {
  name: 'WorkerAppointmentsPanel',
  components: {
    AppointmentModal,
    AppointmentsSidebar
  },
  props: {
    appointments: {
      type: Array,
      default: () => []
    },
    pets: {
      type: Array,
      default: () => []
    },
    role: {
      type: String,
      required: true,
      validator: (value) => ['vet', 'groomer', 'walker'].includes(value)
    }
  },
  emits: ['appointment-created'],
  data() {
    return {
      isModalOpen: false,
      loadedAppointments: [],
      loadError: '',
      statusMessage: '',
      isSavingAppointment: false
    }
  },
  created() {
    this.loadAppointments()
  },
  computed: {
    visibleAppointments() {
      const allAppointments = [...this.appointments, ...this.loadedAppointments]
      const uniqueAppointments = allAppointments.filter((appointment, index, list) => {
        const id = appointment.id_cita || appointment.id
        return !id || list.findIndex((item) => (
          String(item.id_cita || item.id) === String(id)
        )) === index
      })

      return uniqueAppointments.filter((appointment) => {
        const status = (appointment.estado || appointment.status || '').toLocaleLowerCase()
        return ![
          'cancelada',
          'cancelado',
          'completada',
          'completado',
          'realizada',
          'realizado'
        ].includes(status)
      })
    }
  },
  methods: {
    async loadAppointments() {
      this.loadError = ''
      try {
        const appointments = await getMyAppointments()
        if (!Array.isArray(appointments)) {
          throw new Error('El servidor devolvió una lista de citas inválida.')
        }
        this.loadedAppointments = appointments
      } catch (error) {
        this.loadError = error.message
        if (!hasAccessToken()) {
          this.$router.push('/login')
        }
      }
    },
    async createAppointment(appointment) {
      this.loadError = ''
      this.statusMessage = ''
      this.isSavingAppointment = true
      try {
        const createdAppointment = await createAppointment(appointment)
        this.loadedAppointments = [...this.loadedAppointments, createdAppointment]
        this.$emit('appointment-created', createdAppointment)
        this.statusMessage = 'Cita asignada correctamente.'
        this.isModalOpen = false
      } catch (error) {
        this.loadError = error.message
      } finally {
        this.isSavingAppointment = false
      }
    }
  }
}
</script>

<style scoped>
.worker-appointments {
  width: 100%;
}

.worker-appointments__error {
  color: var(--color-error);
}

.worker-appointments__status {
  color: var(--color-success);
}
</style>
