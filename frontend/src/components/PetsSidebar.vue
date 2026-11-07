<template>
  <aside class="pets-sidebar" aria-labelledby="pets-sidebar-title">
    <header class="pets-sidebar__header">
      <h1 id="pets-sidebar-title" class="pets-sidebar__title">
        <span class="pets-sidebar__emoji" aria-hidden="true">🐕</span>
        Mis mascotas
      </h1>
      <button
        class="pets-sidebar__add-button"
        type="button"
        @click="$emit('add-pet')"
      >
        Añadir mascotas
      </button>
    </header>

    <p v-if="pets.length === 0" class="pets-sidebar__empty">
      No tienes mascotas asignadas
    </p>

    <ul v-else class="pets-sidebar__list">
      <li v-for="(pet, index) in pets" :key="pet.id_mascota || index">
        <PetCard
          :pet="pet"
          :species-options="speciesOptions"
          :clinical-histories="historiesForPet(pet)"
          @edit-pet="$emit('edit-pet', $event)"
          @update-pet="$emit('update-pet', $event)"
          @delete-pet="$emit('delete-pet', $event)"
          @notifications="$emit('notifications', $event)"
          @view-pet="$emit('view-pet', $event)"
        />
      </li>
    </ul>
  </aside>
</template>

<script>
import { PET_SPECIES } from '@/constants/petSpecies'
import PetCard from '@/components/PetCard.vue'

export default {
  name: 'PetsSidebar',
  components: {
    PetCard
  },
  props: {
    pets: {
      type: Array,
      default: () => []
    },
    speciesOptions: {
      type: Array,
      default: () => PET_SPECIES
    },
    clinicalHistories: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    historiesForPet(pet) {
      return this.clinicalHistories.filter((history) => (
        String(history.id_mascota) === String(pet.id_mascota)
      ))
    }
  },
  emits: ['add-pet', 'edit-pet', 'update-pet', 'delete-pet', 'notifications', 'view-pet']
}
</script>

<style scoped>
.pets-sidebar {
  box-sizing: border-box;
  /* TODO: Aquí se puede cambiar el tamaño horizontal */
  width: 100%;
  min-height: calc(100vh - 120px);
  padding: 24px;
  border: 1px solid var(--color-accent);
  border-radius: var(--border-radius);
  background: var(--color-surface);
  color: var(--color-text);
}

.pets-sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-accent);
}

.pets-sidebar__title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 20px;
}

.pets-sidebar__emoji {
  font-size: var(--emoji-size);
}

.pets-sidebar__add-button,
.pets-sidebar__add-button:focus-visible {
  border: 0;
  border-radius: var(--border-radius);
  padding: 9px 12px;
  background: var(--color-primary);
  color: var(--color-surface);
  font: inherit;
  font-size: 14px;
  cursor: pointer;
}

.pets-sidebar__add-button:hover {
  background: var(--color-main-button-hover);
}

.pets-sidebar__empty {
  margin: 0;
  padding: 48px 8px;
  color: var(--color-text-muted);
  text-align: center;
}

.pets-sidebar__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
}

@media (max-width: 600px) {
  .pets-sidebar {
    width: 100%;
    min-height: 0;
    padding: 20px 16px;
  }
}
</style>
