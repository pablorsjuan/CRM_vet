<template>
  <nav class="navbar" aria-label="Navegación del usuario">
    <div class="logo">
      <span class="logo__emoji" aria-hidden="true">🐾</span>
      CRM Vet
    </div>

    <p class="navbar__welcome">
      Bienvenido <span id="nombre_usuario">usuario</span>
    </p>
  </nav>
</template>

<script>
export default {
  name: 'UserNavbar'
}
</script>

<style scoped src="@/assets/css/User_dashboard.css"></style>
