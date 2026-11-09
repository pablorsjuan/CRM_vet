<template>
  <section class="worker-profile" aria-labelledby="worker-profile-title">
    <h1 id="worker-profile-title">Cambiar datos del perfil</h1>
    <p v-if="isLoading" class="worker-profile__status" role="status">
      Cargando tus datos…
    </p>
    <p v-if="profileError" class="worker-profile__error" role="alert">
      {{ profileError }}
    </p>
    <form class="worker-profile__form" @submit.prevent="saveProfile">
      <label class="worker-profile__field" for="worker-profile-username">
        Usuario
        <input
          id="worker-profile-username"
          v-model.trim="profileDraft.username"
          type="text"
          autocomplete="username"
          required
        >
      </label>
      <label class="worker-profile__field" for="worker-profile-email">
        Correo electrónico
        <input
          id="worker-profile-email"
          v-model.trim="profileDraft.email"
          type="email"
          autocomplete="email"
          required
        >
      </label>
      <label class="worker-profile__field" for="worker-profile-cellphone">
        Celular
        <input
          id="worker-profile-cellphone"
          v-model.trim="profileDraft.cellphone"
          type="tel"
          autocomplete="tel"
          required
        >
      </label>
      <button
        class="worker-profile__submit"
        type="submit"
        :disabled="isLoading || isSaving"
      >
        Guardar cambios
      </button>
      <p v-if="profileStatus" class="worker-profile__status" role="status">
        {{ profileStatus }}
      </p>
    </form>
  </section>
</template>

<script>
import { apiRequest, hasAccessToken } from '@/services/api'

export default {
  name: 'WorkerProfilePanel',
  data() {
    return {
      profileDraft: {
        username: '',
        email: '',
        cellphone: ''
      },
      isLoading: false,
      isSaving: false,
      profileError: '',
      profileStatus: ''
    }
  },
  created() {
    this.loadProfile()
  },
  methods: {
    async loadProfile() {
      this.isLoading = true
      this.profileError = ''
      try {
        const profile = await apiRequest('/auth/profile')
        if (!profile || !Number.isInteger(profile.id_usuario)) {
          throw new Error('El servidor devolvió un perfil de usuario inválido.')
        }

        this.profileDraft = {
          username: profile.usuario || '',
          email: profile.email || '',
          cellphone: profile.num_celular || ''
        }
      } catch (error) {
        this.profileError = error.message
        if (!hasAccessToken()) {
          this.$router.push('/login')
        }
      } finally {
        this.isLoading = false
      }
    },
    async saveProfile() {
      this.isSaving = true
      this.profileError = ''
      this.profileStatus = ''
      try {
        const updatedProfile = await apiRequest('/auth/profile', {
          method: 'PATCH',
          body: {
            usuario: this.profileDraft.username,
            email: this.profileDraft.email,
            num_celular: this.profileDraft.cellphone
          }
        })
        this.profileDraft = {
          username: updatedProfile.usuario,
          email: updatedProfile.email,
          cellphone: updatedProfile.num_celular || ''
        }
        this.profileStatus = 'Perfil actualizado correctamente.'
      } catch (error) {
        this.profileError = error.message
      } finally {
        this.isSaving = false
      }
    }
  }
}
</script>

<style scoped>
.worker-profile {
  min-height: 240px;
  padding: 24px;
  border: 1px solid var(--color-accent);
  border-radius: var(--border-radius);
  background: var(--color-surface);
  color: var(--color-text);
}

.worker-profile h1 {
  margin-top: 0;
}

.worker-profile__form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
  gap: 16px;
  max-width: 760px;
  margin-top: 24px;
}

.worker-profile__field {
  display: grid;
  gap: 8px;
  color: var(--color-text);
  font-weight: 600;
}

.worker-profile__field input {
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

.worker-profile__field input:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.worker-profile__submit {
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

.worker-profile__submit:hover,
.worker-profile__submit:focus-visible {
  background: var(--color-main-button-hover);
}

.worker-profile__submit:disabled {
  cursor: wait;
  opacity: 0.7;
}

.worker-profile__status {
  grid-column: 1 / -1;
  margin: 0;
  color: var(--color-text-muted);
}

.worker-profile__error {
  color: var(--color-error);
}
</style>
