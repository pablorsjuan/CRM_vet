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
            @click.prevent="logout"
          >
            Cerrar sesión
          </router-link>
        </nav>
      </aside>

      <section class="user-dashboard__content" aria-live="polite">
        <p v-if="isLoadingData" class="user-dashboard__api-status" role="status">
          Cargando tus datos…
        </p>
        <p v-if="dashboardError" class="user-dashboard__api-error" role="alert">
          {{ dashboardError }}
        </p>
        <PetsSidebar
          v-if="activePanel === 'pets'"
          :pets="visiblePets"
          :species-options="speciesOptions"
          :clinical-histories="visibleClinicalHistories"
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
      :error-message="appointmentError"
      :is-saving="isSavingAppointment"
      @close="isAppointmentModalOpen = false"
      @submit="submitAppointment"
    />
    <AddPetModal
      v-if="isPetModalOpen"
      :species-options="speciesOptions"
      :error-message="petSubmissionError"
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
import { logoutUser } from '@/services/authApi'
import { apiRequest, hasAccessToken } from '@/services/api'
import { cancelAppointment } from '@/services/appointmentsApi'

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
      isSavingAppointment: false,
      appointmentError: '',
      isPetModalOpen: false,
      apiPets: [],
      apiHistories: [],
      apiAppointments: [],
      apiUserId: null,
      isLoadingData: false,
      dashboardError: '',
      petSubmissionError: '',
      cancelledAppointmentIds: [],
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
  created() {
    this.loadDashboardData()
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
      return this.pets.length ? this.pets : this.apiPets
    },
    visibleClinicalHistories() {
      return this.clinicalHistories.length ? this.clinicalHistories : this.apiHistories
    },
    visibleAppointments() {
      const allAppointments = [...this.appointments, ...this.apiAppointments]
      const uniqueAppointments = allAppointments.filter((appointment, index, list) => {
        const id = appointment.id_cita || appointment.id
        return !id || list.findIndex((item) => (
          String(item.id_cita || item.id) === String(id)
        )) === index
      })

      return uniqueAppointments.filter((appointment) => {
        const id = appointment.id_cita || appointment.id
        if (id) {
          const status = (appointment.estado || appointment.status || '').toLocaleLowerCase()
          return !this.cancelledAppointmentIds.includes(String(id))
            && ![
              'cancelada',
              'cancelado',
              'completada',
              'completado',
              'realizada',
              'realizado'
            ].includes(status)
        }

        return true
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
    async loadDashboardData() {
      this.isLoadingData = true
      this.dashboardError = ''
      try {
        const [profile, pets, histories, appointments] = await Promise.all([
          apiRequest('/auth/profile'),
          apiRequest('/pets/mine'),
          apiRequest('/clinical-histories/mine'),
          apiRequest('/appointments/mine')
        ])
        if (!Array.isArray(pets)) {
          throw new Error('El servidor devolvió una lista de mascotas inválida.')
        }
        if (!Array.isArray(histories)) {
          throw new Error('El servidor devolvió una lista de historias clínicas inválida.')
        }
        if (!Array.isArray(appointments)) {
          throw new Error('El servidor devolvió una lista de citas inválida.')
        }

        if (!profile || !Number.isInteger(profile.id_usuario)) {
          throw new Error('El servidor devolvió un perfil de usuario inválido.')
        }

        this.apiUserId = profile.id_usuario
        this.apiPets = pets
        this.apiHistories = histories
        this.apiAppointments = appointments
        this.profileDraft = {
          username: profile.usuario || '',
          email: profile.email || '',
          cellphone: profile.num_celular || ''
        }
      } catch (error) {
        this.dashboardError = error.message
        if (!hasAccessToken()) {
          this.$router.push('/login')
        }
      } finally {
        this.isLoadingData = false
      }
    },
    logout() {
      logoutUser()
      this.$router.push('/login')
    },
    openPetModal() {
      this.isPetModalOpen = true
      this.$emit('add-pet')
    },
    async submitPet(pet) {
      this.petSubmissionError = ''
      try {
        const createdPet = await apiRequest('/pets', {
          method: 'POST',
          body: pet
        })
        this.apiPets = [...this.apiPets, createdPet]
        this.$emit('pet-created', createdPet)
        this.isPetModalOpen = false
      } catch (error) {
        this.petSubmissionError = error.message
      }
    },
    async updatePet(pet) {
      if (!pet.id_mascota) {
        this.dashboardError = 'No se encontró el identificador de la mascota.'
        return
      }

      const fields = [
        'nombre_mascota',
        'especie',
        'raza',
        'sexo',
        'fecha_nacimiento',
        'peso',
        'color',
        'observaciones'
      ]
      const body = Object.fromEntries(
        fields.filter((field) => field in pet).map((field) => [field, pet[field]])
      )

      this.dashboardError = ''
      try {
        const updatedPet = await apiRequest(`/pets/${pet.id_mascota}`, {
          method: 'PATCH',
          body
        })
        this.apiPets = this.apiPets.map((item) => (
          String(item.id_mascota) === String(updatedPet.id_mascota) ? updatedPet : item
        ))
        this.$emit('pet-updated', updatedPet)
      } catch (error) {
        this.dashboardError = error.message
      }
    },
    async deletePet(pet) {
      if (!window.confirm(`¿Está seguro de eliminar a ${pet.nombre_mascota}?`)) {
        return
      }

      if (!pet.id_mascota) {
        this.dashboardError = 'No se encontró el identificador de la mascota.'
        return
      }

      this.dashboardError = ''
      try {
        await apiRequest(`/pets/${pet.id_mascota}`, { method: 'DELETE' })
        this.apiPets = this.apiPets.filter(
          (item) => String(item.id_mascota) !== String(pet.id_mascota)
        )
        this.$emit('pet-deleted', pet)
      } catch (error) {
        this.dashboardError = error.message
      }
    },
    openAppointmentModal() {
      this.appointmentError = ''
      this.isAppointmentModalOpen = true
      this.$emit('add-appointment')
    },
    openProfile() {
      this.activePanel = 'profile'
      this.$emit('edit-profile')
    },
    async saveProfile() {
      if (!this.apiUserId) {
        this.profileStatus = 'No fue posible identificar tu cuenta.'
        return
      }

      const profile = {
        usuario: this.profileDraft.username,
        email: this.profileDraft.email,
        num_celular: this.profileDraft.cellphone
      }
      try {
        await apiRequest(`/users/${this.apiUserId}`, {
          method: 'PATCH',
          body: profile
        })
        this.$emit('profile-updated', this.profileDraft)
        this.profileStatus = 'Perfil actualizado correctamente.'
      } catch (error) {
        this.profileStatus = error.message
      }
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
    async submitAppointment(appointment) {
      this.appointmentError = ''
      this.isSavingAppointment = true
      try {
        const createdAppointment = await apiRequest('/appointments', {
          method: 'POST',
          body: appointment
        })
        this.apiAppointments = [...this.apiAppointments, createdAppointment]
        this.$emit('appointment-created', createdAppointment)
        this.isAppointmentModalOpen = false
      } catch (error) {
        this.appointmentError = error.message
      } finally {
        this.isSavingAppointment = false
      }
    },
    async cancelAppointment(appointment) {
      if (!window.confirm('¿Está seguro de cancelar la cita?')) {
        return
      }

      const id = appointment.id_cita || appointment.id
      if (!id || !Number.isInteger(Number(id))) {
        this.dashboardError = 'No se encontró el identificador de la cita.'
        return
      }

      this.dashboardError = ''
      try {
        await cancelAppointment(id)
        this.cancelledAppointmentIds.push(String(id))
        this.apiAppointments = this.apiAppointments.map((item) => (
          String(item.id_cita) === String(id) ? { ...item, estado: 'cancelada' } : item
        ))
        this.$emit('appointment-cancelled', appointment)
      } catch (error) {
        this.dashboardError = error.message
      }
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

.user-dashboard__api-status,
.user-dashboard__api-error {
  margin: 0 0 16px;
}

.user-dashboard__api-status {
  color: var(--color-text-muted);
}

.user-dashboard__api-error {
  color: var(--color-error);
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