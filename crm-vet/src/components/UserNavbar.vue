<template>
  <nav class="navbar" aria-label="Navegación del usuario">
    <div class="logo">🐾 CRM Vet</div>

    <div class="navbar__actions">
      <p class="navbar__welcome">
        Bienvenido <span id="nombre_usuario">usuario</span>
      </p>

      <div class="settings">
        <button
          class="settings__toggle"
          type="button"
          aria-haspopup="true"
          :aria-expanded="isSettingsOpen"
          @click="isSettingsOpen = !isSettingsOpen"
        >
          Configuración
        </button>

        <div v-if="isSettingsOpen" class="settings__menu">
          <button
            class="settings__option"
            type="button"
            @click="onEditProfile"
          >
            Cambiar datos del perfil
          </button>
          <router-link
            class="settings__option"
            to="/login"
            @click="isSettingsOpen = false"
          >
            Cerrar sesión
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'UserNavbar',
  emits: ['edit-profile'],
  data() {
    return {
      isSettingsOpen: false
    }
  },
  methods: {
    onEditProfile() {
      this.isSettingsOpen = false
      this.$emit('edit-profile')
    }
  }
}
</script>

<style scoped src="@/assets/css/User_dashboard.css"></style>
