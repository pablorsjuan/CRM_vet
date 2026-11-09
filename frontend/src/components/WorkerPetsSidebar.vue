<template>
  <section class="worker-pets" aria-labelledby="worker-pets-title">
    <header class="worker-pets__header">
      <h1 id="worker-pets-title">{{ manualCare ? 'Atender cita' : 'Mascotas' }}</h1>
    </header>

    <p v-if="!manualCare && pets.length === 0" class="worker-pets__empty">
      No hay mascotas asignadas.
    </p>

    <ul v-if="!manualCare && pets.length" class="worker-pets__list">
      <li v-for="(pet, index) in pets" :key="pet.id_mascota || index">
        <PetCard
          :pet="pet"
          :worker-mode="true"
          @worker-action="beginCare"
        />
      </li>
    </ul>

    <section
      v-if="selectedPet || manualCare"
      class="worker-pets__care"
      aria-labelledby="worker-pets-care-title"
    >
      <h2 id="worker-pets-care-title">
        {{ careTitle }}: {{ careDetails.nombre_mascota || 'Nueva atención' }}
      </h2>
      <p v-if="!manualCare && relatedAppointments.length" class="worker-pets__appointments">
        Citas relacionadas:
        {{ relatedAppointments.map((appointment) => appointment.fecha || 'Sin fecha').join(', ') }}
      </p>
      <p v-else-if="!manualCare" class="worker-pets__appointments">
        No hay una cita asociada a esta mascota en los datos recibidos.
      </p>

      <form
        v-if="!hasSubmitted"
        class="worker-pets__form"
        @submit.prevent="submitCare"
      >
        <label>
          Nombre de la mascota
          <input
            v-model.trim="careDetails.nombre_mascota"
            autocomplete="off"
            maxlength="100"
            required
          >
        </label>
        <label>
          Nombre del dueño
          <input
            v-model.trim="careDetails.nombre_usuario"
            autocomplete="name"
            maxlength="100"
            required
          >
        </label>

        <template v-if="role === 'vet'">
          <label>
            Motivo de consulta
            <input v-model.trim="careDetails.motivo_consulta" required maxlength="250">
          </label>
          <label>
            Diagnóstico
            <textarea v-model.trim="careDetails.diagnostico" required rows="3" />
          </label>
          <label>
            Tratamiento
            <textarea v-model.trim="careDetails.tratamiento" required rows="3" />
          </label>
          <button class="worker-pets__submit" type="submit">Guardar historia clínica</button>
        </template>

        <template v-else-if="role === 'groomer'">
          <label>
            Resultado de peluquería
            <textarea
              v-model.trim="careDetails.resultado"
              placeholder="Describe el servicio realizado y sus observaciones."
              required
              rows="4"
            />
          </label>
          <p class="worker-pets__note">
            El registro de imágenes no está disponible en esta versión.
          </p>
          <button class="worker-pets__submit" type="submit">Registrar resultado</button>
        </template>

        <template v-else>
          <p>Confirma cuando hayas terminado el paseo de esta mascota.</p>
          <button class="worker-pets__submit" type="submit">
            Marcar paseo como realizado
          </button>
        </template>
      </form>

      <button class="worker-pets__cancel" type="button" @click="cancelCare">
        Cerrar
      </button>
      <p v-if="statusMessage" class="worker-pets__status" role="status">
        {{ statusMessage }}
      </p>
    </section>
  </section>
</template>

<script>
import PetCard from '@/components/PetCard.vue'

