<template>
  <article class="pet-card">
    <div class="pet-card__main">
      <div class="pet-card__identity">
        <span class="pet-card__emoji" aria-hidden="true">{{ speciesEmoji }}</span>
        <div class="pet-card__details">
          <strong class="pet-card__name">{{ currentPet.nombre_mascota }}</strong>
          <div class="pet-card__attributes">
            <span>{{ ageLabel }}</span>
            <span>Sexo: {{ currentPet.sexo }}</span>
          </div>
        </div>
      </div>
      <div v-if="workerMode" class="pet-card__actions">
        <button
          class="pet-card__action-button"
          type="button"
          :aria-label="`Atender cita de ${currentPet.nombre_mascota}`"
          @click="$emit('worker-action', currentPet)"
        >
          Atender cita
        </button>
      </div>
      <div v-else class="pet-card__actions">
        <button
          class="pet-card__action-button"
          type="button"
          :aria-expanded="isEditing"
          @click="toggleEdit"
        >
          Editar información de la mascota
        </button>
        <button
          class="pet-card__action-button"
          type="button"
          :aria-label="`Ver mascota ${currentPet.nombre_mascota}`"
          :aria-expanded="isViewing"
          @click="toggleView"
        >
          Ver mascota
        </button>
        <button
          class="pet-card__action-button pet-card__delete-button"
          type="button"
          @click="$emit('delete-pet', currentPet)"
        >
          Eliminar mascota
        </button>
        <button
          class="pet-card__notification-button"
          type="button"
          :aria-label="`Notificaciones de ${currentPet.nombre_mascota}`"
          @click="$emit('notifications', currentPet)"
        >
          <span aria-hidden="true">🔔</span>
        </button>
      </div>
    </div>

    <Transition name="pet-card-expand">
      <div v-if="isEditing" class="pet-card__expand">
        <form
          class="pet-card__expand-inner pet-card__edit-form"
          @submit.prevent="savePet"
        >
          <label class="pet-card__field">
            <span>Nombre <span class="pet-card__hint">(obligatorio)</span></span>
            <input
              v-model.trim="form.nombre_mascota"
              type="text"
              maxlength="50"
              autocomplete="off"
              required
            >
          </label>

          <fieldset class="pet-card__age-choice">
            <legend>¿Qué dato deseas registrar?</legend>
            <label>
              <input v-model="form.ageInputType" type="radio" value="age">
              Edad en años
            </label>
            <label>
              <input v-model="form.ageInputType" type="radio" value="birthDate">
              Fecha de nacimiento
            </label>
          </fieldset>

          <label v-if="form.ageInputType === 'age'" class="pet-card__field">
            <span>Edad (años) <span class="pet-card__hint">(obligatorio)</span></span>
            <input v-model="form.edad" type="number" min="0" max="100" step="1" required>
          </label>

          <label v-else class="pet-card__field">
            <span>Fecha de nacimiento <span class="pet-card__hint">(obligatorio)</span></span>
            <input v-model="form.fecha_nacimiento" type="date" :max="today" required>
          </label>

          <label class="pet-card__field">
            <span>Sexo <span class="pet-card__hint">(obligatorio)</span></span>
            <select v-model="form.sexo" required>
              <option disabled value="">Selecciona el sexo</option>
              <option value="M">Macho</option>
              <option value="F">Hembra</option>
            </select>
          </label>

          <label class="pet-card__field">
            <span>Color <span class="pet-card__hint">(obligatorio)</span></span>
            <input
              v-model.trim="form.color"
              type="text"
              maxlength="50"
              autocomplete="off"
              required
            >
          </label>

          <label class="pet-card__field">
            <span>Raza <span class="pet-card__hint">(opcional)</span></span>
            <input
              v-model.trim="form.raza"
              type="text"
              maxlength="50"
              autocomplete="off"
            >
          </label>

          <label class="pet-card__field pet-card__field--observations">
            <span>Observaciones de la mascota <span class="pet-card__hint">(opcional)</span></span>
            <textarea
              v-model.trim="form.observaciones"
              placeholder="Alérgico a un medicamento, es muy miedoso, etc."
              rows="3"
            />
          </label>

          <div class="pet-card__form-actions">
            <button class="pet-card__save-button" type="submit">Guardar cambios</button>
            <button class="pet-card__cancel-button" type="button" @click="isEditing = false">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Transition>

    <Transition name="pet-card-expand">
      <section
        v-if="isViewing"
        class="pet-card__expand pet-card__history"
        aria-label="Historias clínicas"
      >
        <div class="pet-card__expand-inner">
          <h2 class="pet-card__history-title">Historias clínicas</h2>
          <p v-if="clinicalHistories.length === 0" class="pet-card__history-empty">
            Aún no hay historias clínicas registradas para esta mascota.
          </p>
          <ul v-else class="pet-card__history-list">
            <li
              v-for="(history, index) in clinicalHistories"
              :key="history.id_historiaclinica || index"
              class="pet-card__history-row"
            >
              <time v-if="history.fecha" class="pet-card__history-date">
                {{ formatDate(history.fecha) }}
              </time>
              <div class="pet-card__history-summary">
                <strong v-if="history.motivo_consulta">{{ history.motivo_consulta }}</strong>
                <span v-if="history.diagnostico">
                  <b>Diagnóstico:</b> {{ history.diagnostico }}
                </span>
                <span v-if="history.tratamiento">
                  <b>Tratamiento:</b> {{ history.tratamiento }}
                </span>
                <span v-if="history.antecedentes_medicos">
                  <b>Antecedentes médicos:</b> {{ history.antecedentes_medicos }}
                </span>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </Transition>
  </article>
