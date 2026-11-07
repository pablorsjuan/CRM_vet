<template>
  <main class="user-dashboard">
    <UserNavbar />
    <div class="user-dashboard__layout">
      <aside class="user-dashboard__sidebar" aria-label="Menú principal">
        <nav class="user-dashboard__navigation">
          <button
            class="user-dashboard__navigation-button"
            :class="{ 'user-dashboard__navigation-button--active': activePanel === 'pets' }"
            type="button"
            :aria-current="activePanel === 'pets' ? 'page' : null"
            @click="activePanel = 'pets'"
          >
            Añadir mascota
          </button>
          <button
            class="user-dashboard__navigation-button"
            :class="{ 'user-dashboard__navigation-button--active': activePanel === 'appointments' }"
            type="button"
            :aria-current="activePanel === 'appointments' ? 'page' : null"
            @click="activePanel = 'appointments'"
          >
            Agendar cita
          </button>
          <button
            class="user-dashboard__navigation-button"
            :class="{ 'user-dashboard__navigation-button--active': activePanel === 'profile' }"
            type="button"
            :aria-current="activePanel === 'profile' ? 'page' : null"
            @click="openProfile"
          >
            Cambiar datos del perfil
          </button>
          <router-link
            class="user-dashboard__navigation-button user-dashboard__navigation-button--logout"
            to="/login"
          >
            Cerrar sesión
          </router-link>
        </nav>
      </aside>

      <section class="user-dashboard__content" aria-live="polite">
        <PetsSidebar
          v-if="activePanel === 'pets'"
          :pets="visiblePets"
          :species-options="speciesOptions"
          :clinical-histories="clinicalHistories"
          @add-pet="openPetModal"
          @edit-pet="$emit('edit-pet', $event)"
          @update-pet="updatePet"
          @delete-pet="deletePet"
          @notifications="$emit('notifications', $event)"
          @view-pet="$emit('view-pet', $event)"
        />
        <AppointmentsSidebar
          v-else-if="activePanel === 'appointments'"
          :appointments="visibleAppointments"
          @add-appointment="openAppointmentModal"
          @cancel-appointment="cancelAppointment"
        />
        <section
          v-else
          class="user-dashboard__profile"
          aria-labelledby="profile-panel-title"
        >
          <h1 id="profile-panel-title">Cambiar datos del perfil</h1>
          <form class="user-dashboard__profile-form" @submit.prevent="saveProfile">
            <label class="user-dashboard__profile-field" for="profile-username">
              Usuario
              <input
                id="profile-username"
                v-model.trim="profileDraft.username"
                type="text"
                autocomplete="username"
                required
              >
            </label>
            <label class="user-dashboard__profile-field" for="profile-email">
              Correo electrónico
              <input
                id="profile-email"
                v-model.trim="profileDraft.email"
                type="email"
                autocomplete="email"
                required
              >
            </label>
            <label class="user-dashboard__profile-field" for="profile-cellphone">
              Celular
              <input
                id="profile-cellphone"
                v-model.trim="profileDraft.cellphone"
                type="tel"
                autocomplete="tel"
                required
              >
            </label>
            <button class="user-dashboard__profile-submit" type="submit">
              Guardar cambios
            </button>
            <p v-if="profileStatus" class="user-dashboard__profile-status" role="status">
              {{ profileStatus }}
            </p>
          </form>

          <section class="user-dashboard__password" aria-labelledby="password-panel-title">
            <h2 id="password-panel-title">Cambiar contraseña</h2>
            <p>
              Para cambiarla, primero se debe enviar un código de verificación al correo
              asociado a la cuenta.
            </p>
            <button
              class="user-dashboard__profile-submit"
              type="button"
              @click="requestPasswordCode"
            >
              Solicitar código de verificación
            </button>
            <p v-if="passwordCodeRequested" class="user-dashboard__profile-status" role="status">
              Solicitud preparada. El envío del código requiere conectar el backend.
            </p>
            <form
              v-if="passwordCodeRequested"
              class="user-dashboard__profile-form"
              @submit.prevent="submitPasswordChange"
            >
              <label class="user-dashboard__profile-field" for="profile-verification-code">
                Código de verificación
                <input
                  id="profile-verification-code"
                  v-model.trim="passwordDraft.code"
                  type="text"
                  inputmode="numeric"
                  autocomplete="one-time-code"
                  required
                >
              </label>
              <label class="user-dashboard__profile-field" for="profile-new-password">
                Nueva contraseña
                <input
                  id="profile-new-password"
                  v-model="passwordDraft.password"
                  type="password"
                  autocomplete="new-password"
                  required
                >
              </label>
              <button class="user-dashboard__profile-submit" type="submit">
                Confirmar cambio de contraseña
              </button>
            </form>
          </section>
        </section>
      </section>
    </div>

    <AppointmentModal
      v-if="isAppointmentModalOpen"
      :pets="visiblePets"
      @close="isAppointmentModalOpen = false"
      @submit="submitAppointment"
    />
    <AddPetModal
      v-if="isPetModalOpen"
      :species-options="speciesOptions"
      @close="isPetModalOpen = false"
      @submit="submitPet"
    />
  </main>
