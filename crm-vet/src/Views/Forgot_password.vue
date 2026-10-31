<template>
  <main class="forgot-password">
    <section class="forgot-password__card" aria-labelledby="forgot-password-title">
      <header class="forgot-password__header">
        <span class="forgot-password__icon" aria-hidden="true">🔑</span>
        <h1 id="forgot-password-title" class="forgot-password__title">
          Recuperar contraseña
        </h1>
      </header>

      <p class="forgot-password__description">
        Ingresa tu usuario y correo electrónico para recuperar el acceso a tu cuenta.
      </p>

      <form class="forgot-password__form" @submit.prevent>
        <ForgotPasswordInput
          id="recuperar-usuario"
          label="Usuario"
          placeholder="Ingresa tu usuario"
          autocomplete="username"
        />
        <ForgotPasswordInput
          id="recuperar-correo"
          label="Correo electrónico"
          type="email"
          placeholder="nombre@ejemplo.com"
          autocomplete="email"
        />
        <ForgotPasswordSubmitButton />
      </form>

      <p class="forgot-password__login">
        ¿Recordaste tu contraseña? <router-link to="/login">Inicia sesión</router-link>
      </p>
    </section>
  </main>
</template>

<script>
import ForgotPasswordInput from '@/components/forgot-password/ForgotPasswordInput.vue'
import ForgotPasswordSubmitButton from '@/components/forgot-password/ForgotPasswordSubmitButton.vue'

export default {
  name: 'ForgotPasswordView',
  components: {
    ForgotPasswordInput,
    ForgotPasswordSubmitButton
  }
}
</script>

<style src="@/assets/css/Forgot_password.css"></style>