</template>

<script>
import { PET_SPECIES } from '@/constants/petSpecies'

export default {
  name: 'PetCard',
  props: {
    pet: {
      type: Object,
      default: () => ({ nombre_mascota: 'Roky' })
    },
    speciesOptions: {
      type: Array,
      default: () => PET_SPECIES
    },
    clinicalHistories: {
      type: Array,
      default: () => []
    },
    workerMode: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'edit-pet',
    'update-pet',
    'delete-pet',
    'notifications',
    'view-pet',
    'worker-action'
  ],
  data() {
    return {
      isEditing: false,
      isViewing: false,
      petDisplay: null,
      form: this.createForm(this.pet)
    }
  },
  computed: {
    currentPet() {
      return this.petDisplay || this.pet
    },
    ageLabel() {
      if (this.currentPet.edad !== undefined && this.currentPet.edad !== null) {
        return `${this.currentPet.edad} años`
      }

      const birthDate = this.currentPet.fecha_nacimiento
      if (!birthDate) {
        return 'Edad no registrada'
      }

      const [year, month, day] = birthDate.split('-').map(Number)
      const today = new Date()
      let age = today.getFullYear() - year
      const birthDay = new Date(year, month - 1, day)
      const birthdayHasNotPassed = today.getMonth() + 1 < month
        || (today.getMonth() + 1 === month && today.getDate() < day)

      if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
        return 'Edad no registrada'
      }

      if (
        birthDay.getFullYear() !== year
        || birthDay.getMonth() + 1 !== month
        || birthDay.getDate() !== day
        || birthDay > today
      ) {
        return 'Edad no registrada'
      }

      if (birthdayHasNotPassed) {
        age -= 1
      }

      return `${age} años`
    },
    today() {
      const date = new Date()
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')

      return `${year}-${month}-${day}`
    },
    speciesEmoji() {
      const species = this.speciesOptions.find(
        (option) => option.value.toLowerCase() === (this.currentPet.especie || '').toLowerCase()
      )

      return species && species.emoji ? species.emoji : '🐾'
    }
  },
  watch: {
    pet: {
      handler(pet) {
        if (!this.isEditing) {
          this.form = this.createForm(pet)
        }
      },
      deep: true
    }
  },
  methods: {
    createForm(pet) {
      return {
        nombre_mascota: pet.nombre_mascota || '',
        edad: pet.edad ?? '',
        ageInputType: pet.fecha_nacimiento ? 'birthDate' : 'age',
        fecha_nacimiento: pet.fecha_nacimiento || '',
        sexo: pet.sexo || '',
        color: pet.color || '',
        raza: pet.raza || '',
        observaciones: pet.observaciones || ''
      }
    },
    toggleEdit() {
      this.form = this.createForm(this.currentPet)
      this.isEditing = !this.isEditing
      if (this.isEditing) {
        this.isViewing = false
      }
      this.$emit('edit-pet', this.currentPet)
    },
    toggleView() {
      this.isViewing = !this.isViewing
      if (this.isViewing) {
        this.isEditing = false
      }
      this.$emit('view-pet', this.currentPet)
    },
    formatDate(date) {
      const parsedDate = new Date(`${date}T00:00:00`)
      return Number.isNaN(parsedDate.getTime())
        ? date
        : new Intl.DateTimeFormat('es', { dateStyle: 'medium' }).format(parsedDate)
    },
    savePet() {
      const { ageInputType, ...form } = this.form
      const updatedPet = {
        ...this.currentPet,
        ...form
      }

      if (ageInputType === 'age') {
        const age = Number(form.edad)
        if (!Number.isInteger(age) || age < 0 || age > 100) {
          return
        }

        updatedPet.edad = age
        delete updatedPet.fecha_nacimiento
      } else {
        if (!form.fecha_nacimiento || form.fecha_nacimiento > this.today) {
          return
        }

        delete updatedPet.edad
      }

      this.petDisplay = updatedPet
      this.isEditing = false
      this.$emit('update-pet', updatedPet)
    }
  }
}
</script>