</template>

<script>
import { PET_SPECIES } from '@/constants/petSpecies'
import UserNavbar from '@/components/UserNavbar.vue'
import PetsSidebar from '@/components/PetsSidebar.vue'
import AppointmentsSidebar from '@/components/AppointmentsSidebar.vue'
import AppointmentModal from '@/components/AppointmentModal.vue'
import AddPetModal from '@/components/AddPetModal.vue'

export default {
  name: 'UserDashboard',
  props: {
    pets: {
      type: Array,
      default: () => []
    },
    appointments: {
      type: Array,
      default: () => []
    },
    clinicalHistories: {
      type: Array,
      default: () => []
    },
    profile: {
      type: Object,
      default: () => ({
        username: '',
        email: '',
        cellphone: ''
      })
    },
    speciesOptions: {
      type: Array,
      default: () => PET_SPECIES
    }
  },
  data() {
    return {
      activePanel: 'pets',
      isAppointmentModalOpen: false,
      isPetModalOpen: false,
      createdPets: [],
      updatedPets: [],
      deletedPets: [],
      createdAppointments: [],
      cancelledAppointmentIds: [],
      cancelledAppointmentObjects: [],
      nextAppointmentId: 1,
      profileDraft: {
        username: this.profile.username || '',
        email: this.profile.email || '',
        cellphone: this.profile.cellphone || ''
      },
      profileStatus: '',
      passwordCodeRequested: false,
      passwordDraft: {
        code: '',
        password: ''
      }
    }
  },
  watch: {
    profile: {
      deep: true,
      handler(profile) {
        this.profileDraft = {
          username: profile.username || '',
          email: profile.email || '',
          cellphone: profile.cellphone || ''
        }
      }
    }
  },
  computed: {
    visiblePets() {
      const newPets = this.createdPets.filter((createdPet) => (
        !this.pets.some((pet) => (
          pet.nombre_mascota === createdPet.nombre_mascota
          && pet.especie === createdPet.especie
          && pet.raza === createdPet.raza
          && pet.edad === createdPet.edad
          && pet.sexo === createdPet.sexo
          && pet.color === createdPet.color
          && pet.observaciones === createdPet.observaciones
          && pet.fecha_nacimiento === createdPet.fecha_nacimiento
        ))
      ))

      return [...this.pets, ...newPets]
        .filter((pet) => !this.deletedPets.some((deletedPet) => this.samePet(pet, deletedPet)))
        .map((pet) => {
          const updatedPet = this.updatedPets.find((entry) => this.samePet(entry.original, pet))
          return updatedPet ? updatedPet.pet : pet
        })
    },
    visibleAppointments() {
      const newAppointments = this.createdAppointments.filter((createdAppointment) => (
        !this.appointments.some((appointment) => (
          this.appointmentsMatch(appointment, createdAppointment)
        ))
      ))
      const allAppointments = [...this.appointments, ...newAppointments]

      return allAppointments.filter((appointment) => {
        const id = appointment.id_cita || appointment.id
        if (id) {
          return !this.cancelledAppointmentIds.includes(String(id))
        }

        return !this.cancelledAppointmentObjects.includes(appointment)
      })
    }
  },
  emits: [
    'add-pet',
    'edit-pet',
    'notifications',
    'view-pet',
    'add-appointment',
    'appointment-created',
    'pet-created',
    'pet-updated',
    'pet-deleted',
    'appointment-cancelled',
    'edit-profile',
    'profile-updated',
    'request-password-code',
    'password-change-requested'
  ],
  components: {
    UserNavbar,
    PetsSidebar,
    AppointmentsSidebar,
    AppointmentModal,
    AddPetModal
  },
  methods: {
    openPetModal() {
      this.isPetModalOpen = true
      this.$emit('add-pet')
    },
    submitPet(pet) {
      this.createdPets.push(pet)
      this.$emit('pet-created', pet)
      this.isPetModalOpen = false
    },
    samePet(first, second) {
      if (first.id_mascota && second.id_mascota) {
        return String(first.id_mascota) === String(second.id_mascota)
      }

      return first === second
    },
    updatePet(pet) {
      const existingUpdate = this.updatedPets.find((entry) => (
        this.samePet(entry.original, pet) || this.samePet(entry.pet, pet)
      ))
      const originalPet = existingUpdate
        ? existingUpdate.original
        : this.pets.find((item) => this.samePet(item, pet))
          || this.createdPets.find((item) => this.samePet(item, pet))
          || pet

      if (existingUpdate) {
        existingUpdate.pet = pet
      } else {
        this.updatedPets.push({ original: originalPet, pet })
      }

      this.$emit('pet-updated', pet)
    },
    deletePet(pet) {
      if (!window.confirm(`¿Está seguro de eliminar a ${pet.nombre_mascota}?`)) {
        return
      }

      const existingUpdate = this.updatedPets.find((entry) => this.samePet(entry.pet, pet))
      const originalPet = existingUpdate
        ? existingUpdate.original
        : this.pets.find((item) => this.samePet(item, pet))
          || this.createdPets.find((item) => this.samePet(item, pet))
          || pet

      this.deletedPets.push(originalPet)
      this.createdPets = this.createdPets.filter((item) => !this.samePet(item, originalPet))
      this.updatedPets = this.updatedPets.filter((entry) => !this.samePet(entry.original, originalPet))
      this.$emit('pet-deleted', pet)
    },
    openAppointmentModal() {
      this.isAppointmentModalOpen = true
      this.$emit('add-appointment')
    },
    openProfile() {
      this.activePanel = 'profile'
      this.$emit('edit-profile')
    },
    saveProfile() {
      const profile = { ...this.profileDraft }
      this.$emit('profile-updated', profile)
      this.profileStatus = 'Cambios listos para sincronizar con el backend.'
    },
    requestPasswordCode() {
      this.passwordCodeRequested = true
      this.$emit('request-password-code', { email: this.profileDraft.email })
    },
    submitPasswordChange() {
      this.$emit('password-change-requested', {
        email: this.profileDraft.email,
        code: this.passwordDraft.code,
        password: this.passwordDraft.password
      })
      this.passwordDraft = { code: '', password: '' }
    },
    submitAppointment(appointment) {
      const createdAppointment = {
        ...appointment,
        id_cita: `local-${Date.now()}-${this.nextAppointmentId}`
      }
      this.nextAppointmentId += 1
      this.createdAppointments.push(createdAppointment)
      this.$emit('appointment-created', createdAppointment)
      this.isAppointmentModalOpen = false
    },
    appointmentsMatch(first, second) {
      return first.fecha === second.fecha
        && (first.tipo_servicio || first.servicio) === second.tipo_servicio
        && (first.id_mascota || first.nombre_mascota || first.mascota)
          === (second.id_mascota || second.nombre_mascota)
    },
    cancelAppointment(appointment) {
      if (!window.confirm('¿Está seguro de cancelar la cita?')) {
        return
      }

      const id = appointment.id_cita || appointment.id
      this.createdAppointments = this.createdAppointments.filter(
        (item) => !this.appointmentsMatch(item, appointment)
      )

      if (id) {
        this.cancelledAppointmentIds.push(String(id))
      } else {
        this.cancelledAppointmentObjects.push(appointment)
      }

      this.$emit('appointment-cancelled', appointment)
    }
  }
}
</script>

