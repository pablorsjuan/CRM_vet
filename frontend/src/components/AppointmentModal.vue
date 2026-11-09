<template>
  <div
    class="appointment-modal"
    role="presentation"
    @click.self="$emit('close')"
    @keydown.esc.stop="$emit('close')"
  >
    <section
      class="appointment-modal__panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="appointment-modal-title"
    >
      <button
        class="appointment-modal__close"
        type="button"
        aria-label="Cerrar"
        @click="$emit('close')"
      >
        ×
      </button>

      <h2 id="appointment-modal-title" class="appointment-modal__title">
        Agendar cita
      </h2>

      <form class="appointment-modal__form" @submit.prevent="submitAppointment">
        <label class="appointment-modal__field">
          Fecha
          <input
            v-model="date"
            type="date"
            :min="today"
            required
          >
        </label>

        <label class="appointment-modal__field">
          Tipo de cita
          <select v-model="appointmentType" required :disabled="Boolean(workerRole)">
            <option disabled value="">Selecciona un tipo de cita</option>
            <option value="veterinaria">Veterinaria</option>
            <option value="peluqueria">Peluquería</option>
            <option value="paseo">Paseo</option>
          </select>
        </label>

        <label
          v-if="date && appointmentType && !workerRole"
          class="appointment-modal__field"
        >
          Profesional disponible
          <select v-model="selectedProfessionalId" required :disabled="availabilityLoading">
            <option disabled value="">Selecciona un profesional</option>
            <option
              v-for="professional in professionals"
              :key="professional.id_usuario"
              :value="String(professional.id_usuario)"
              :disabled="professional.horarios.length === 0"
            >
              {{ professional.nombre_usuario }}
              {{ professional.horarios.length ? '' : '(sin horarios disponibles)' }}
            </option>
          </select>
        </label>
        <p
          v-if="workerRole && selectedProfessional"
          class="appointment-modal__message"
          role="status"
        >
          Profesional asignado: {{ selectedProfessional.nombre_usuario }}
        </p>
        <p v-if="availabilityLoading" class="appointment-modal__message" role="status">
          Consultando horarios disponibles…
        </p>
        <p v-if="availabilityError" class="appointment-modal__error" role="alert">
          {{ availabilityError }}
        </p>
        <p
          v-if="availabilityLoaded && !availabilityLoading && !availableTimes.length"
          class="appointment-modal__message"
          role="status"
        >
          No hay horarios disponibles para esta fecha y servicio.
        </p>
        <label
          v-if="selectedProfessional && availableTimes.length"
          class="appointment-modal__field"
        >
          Horario disponible
          <select v-model="selectedTime" required>
            <option disabled value="">Selecciona un horario</option>
            <option v-for="time in availableTimes" :key="time" :value="time">
              {{ time }}
            </option>
          </select>
        </label>

        <label v-if="workerRole" class="appointment-modal__field">
          Nombre del usuario
          <input
            v-model.trim="customerName"
            type="text"
            autocomplete="name"
            maxlength="100"
            placeholder="Escribe o selecciona un usuario"
            required
          >
          <span v-if="lookupState === 'searching'" class="appointment-modal__message" role="status">
            Buscando usuario...
          </span>
          <span
            v-else-if="!lookupState && customerName.length < 2"
            class="appointment-modal__message"
          >
            Escribe al menos dos caracteres para buscar.
          </span>
          <span
            v-else-if="lookupState === 'empty'"
            class="appointment-modal__message"
            role="status"
          >
            No se encontró un usuario con ese nombre.
          </span>
          <span v-if="lookupError" class="appointment-modal__error" role="alert">
            {{ lookupError }}
          </span>
          <ul
            v-if="searchResults.length"
            class="appointment-modal__user-results"
            aria-label="Usuarios encontrados"
          >
            <li v-for="user in searchResults" :key="user.id_usuario">
              <button
                class="appointment-modal__user-option"
                type="button"
                @click="selectOwner(user)"
              >
                {{ user.nombre_usuario }} (@{{ user.usuario }})
              </button>
            </li>
          </ul>
          <span
            v-if="selectedUser"
            class="appointment-modal__message"
            role="status"
          >
            Usuario seleccionado: {{ selectedUser.nombre_usuario }}
          </span>
        </label>

        <button
          v-if="workerRole && selectedUser"
          class="appointment-modal__pet-button"
          type="button"
          :disabled="appointmentPets.length === 0"
          :aria-expanded="showPetSelector"
          @click="showPetSelector = !showPetSelector"
        >
          {{ showPetSelector ? 'Ocultar mascotas' : 'Seleccionar mascota' }}
        </button>

        <label
          v-if="!workerRole || (selectedUser && showPetSelector)"
          class="appointment-modal__field"
        >
          Mascota
          <select v-model="petId" required :disabled="appointmentPets.length === 0">
            <option disabled value="">Selecciona una mascota</option>
            <option
              v-for="(pet, index) in appointmentPets"
              :key="pet.id_mascota || index"
              :value="pet.id_mascota || pet.nombre_mascota"
            >
              {{ pet.nombre_mascota }}
            </option>
          </select>
        </label>

        <p
          v-if="(!workerRole && pets.length === 0)
            || (workerRole && selectedUser && appointmentPets.length === 0)"
          class="appointment-modal__message"
        >
          {{
            workerRole
              ? 'Este usuario no tiene mascotas registradas.'
              : 'Registra una mascota antes de agendar una cita.'
          }}
        </p>

        <p v-if="errorMessage" class="appointment-modal__error" role="alert">
          {{ errorMessage }}
        </p>

        <p
          v-if="!isSaving && disabledReason"
          id="appointment-modal-submit-hint"
          class="appointment-modal__message"
          role="status"
        >
          {{ disabledReason }}
        </p>

        <button
          class="appointment-modal__submit"
          type="submit"
          :title="disabledReason"
          :aria-describedby="disabledReason ? 'appointment-modal-submit-hint' : null"
          :disabled="isSaving
            || !petId
            || !selectedTime
            || !selectedProfessional
            || availabilityLoading
            || appointmentPets.length === 0
            || (workerRole && !selectedUser)"
        >
          {{ isSaving ? 'Guardando cita…' : 'Confirmar cita' }}
        </button>
      </form>
    </section>
  </div>
