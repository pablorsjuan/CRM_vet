<template>
  <section class="worker-appointments" aria-label="Agenda del profesional">
    <AppointmentsSidebar
      :appointments="visibleAppointments"
      :worker-mode="true"
      @add-appointment="isModalOpen = true"
    />

    <AppointmentModal
      v-if="isModalOpen"
      :pets="pets"
      :worker-role="role"
      @close="isModalOpen = false"
      @submit="createAppointment"
    />
  </section>
</template>

<script>
import AppointmentModal from '@/components/AppointmentModal.vue'
import AppointmentsSidebar from '@/components/AppointmentsSidebar.vue'

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
      createdAppointments: [],
      nextAppointmentId: 1
    }
  },
  computed: {
    visibleAppointments() {
      const baseAppointments = this.appointments.filter((appointment) => {
        const status = (appointment.estado || appointment.status || '').toLocaleLowerCase()
        return !['cancelada', 'cancelado', 'completada', 'completado', 'realizada', 'realizado']
          .includes(status)
      })
      const newAppointments = this.createdAppointments.filter((created) => (
        !this.appointments.some((appointment) => (
          String(appointment.id_cita || appointment.id || '')
            === String(created.id_cita)
        ))
      ))

      return [...baseAppointments, ...newAppointments]
    }
  },
  methods: {
    createAppointment(appointment) {
      const createdAppointment = {
        ...appointment,
        id_cita: `local-${Date.now()}-${this.nextAppointmentId}`,
        estado: 'Pendiente'
      }
      this.nextAppointmentId += 1
      this.createdAppointments.push(createdAppointment)
      this.$emit('appointment-created', createdAppointment)
      this.isModalOpen = false
    }
  }
}
</script>

<style scoped>
.worker-appointments {
  width: 100%;
}
</style>