<style scoped>
.user-dashboard {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-bottom: 24px;
  background: var(--color-background);
  font-family: var(--font-primary);
}

.user-dashboard__layout {
  display: grid;
  flex: 1;
  grid-template-columns: 250px minmax(0, 1fr);
  align-items: stretch;
}

.user-dashboard__sidebar {
  padding: 24px 16px;
  border-right: 1px solid var(--color-accent);
  background: var(--color-surface);
}

.user-dashboard__navigation {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-dashboard__navigation-button {
  box-sizing: border-box;
  display: block;
  width: 100%;
  padding: 12px 14px;
  border: 0;
  border-radius: var(--border-radius);
  background: transparent;
  color: var(--color-text);
  font: inherit;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
}

.user-dashboard__navigation-button:hover,
.user-dashboard__navigation-button:focus-visible,
.user-dashboard__navigation-button--active {
  background: var(--color-accent);
}

.user-dashboard__navigation-button--logout:hover,
.user-dashboard__navigation-button--logout:focus-visible {
  background: var(--color-error);
  color: var(--color-surface);
}

.user-dashboard__navigation-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.user-dashboard__content {
  min-width: 0;
  padding: 24px;
}

.user-dashboard__profile {
  min-height: 240px;
  padding: 24px;
  border: 1px solid var(--color-accent);
  border-radius: var(--border-radius);
  background: var(--color-surface);
  color: var(--color-text);
}

.user-dashboard__profile h1 {
  margin-top: 0;
}

.user-dashboard__profile-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
  gap: 16px;
  max-width: 760px;
  margin-top: 24px;
}