export default {
  name: 'WorkerPetsSidebar',
  components: {
    PetCard
  },
  props: {
    pets: {
      type: Array,
      default: () => []
    },
    appointments: {
      type: Array,
      default: () => []
    },
    role: {
      type: String,
      required: true,
      validator: (value) => ['vet', 'groomer', 'walker'].includes(value)
    },
    manualCare: {
      type: Boolean,
      default: false
    }
  },
  emits: ['clinical-history-created', 'grooming-result-recorded', 'walk-completed'],
  data() {
    return {
      selectedPet: null,
      careDetails: this.emptyCareDetails(),
      statusMessage: '',
      hasSubmitted: false
    }
  },
  computed: {
    careTitle() {
      return {
        vet: 'Historia clínica',
        groomer: 'Resultado de peluquería',
        walker: 'Finalizar paseo'
      }[this.role]
    },
    relatedAppointments() {
      if (!this.selectedPet) {
        return []
      }

      return this.appointments.filter((appointment) => (
        (appointment.id_mascota && this.selectedPet.id_mascota
          && String(appointment.id_mascota) === String(this.selectedPet.id_mascota))
        || (appointment.nombre_mascota
          && appointment.nombre_mascota === this.selectedPet.nombre_mascota)
        || (appointment.mascota
          && appointment.mascota === this.selectedPet.nombre_mascota)
      ))
    }
  },
  methods: {
    emptyCareDetails() {
      return {
        nombre_mascota: '',
        nombre_usuario: '',
        motivo_consulta: '',
        diagnostico: '',
        tratamiento: '',
        resultado: ''
      }
    },
    beginCare(pet) {
      this.selectedPet = pet
      const relatedAppointment = this.appointments.find((appointment) => (
        (pet.id_mascota && appointment.id_mascota
          && String(pet.id_mascota) === String(appointment.id_mascota))
        || appointment.nombre_mascota === pet.nombre_mascota
        || appointment.mascota === pet.nombre_mascota
      ))
      const ownerName = this.ownerName(pet) || this.ownerName(relatedAppointment)

      this.careDetails = {
        ...this.emptyCareDetails(),
        nombre_mascota: pet.nombre_mascota || '',
        nombre_usuario: ownerName
      }
      this.statusMessage = ''
      this.hasSubmitted = false
    },
    cancelCare() {
      this.selectedPet = null
      this.careDetails = this.emptyCareDetails()
      this.statusMessage = ''
      this.hasSubmitted = false
    },
    ownerName(record) {
      if (!record) {
        return ''
      }

      return record.nombre_usuario
        || record.nombre_dueno
        || record.nombre_propietario
        || record.dueno?.nombre
        || record.propietario?.nombre
        || record.owner?.name
        || ''
    },
    submitCare() {
      if (!this.careDetails.nombre_mascota || !this.careDetails.nombre_usuario) {
        return
      }

      const pet = {
        ...this.selectedPet,
        nombre_mascota: this.careDetails.nombre_mascota,
        nombre_usuario: this.careDetails.nombre_usuario
      }
      const payload = {
        mascota: pet,
        nombre_mascota: this.careDetails.nombre_mascota,
        nombre_usuario: this.careDetails.nombre_usuario,
        citas: this.relatedAppointments,
        fecha: this.localDate(),
        ...this.careDetails
      }

      if (this.role === 'vet') {
        this.$emit('clinical-history-created', payload)
      } else if (this.role === 'groomer') {
        this.$emit('grooming-result-recorded', payload)
      } else {
        this.$emit('walk-completed', payload)
      }

      this.statusMessage = 'Solicitud enviada al panel para su registro.'
      this.hasSubmitted = true
    },
    localDate() {
      const date = new Date()
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')

      return `${year}-${month}-${day}`
    }
  }
}
</script>

<style scoped>
.worker-pets {
  box-sizing: border-box;
  width: 100%;
  min-height: calc(100vh - 120px);
  padding: 24px;
  border: 1px solid var(--color-accent);
  border-radius: var(--border-radius);
  background: var(--color-surface);
  color: var(--color-text);
}

.worker-pets__header {
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-accent);
}

.worker-pets__header h1,
.worker-pets__care h2 {
  margin: 0;
  font-size: 20px;
}

.worker-pets__empty {
  padding: 32px 8px;
  color: var(--color-text-muted);
  text-align: center;
}

.worker-pets__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
}

.worker-pets__care {
  display: grid;
  gap: 16px;
  margin-top: 24px;
  padding: 20px;
  border: 1px solid var(--color-accent);
  border-radius: var(--border-radius);
}

.worker-pets__appointments,
.worker-pets__note,
.worker-pets__form p {
  margin: 0;
  color: var(--color-text-muted);
}

.worker-pets__form {
  display: grid;
  gap: 14px;
}

.worker-pets__form label {
  display: grid;
  gap: 7px;
  font-weight: 600;
}

.worker-pets__form input,

.worker-pets__form input,
.worker-pets__form textarea {
  box-sizing: border-box;
  width: 100%;
  min-height: 42px;
  padding: 9px 11px;
  border: 1px solid var(--color-text-muted);
  border-radius: var(--border-radius);
  background: var(--color-background);
  color: var(--color-text);
  font: inherit;
}

.worker-pets__form textarea {
  resize: vertical;
}

.worker-pets__submit,
.worker-pets__cancel {
  justify-self: start;
  min-height: 42px;
  padding: 9px 14px;
  border: 0;
  border-radius: var(--border-radius);
  font: inherit;
  cursor: pointer;
}

.worker-pets__submit {
  background: var(--color-primary);
  color: var(--color-surface);
}

.worker-pets__cancel {
  background: var(--color-accent);
  color: var(--color-text);
}

.worker-pets__status {
  margin: 0;
  color: var(--color-text-muted);
}

@media (max-width: 600px) {
  .worker-pets {
    min-height: 0;
    padding: 20px 16px;
  }
}
</style>
