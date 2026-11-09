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
        class="worker-pets__form"
        @submit.prevent="submitCare"
      >
        <div v-if="!hasSubmitted" class="worker-pets__fields">
          <label
            v-if="manualCare && role === 'vet'"
            class="worker-pets__field--full"
          >
            Mascota
            <select v-model="manualPetId" required @change="selectManualPet">
              <option disabled value="">Selecciona una mascota</option>
              <option
                v-for="pet in pets"
                :key="pet.id_mascota"
                :value="String(pet.id_mascota)"
              >
                {{ pet.nombre_mascota }}
              </option>
            </select>
          </label>
          <p
            v-if="manualCare && role === 'vet' && pets.length === 0"
            class="worker-pets__field--full"
          >
            No hay mascotas disponibles para registrar una historia clínica.
          </p>
          <label v-if="role !== 'vet'">
            Nombre de la mascota
            <input
              v-model.trim="careDetails.nombre_mascota"
              autocomplete="off"
              maxlength="100"
              required
            >
          </label>
          <label v-if="role !== 'vet'">
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
            <label class="worker-pets__field--full">
              Antecedentes médicos
              <textarea
                v-model.trim="careDetails.antecedentes_medicos"
                placeholder="Alergias, enfermedades previas, cirugías o medicación actual."
                rows="3"
              />
            </label>
            <label class="worker-pets__field--full">
              Diagnóstico
              <textarea v-model.trim="careDetails.diagnostico" required rows="3" />
            </label>
            <label class="worker-pets__field--full">
              Tratamiento
              <textarea v-model.trim="careDetails.tratamiento" required rows="3" />
            </label>
          </template>

          <template v-else-if="role === 'groomer'">
            <label class="worker-pets__field--full">
              Resultado de peluquería
              <textarea
                v-model.trim="careDetails.resultado"
                placeholder="Describe el servicio realizado y sus observaciones."
                required
                rows="4"
              />
            </label>
            <p class="worker-pets__note worker-pets__field--full">
              El registro de imágenes no está disponible en esta versión.
            </p>
          </template>

          <p v-else class="worker-pets__field--full">
            Confirma cuando hayas terminado el paseo de esta mascota.
          </p>
        </div>

        <div class="worker-pets__actions">
          <button v-if="!hasSubmitted && role === 'vet'" class="worker-pets__submit" type="submit">
            Guardar historia clínica
          </button>
          <button
            v-else-if="!hasSubmitted && role === 'groomer'"
            class="worker-pets__submit"
            type="submit"
          >
            Registrar resultado
          </button>
          <button v-else-if="!hasSubmitted" class="worker-pets__submit" type="submit">
            Marcar paseo como realizado
          </button>
          <button class="worker-pets__cancel" type="button" @click="cancelCare">
            Cerrar
          </button>
        </div>
      </form>

      <p v-if="statusMessage" class="worker-pets__status" :role="isError ? 'alert' : 'status'">
        {{ statusMessage }}
      </p>
    </section>
  </section>
</template>

<script>
import PetCard from '@/components/PetCard.vue'
import { createClinicalHistory } from '@/services/clinicalHistoriesApi'

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
      manualPetId: '',
      careDetails: this.emptyCareDetails(),
      statusMessage: '',
      isError: false,
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
        antecedentes_medicos: '',
        diagnostico: '',
        tratamiento: '',
        resultado: ''
      }
    },
    beginCare(pet) {
      this.selectedPet = pet
      this.manualPetId = pet.id_mascota ? String(pet.id_mascota) : ''
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
      this.isError = false
      this.hasSubmitted = false
    },
    selectManualPet() {
      const pet = this.pets.find(
        (item) => String(item.id_mascota) === this.manualPetId
      )
      if (!pet) {
        return
      }

      this.selectedPet = pet
      this.careDetails = {
        ...this.emptyCareDetails(),
        nombre_mascota: pet.nombre_mascota || ''
      }
      this.statusMessage = ''
      this.isError = false
    },
    cancelCare() {
      this.selectedPet = null
      this.manualPetId = ''
      this.careDetails = this.emptyCareDetails()
      this.statusMessage = ''
      this.isError = false
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
    async submitCare() {
      if (
        (this.role === 'vet' && !this.selectedPet?.id_mascota)
        || (this.role !== 'vet'
          && (!this.careDetails.nombre_mascota || !this.careDetails.nombre_usuario))
      ) {
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
        try {
          const history = await createClinicalHistory({
            id_mascota: pet.id_mascota,
            motivo_consulta: this.careDetails.motivo_consulta,
            antecedentes_medicos: this.careDetails.antecedentes_medicos,
            diagnostico: this.careDetails.diagnostico,
            tratamiento: this.careDetails.tratamiento
          })
          this.$emit('clinical-history-created', history)
          this.statusMessage = 'Historia clínica guardada correctamente.'
          this.isError = false
          this.hasSubmitted = true
        } catch (error) {
          this.statusMessage = error.message
          this.isError = true
        }
      } else if (this.role === 'groomer') {
        this.$emit('grooming-result-recorded', payload)
        this.statusMessage = 'Solicitud enviada al panel para su registro.'
        this.hasSubmitted = true
      } else {
        this.$emit('walk-completed', payload)
        this.statusMessage = 'Solicitud enviada al panel para su registro.'
        this.hasSubmitted = true
      }
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
}

.worker-pets__header h1 {
  font-size: 2em;
}

.worker-pets__care h2 {
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

.worker-pets__fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
  gap: 16px;
  max-width: 760px;
}

.worker-pets__form label {
  display: grid;
  gap: 7px;
  font-weight: 600;
}

.worker-pets__form input,
.worker-pets__form textarea {
  box-sizing: border-box;
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  border: 1px solid var(--color-text-muted);
  border-radius: var(--border-radius);
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;
}

.worker-pets__form textarea {
  resize: vertical;
}

.worker-pets__form input:focus-visible,
.worker-pets__form textarea:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.worker-pets__field--full {
  grid-column: 1 / -1;
}

.worker-pets__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.worker-pets__submit,
.worker-pets__cancel {
  min-height: 44px;
  padding: 10px 16px;
  border: 0;
  border-radius: var(--border-radius);
  font: inherit;
  cursor: pointer;
}

.worker-pets__submit {
  background: var(--color-main-button);
  color: var(--color-surface);
}

.worker-pets__submit:hover,
.worker-pets__submit:focus-visible {
  background: var(--color-main-button-hover);
}

.worker-pets__cancel {
  background: var(--color-accent);
  color: var(--color-text);
}

.worker-pets__cancel:hover,
.worker-pets__cancel:focus-visible {
  background: var(--color-gradient-left);
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