<style scoped>
.pet-card {
  --pet-card-vertical-padding: 8px;

  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-block: var(--pet-card-vertical-padding);
  padding-inline: 14px;
  border: 2px solid var(--color-accent);
  border-radius: var(--border-radius);
  background: var(--color-background);
}

.pet-card__main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.pet-card__identity {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 10px;
}

.pet-card__details {
  display: flex;
  min-width: 0;
  flex-direction: row;
  gap: 8px;
}

.pet-card__emoji {
  font-size: var(--emoji-size);
  line-height: 1;
}

.pet-card__name {
  color: var(--color-primary);
  overflow: hidden;
  justify-content: flex-start;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 700;
}

.pet-card__attributes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  color: #000;
  font-size: 14px;
  font-weight: 400;
}

.pet-card__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.pet-card__action-button,
.pet-card__notification-button,
.pet-card__save-button,
.pet-card__cancel-button {
  flex: 0 0 auto;
  border: 0;
  border-radius: var(--border-radius);
  padding: 8px 10px;
  background: var(--color-surface);
  color: var(--color-primary);
  font: var(--font-primary);
  font-size: 14px;
  cursor: pointer;
}

.pet-card__notification-button {
  --pet-notification-emoji-size: 1.5rem;

  display: grid;
  width: calc(var(--pet-notification-emoji-size) + 12px);
  height: calc(var(--pet-notification-emoji-size) + 12px);
  place-items: center;
  padding: 0;
}

.pet-card__notification-button span {
  font-size: var(--pet-notification-emoji-size);
  line-height: 1;
}

.pet-card__action-button:hover,
.pet-card__action-button:focus-visible,
.pet-card__notification-button:hover,
.pet-card__notification-button:focus-visible {
  background: var(--color-accent);
}

.pet-card__delete-button:hover,
.pet-card__delete-button:focus-visible {
  background: var(--color-error);
  color: var(--color-surface);
}

.pet-card__edit-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  padding-top: 14px;
}

.pet-card__age-choice {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  margin: 0;
  padding: 0;
  border: 0;
}

.pet-card__age-choice legend {
  margin-bottom: 8px;
  font-weight: 600;
}

.pet-card__age-choice label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pet-card__expand {
  display: grid;
  grid-template-rows: 1fr;
  border-top: 1px solid var(--color-accent);
  transition:
    grid-template-rows 550ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 350ms ease;
}

.pet-card__expand-inner {
  min-height: 0;
  overflow: hidden;
}

.pet-card-expand-enter-from,
.pet-card-expand-leave-to {
  grid-template-rows: 0fr;
  opacity: 0;
}

.pet-card__history {
  padding-top: 0;
}

.pet-card__history .pet-card__expand-inner {
  padding-top: 14px;
}

.pet-card__history-title {
  margin: 0 0 12px;
  color: var(--color-primary);
  font-size: 18px;
}

.pet-card__history-empty {
  margin: 0;
  color: var(--color-text-muted);
}

.pet-card__history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.pet-card__history-row {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px 12px;
  border: 1px solid var(--color-accent);
  border-radius: var(--border-radius);
  background: var(--color-surface);
}

.pet-card__history-date {
  color: var(--color-text-muted);
  font-size: 13px;
}

.pet-card__history-summary {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pet-card__field {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 7px;
  font-weight: 600;
}

.pet-card__hint {
  color: var(--color-text-muted);
  font-weight: 400;
}

.pet-card__field input,
.pet-card__field select,
.pet-card__field textarea {
  box-sizing: border-box;
  width: 100%;
  min-height: 42px;
  padding: 9px 11px;
  border: 1px solid var(--color-text-muted);
  border-radius: var(--border-radius);
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;
}

.pet-card__field textarea {
  resize: vertical;
}

.pet-card__field--observations {
  grid-column: 1 / -1;
}

.pet-card__form-actions {
  display: flex;
  flex-wrap: wrap;
  grid-column: 1 / -1;
  gap: 8px;
}

.pet-card__save-button {
  background: var(--color-primary);
  color: var(--color-surface);
}

.pet-card__save-button:hover,
.pet-card__save-button:focus-visible {
  background: var(--color-main-button-hover);
}

.pet-card__cancel-button {
  background: var(--color-accent);
}

@media (max-width: 420px) {
  .pet-card__main {
    flex-direction: column;
    align-items: flex-start;
  }

  .pet-card__actions {
    width: 100%;
    justify-content: flex-start;
  }

  .pet-card__edit-form {
    grid-template-columns: minmax(0, 1fr);
  }

  .pet-card__field--observations,
  .pet-card__form-actions {
    grid-column: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pet-card__expand {
    transition-duration: 0.01ms;
  }
}
</style>
