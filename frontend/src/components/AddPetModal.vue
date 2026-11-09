<template>
  <div
    class="add-pet-modal"
    role="presentation"
    @click.self="$emit('close')"
  >
    <section
      class="add-pet-modal__panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-pet-modal-title"
    >
      <button
        class="add-pet-modal__close"
        type="button"
        aria-label="Cerrar"
        @click="$emit('close')"
      >
        ×
      </button>

      <h2 id="add-pet-modal-title" class="add-pet-modal__title">
        Añadir mascota
      </h2>

      <form class="add-pet-modal__form" @submit.prevent="submitPet">
        <label class="add-pet-modal__field">
        <span>
          Especie <span class="add-pet-modal__hint">(obligatorio)</span>
        </span>
        <select v-model="species" required>
            <option disabled value="">Selecciona una especie</option>
            <option
              v-for="option in speciesOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </label>

        <label class="add-pet-modal__field">
          <span>
            Nombre <span class="add-pet-modal__hint">(obligatorio)</span>
          </span>
          <input
            v-model.trim="name"
            type="text"
            maxlength="50"
            autocomplete="off"
            required
          >
        </label>

        <label class="add-pet-modal__field">
          <span>
            Edad (años) <span class="add-pet-modal__hint">(obligatorio)</span>
          </span>
          <input
            v-model="age"
            type="number"
            min="0"
            max="100"
            step="1"
            required
          >
        </label>

        <label class="add-pet-modal__field">
          <span>
            Sexo <span class="add-pet-modal__hint">(obligatorio)</span>
          </span>
          <select v-model="sex" required>
            <option disabled value="">Selecciona el sexo</option>
            <option value="M">Macho</option>
            <option value="F">Hembra</option>
          </select>
        </label>

        <label class="add-pet-modal__field">
          <span>
            Color <span class="add-pet-modal__hint">(opcional)</span>
          </span>
          <input
            v-model.trim="color"
            type="text"
            maxlength="50"
            autocomplete="off"
          >
        </label>

        <label class="add-pet-modal__field">
          <span>
            Raza <span class="add-pet-modal__hint">(opcional)</span>
          </span>
          <input
            v-model.trim="breed"
            type="text"
            maxlength="50"
            autocomplete="off"
          >
        </label>

        <label class="add-pet-modal__field">
          <span>
            Observaciones de la mascota
            <span class="add-pet-modal__hint">(opcional)</span>
          </span>
          <textarea
            v-model.trim="observations"
            placeholder="Alérgico a un medicamento, es muy miedoso, etc."
            rows="3"
          />
        </label>

        <button class="add-pet-modal__submit" type="submit">
          Guardar mascota
        </button>
      </form>
    </section>
  </div>
</template>

<script>
import { PET_SPECIES } from '@/constants/petSpecies'

export default {
  name: 'AddPetModal',
  props: {
    speciesOptions: {
      type: Array,
      default: () => PET_SPECIES
    }
  },
  emits: ['close', 'submit'],
  data() {
    return {
      species: '',
      name: '',
      age: '',
      sex: '',
      color: '',
      breed: '',
      observations: ''
    }
  },
  methods: {
    submitPet() {
      if (!this.speciesOptions.some((option) => option.value === this.species)) {
        return
      }

      const pet = {
        nombre_mascota: this.name,
        especie: this.species,
        edad: Number(this.age),
        sexo: this.sex,
        color: this.color
      }

      if (this.breed) {
        pet.raza = this.breed
      }

      if (this.observations) {
        pet.observaciones = this.observations
      }

      this.$emit('submit', pet)
    }
  }
}
</script>

<style scoped>
.add-pet-modal {
  position: fixed;
  z-index: 10;
  inset: 0;
  display: grid;
  place-items: center;
  overflow-y: auto;
  padding: 20px;
  background: rgb(36 48 71 / 55%);
}

.add-pet-modal__panel {
  position: relative;
  box-sizing: border-box;
  width: min(100%, 460px);
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  padding: 28px;
  border-radius: var(--border-radius);
  background: var(--color-surface);
  box-shadow: 0 12px 32px rgb(36 48 71 / 20%);
  color: var(--color-text);
}

.add-pet-modal__close {
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

.add-pet-modal__close:hover,
.add-pet-modal__close:focus-visible {
  background: var(--color-accent);
}

.add-pet-modal__title {
  margin: 0 40px 24px 0;
  font-size: 24px;
}

.add-pet-modal__form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.add-pet-modal__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-weight: 600;
}

.add-pet-modal__field .add-pet-modal__hint,
.add-pet-modal__age legend {
  color: var(--color-text-muted);
}

.add-pet-modal__field input,
.add-pet-modal__field select,
.add-pet-modal__field textarea {
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

.add-pet-modal__field textarea {
  resize: vertical;
}

.add-pet-modal__submit {
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

.add-pet-modal__submit:hover,
.add-pet-modal__submit:focus-visible {
  background: var(--color-main-button-hover);
}

@media (max-width: 480px) {
  .add-pet-modal {
    padding: 12px;
  }

  .add-pet-modal__panel {
    max-height: calc(100vh - 24px);
    padding: 24px 20px;
  }
}
</style>