</template>

<script>
import { searchOwners } from '@/services/usersApi'
import { getAppointmentAvailability } from '@/services/appointmentsApi'

export default {
  name: 'AppointmentModal',
  props: {
    pets: {
      type: Array,
      default: () => []
    },
    workerRole: {
      type: String,
      default: '',
      validator: (value) => ['', 'vet', 'groomer', 'walker'].includes(value)
    },
    errorMessage: {
      type: String,
      default: ''
    },
    isSaving: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'submit'],
  data() {
    return {
      date: '',
      appointmentType: '',
      petId: '',
      professionals: [],
      selectedProfessionalId: '',
      selectedTime: '',
      availabilityLoading: false,
      availabilityLoaded: false,
      availabilityError: '',
      availabilityRequestId: 0,
      customerName: '',
      searchResults: [],
      selectedUser: null,
      lookupState: '',
      lookupError: '',
      showPetSelector: false,
      searchTimer: null,
      searchController: null,
      today: this.getLocalDate()
    }
  },
  computed: {
    disabledReason() {
      if (this.availabilityLoading) {
        return 'Espera mientras consultamos los horarios disponibles.'
      }
      if (!this.date || !this.appointmentType) {
        return 'Selecciona la fecha y el tipo de cita.'
      }
      if (this.availabilityError) {
        return 'No se pudo consultar la disponibilidad. Revisa el error e intenta de nuevo.'
      }
      if (!this.selectedProfessional) {
        return 'Selecciona un profesional disponible.'
      }
      if (!this.selectedTime) {
        return this.availableTimes.length
          ? 'Selecciona un horario disponible para habilitar el botón.'
          : 'No hay horarios disponibles para esta fecha y servicio.'
      }
      if (this.workerRole && !this.selectedUser) {
        return 'Busca y selecciona al usuario propietario.'
      }
      if (!this.petId || this.appointmentPets.length === 0) {
        return 'Selecciona una mascota para la cita.'
      }

      return ''
    },
    selectedProfessional() {
      return this.professionals.find(
        (professional) => String(professional.id_usuario) === this.selectedProfessionalId
      ) || null
    },
    availableTimes() {
      return this.selectedProfessional?.horarios || []
    },
    appointmentPets() {
      return this.workerRole
        ? (this.selectedUser ? this.selectedUser.mascotas || [] : [])
        : this.pets
    }
  },
  watch: {
    date() {
      this.loadAvailability()
    },
    appointmentType() {
      this.loadAvailability()
    },
    selectedProfessionalId() {
      this.selectedTime = ''
    },
    customerName(value) {
      if (!this.workerRole) {
        return
      }

      this.clearUserLookup()
      this.selectedUser = null
      this.searchResults = []
      this.lookupError = ''
      this.showPetSelector = false
      this.petId = ''
      this.selectedTime = ''

      const query = value.trim()
      if (query.length < 2) {
        this.lookupState = ''
        return
      }

      this.lookupState = 'searching'
      this.searchTimer = setTimeout(() => this.lookupOwners(query), 300)
    },
    workerRole: {
      immediate: true,
      handler(role) {
        const roleService = {
          vet: 'veterinaria',
          groomer: 'peluqueria',
          walker: 'paseo'
        }

        if (roleService[role]) {
          this.appointmentType = roleService[role]
        }
      }
    }
  },
  beforeUnmount() {
    this.clearUserLookup()
  },
  methods: {
    clearUserLookup() {
      if (this.searchTimer) {
        clearTimeout(this.searchTimer)
        this.searchTimer = null
      }
      if (this.searchController) {
        this.searchController.abort()
        this.searchController = null
      }
    },
    async lookupOwners(query) {
      const controller = new AbortController()
      this.searchController = controller

      try {
        const owners = await searchOwners(query, { signal: controller.signal })
        if (this.customerName.trim() !== query) {
          return
        }
        this.searchResults = owners
        this.lookupState = owners.length ? 'results' : 'empty'
      } catch (error) {
        if (error.name === 'AbortError') {
          return
        }
        this.lookupError = error.message
        this.lookupState = 'error'
      } finally {
        if (this.searchController === controller) {
          this.searchController = null
        }
      }
    },
    async loadAvailability() {
      const requestId = this.availabilityRequestId + 1
      this.availabilityRequestId = requestId
      this.professionals = []
      this.selectedProfessionalId = ''
      this.selectedTime = ''
      this.availabilityLoaded = false
      this.availabilityError = ''
      this.availabilityLoading = false
      if (!this.date || !this.appointmentType) {
        return
      }

      this.availabilityLoading = true
      try {
        const professionals = await getAppointmentAvailability(
          this.date,
          this.appointmentType
        )
        if (requestId !== this.availabilityRequestId) {
          return
        }
        this.professionals = professionals
        if (this.workerRole && this.professionals.length) {
          this.selectedProfessionalId = String(this.professionals[0].id_usuario)
        }
        this.availabilityLoaded = true
      } catch (error) {
        if (requestId === this.availabilityRequestId) {
          this.availabilityError = error.message
        }
      } finally {
        if (requestId === this.availabilityRequestId) {
          this.availabilityLoading = false
        }
      }
    },
    selectOwner(owner) {
      this.selectedUser = owner
      this.searchResults = []
      this.lookupState = 'selected'
      this.lookupError = ''
      this.showPetSelector = false
      this.petId = ''
    },
    getLocalDate() {
      const date = new Date()
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')

      return `${year}-${month}-${day}`
    },
    submitAppointment() {
      const pet = this.appointmentPets.find(
        (item) => (item.id_mascota || item.nombre_mascota) === this.petId
      )

      if (!pet || (this.workerRole && !this.selectedUser)) {
        return
      }

      const appointment = {
        fecha: this.date,
        tipo_cita: this.appointmentType,
        hora_inicio: this.selectedTime,
        id_mascota: Number(pet.id_mascota)
      }

      if (!this.workerRole) {
        appointment.id_profesional = this.selectedProfessional.id_usuario
      }

      this.$emit('submit', appointment)
    }
  }
}
</script>

