<template>
  <main class="worker-dashboard">
    <UserNavbar />
    <div class="worker-dashboard__layout">
      <aside class="worker-dashboard__sidebar" aria-label="Menú del paseador">
        <nav class="worker-dashboard__navigation">
          <button
            v-for="panel in panels"
            :key="panel.id"
            class="worker-dashboard__navigation-button"
            :class="{ 'worker-dashboard__navigation-button--active': activePanel === panel.id }"
            type="button"
            :aria-current="activePanel === panel.id ? 'page' : null"
            @click="activePanel = panel.id"
          >
            {{ panel.label }}
          </button>
          <router-link
            class="worker-dashboard__navigation-button worker-dashboard__navigation-button--logout"
            to="/login"
            @click.prevent="logout"
          >
            Cerrar sesión
          </router-link>
        </nav>
      </aside>

      <section class="worker-dashboard__content" aria-live="polite">
        <p v-if="isLoadingPets" role="status">Cargando mascotas…</p>
        <p v-if="loadError" role="alert">{{ loadError }}</p>
        <WorkerPetsSidebar
          v-if="activePanel === 'pets'"
          :pets="allPets"
          :appointments="appointments"
          role="walker"
          @worker-action="openPetCare"
        />
        <WorkerPetsSidebar
          v-else-if="activePanel === 'care'"
          :pets="allPets"
          :appointments="appointments"
          :initial-pet="selectedCarePet"
          role="walker"
          manual-care
          @walk-completed="$emit('walk-completed', $event)"
        />
        <WorkerAppointmentsPanel
          v-else-if="activePanel === 'appointments'"
          :appointments="appointments"
          :pets="allPets"
          role="walker"
          @appointment-created="$emit('appointment-created', $event)"
        />
        <WorkerProfilePanel v-else-if="activePanel === 'profile'" />
        <template v-else>
          <h1>{{ activePanelTitle }}</h1>
          <p>{{ activePanelDescription }}</p>
        </template>
      </section>
    </div>
  </main>
</template>

<script>
import UserNavbar from '@/components/UserNavbar.vue'
import WorkerPetsSidebar from '@/components/WorkerPetsSidebar.vue'
import WorkerAppointmentsPanel from '@/components/WorkerAppointmentsPanel.vue'
import WorkerProfilePanel from '@/components/WorkerProfilePanel.vue'
import { logoutUser } from '@/services/authApi'
import { apiRequest, hasAccessToken } from '@/services/api'

export default {
  name: 'WalkerDashboard',
  components: {
    UserNavbar,
    WorkerPetsSidebar,
    WorkerAppointmentsPanel,
    WorkerProfilePanel
  },
  props: {
    pets: {
      type: Array,
      default: () => []
    },
    appointments: {
      type: Array,
      default: () => []
    }
  },
  emits: ['walk-completed', 'appointment-created'],
  data() {
    return {
      activePanel: 'care',
      selectedCarePet: null,
      loadedPets: [],
      isLoadingPets: false,
      loadError: '',
      panels: [
        { id: 'care', label: 'Atender cita', title: 'Atender cita' },
        { id: 'appointments', label: 'Citas pendientes', title: 'Citas pendientes' },
        { id: 'pets', label: 'Mascotas', title: 'Mascotas' },
        { id: 'profile', label: 'Cambiar datos del perfil', title: 'Cambiar datos del perfil' }
      ]
    }
  },
  created() {
    this.loadPets()
  },
  computed: {
    allPets() {
      return this.pets.length ? this.pets : this.loadedPets
    },
    activePanelTitle() {
      return this.panels.find((panel) => panel.id === this.activePanel).title
    },
    activePanelDescription() {
      return `La sección de ${this.activePanelTitle.toLowerCase()} se definirá próximamente.`
    }
  },
  methods: {
    async loadPets() {
      this.isLoadingPets = true
      this.loadError = ''
      try {
        const pets = await apiRequest('/pets')
        if (!Array.isArray(pets)) {
          throw new Error('El servidor devolvió una lista de mascotas inválida.')
        }
        this.loadedPets = pets
      } catch (error) {
        this.loadError = error.message
        if (!hasAccessToken()) {
          this.$router.push('/login')
        }
      } finally {
        this.isLoadingPets = false
      }
    },
    openPetCare(pet) {
      this.selectedCarePet = pet
      this.activePanel = 'care'
    },
    logout() {
      logoutUser()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.worker-dashboard {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-background);
  color: var(--color-text);
  font-family: var(--font-primary);
}

.worker-dashboard__layout {
  display: grid;
  flex: 1;
  grid-template-columns: 250px minmax(0, 1fr);
}

.worker-dashboard__sidebar {
  padding: 24px 16px;
  border-right: 1px solid var(--color-accent);
  background: var(--color-surface);
}

.worker-dashboard__navigation {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.worker-dashboard__navigation-button {
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

.worker-dashboard__navigation-button:hover,
.worker-dashboard__navigation-button:focus-visible,
.worker-dashboard__navigation-button--active {
  background: var(--color-accent);
}

.worker-dashboard__navigation-button--logout:hover,
.worker-dashboard__navigation-button--logout:focus-visible {
  background: var(--color-error);
  color: var(--color-surface);
}

.worker-dashboard__navigation-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.worker-dashboard__content {
  min-width: 0;
  padding: 24px;
}

@media (max-width: 760px) {
  .worker-dashboard__layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .worker-dashboard__sidebar {
    padding: 12px 16px;
    border-right: 0;
    border-bottom: 1px solid var(--color-accent);
  }

  .worker-dashboard__navigation {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .worker-dashboard__navigation-button {
    width: auto;
  }

  .worker-dashboard__content {
    padding: 16px;
  }
}
</style>
