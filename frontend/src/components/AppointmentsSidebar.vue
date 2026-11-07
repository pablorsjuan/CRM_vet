<template>
  <aside class="appointments-sidebar" aria-labelledby="appointments-sidebar-title">
    <header class="appointments-sidebar__header">
      <h2 id="appointments-sidebar-title" class="appointments-sidebar__title">
        <span aria-hidden="true">📅</span>
        Citas pendientes
      </h2>
      <button
        class="appointments-sidebar__add-button"
        type="button"
        @click="$emit('add-appointment')"
      >
        Agendar cita
      </button>
    </header>

    <p v-if="appointments.length === 0" class="appointments-sidebar__empty">
      No tienes citas pendientes
    </p>

    <ul v-else class="appointments-sidebar__list">
      <li
        v-for="(appointment, index) in appointments"
        :key="appointment.id_cita || appointment.id || index"
      >
        <article class="appointment-card">
          <strong class="appointment-card__type">
            {{ appointment.tipo_servicio || appointment.servicio || 'Cita' }}
          </strong>
          <p class="appointment-card__detail">
            Mascota: {{ appointment.nombre_mascota || appointment.mascota || 'Sin asignar' }}
          </p>
          <p v-if="workerMode && appointment.nombre_usuario" class="appointment-card__detail">
            Usuario: {{ appointment.nombre_usuario }}
          </p>
          <p class="appointment-card__detail">
            Fecha: {{ formatDate(appointment.fecha) }}
          </p>
          <p v-if="appointment.hora" class="appointment-card__detail">
            Hora: {{ appointment.hora }}
          </p>
          <button
            v-if="!workerMode"
            class="appointment-card__cancel-button"
            type="button"
            @click="$emit('cancel-appointment', appointment)"
          >
            Cancelar cita
          </button>
        </article>
      </li>
    </ul>
  </aside>
</template>

<script>
export default {
  name: 'AppointmentsSidebar',
  props: {
    appointments: {
      type: Array,
      default: () => []
    },
    workerMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['add-appointment', 'cancel-appointment'],
  methods: {
    formatDate(date) {
      if (!date) {
        return 'Sin fecha'
      }

      const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
      if (!match) {
        return date
      }

      return new Date(
        Number(match[1]),
        Number(match[2]) - 1,
        Number(match[3])
      ).toLocaleDateString('es-ES')
    }
  }
}
</script>

<style scoped>
.appointments-sidebar {
  box-sizing: border-box;
  width: 100%;
  min-height: calc(100vh - 120px);
  padding: 24px;
  border: 1px solid var(--color-accent);
  border-radius: var(--border-radius);
  background: var(--color-surface);
  color: var(--color-text);
}

.appointments-sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-accent);
}

.appointments-sidebar__title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 20px;
}

.appointments-sidebar__title span {
  font-size: var(--emoji-size);
}

.appointments-sidebar__add-button {
  flex: 0 0 auto;
  border: 0;
  border-radius: var(--border-radius);
  padding: 9px 12px;
  background: var(--color-primary);
  color: var(--color-surface);
  font: inherit;
  font-size: 14px;
  cursor: pointer;
}

.appointments-sidebar__add-button:hover,
.appointments-sidebar__add-button:focus-visible {
  background: var(--color-main-button-hover);
}

.appointments-sidebar__empty {
  margin: 0;
  padding: 48px 8px;
  color: var(--color-text-muted);
  text-align: center;
}

.appointments-sidebar__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
}

.appointment-card {
  --appointment-card-vertical-padding: 14px;
  --appointment-card-content-height: 36px;

  box-sizing: border-box;
  display: flex;
  min-height: calc(
    var(--appointment-card-content-height)
    + 2 * var(--appointment-card-vertical-padding)
    + 4px
  );
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-block: var(--appointment-card-vertical-padding);
  padding-inline: 14px;
  border: 2px solid var(--color-accent);
  border-radius: var(--border-radius);
  background: var(--color-background);
}

.appointment-card__type {
  flex: 0 1 auto;
  min-width: 0;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.appointment-card__detail {
  flex: 0 1 auto;
  min-width: 0;
  margin: 0;
  overflow: hidden;
  color: var(--color-text-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.appointment-card__cancel-button {
  flex: 0 0 auto;
  border: 0;
  border-radius: var(--border-radius);
  padding: 8px 12px;
  background: var(--color-error);
  color: var(--color-surface);
  font: inherit;
  font-size: 14px;
  cursor: pointer;
}

.appointment-card__cancel-button:hover,
.appointment-card__cancel-button:focus-visible {
  filter: brightness(1.5);
}

@media (max-width: 600px) {
  .appointments-sidebar {
    min-height: 0;
    padding: 20px 16px;
  }

  .appointments-sidebar__header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