<style scoped>
.appointment-modal {
  position: fixed;
  z-index: 10;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgb(36 48 71 / 55%);
}

.appointment-modal__panel {
  position: relative;
  box-sizing: border-box;
  width: min(100%, 460px);
  padding: 28px;
  border-radius: var(--border-radius);
  background: var(--color-surface);
  box-shadow: 0 12px 32px rgb(36 48 71 / 20%);
  color: var(--color-text);
}

.appointment-modal__close {
  position: absolute;
  top: 10px;
  right: 12px;
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--color-text);
  font: inherit;
  font-size: 30px;
  line-height: 1;
  cursor: pointer;
}

.appointment-modal__close:hover,
.appointment-modal__close:focus-visible {
  background: var(--color-accent);
}

.appointment-modal__title {
  margin: 0 40px 24px 0;
  font-size: 24px;
}

.appointment-modal__form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.appointment-modal__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-weight: 600;
}

.appointment-modal__field input,
.appointment-modal__field select {
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

.appointment-modal__message {
  margin: 0;
  color: var(--color-text-muted);
}

.appointment-modal__error {
  margin: 0;
  color: var(--color-error);
}

.appointment-modal__user-results {
  display: grid;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.appointment-modal__user-option {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-accent);
  border-radius: var(--border-radius);
  background: var(--color-background);
  color: var(--color-text);
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.appointment-modal__user-option:hover,
.appointment-modal__user-option:focus-visible {
  background: var(--color-accent);
}

.appointment-modal__pet-button {
  min-height: 44px;
  padding: 10px 12px;
  border: 0;
  border-radius: var(--border-radius);
  background: var(--color-accent);
  color: var(--color-text);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.appointment-modal__pet-button:disabled {
  color: var(--color-text-muted);
  cursor: not-allowed;
}

.appointment-modal__submit {
  min-height: 44px;
  border: 0;
  border-radius: var(--border-radius);
  padding: 10px 16px;
  background: var(--color-primary);
  color: var(--color-surface);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.appointment-modal__submit:hover,
.appointment-modal__submit:focus-visible {
  background: var(--color-main-button-hover);
}

.appointment-modal__submit:disabled {
  background: var(--color-text-muted);
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .appointment-modal {
    padding: 12px;
  }

  .appointment-modal__panel {
    padding: 24px 20px;
  }
}
</style>