.user-dashboard__profile-field {
  display: grid;
  gap: 8px;
  color: var(--color-text);
  font-weight: 600;
}

.user-dashboard__profile-field input {
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

.user-dashboard__profile-field input:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.user-dashboard__profile-submit {
  justify-self: start;
  min-height: 44px;
  padding: 10px 16px;
  border: 0;
  border-radius: var(--border-radius);
  background: var(--color-main-button);
  color: var(--color-surface);
  font: inherit;
  cursor: pointer;
}

.user-dashboard__profile-submit:hover,
.user-dashboard__profile-submit:focus-visible {
  background: var(--color-main-button-hover);
}

.user-dashboard__profile-status {
  grid-column: 1 / -1;
  margin: 0;
  color: var(--color-text-muted);
}

.user-dashboard__password {
  max-width: 760px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--color-accent);
}

.user-dashboard__password h2 {
  margin-top: 0;
}

.user-dashboard__password > .user-dashboard__profile-status {
  margin-top: 12px;
}

@media (max-width: 760px) {
  .user-dashboard__layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .user-dashboard__sidebar {
    padding: 12px 16px;
    border-right: 0;
    border-bottom: 1px solid var(--color-accent);
  }

  .user-dashboard__navigation {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .user-dashboard__navigation-button {
    width: auto;
  }

  .user-dashboard__content {
    padding: 16px;
  }
}
</style>