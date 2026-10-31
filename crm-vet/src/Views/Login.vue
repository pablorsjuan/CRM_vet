<template>
  <main class="login">
    <section class="login__card" aria-labelledby="login-title">
      <LoginTitle />

      <form class="login__form" @submit.prevent>
        <LoginInput
          id="usuario"
          label="Usuario"
          placeholder="Ingresa tu usuario"
          autocomplete="username"
        />
        <LoginInput
          id="contrasena"
          label="Contraseña"
          type="password"
          placeholder="Ingresa tu contraseña"
          autocomplete="current-password"
        />

        <div class="login__actions">
          <ForgotPasswordButton />
          <LoginSubmitButton />
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import ForgotPasswordButton from '@/components/login/ForgotPasswordButton.vue'
import LoginInput from '@/components/login/LoginInput.vue'
import LoginSubmitButton from '@/components/login/LoginSubmitButton.vue'
import LoginTitle from '@/components/login/LoginTitle.vue'

export default {
  name: 'LoginView',
  components: {
    ForgotPasswordButton,
    LoginInput,
    LoginSubmitButton,
    LoginTitle
  }
}
</script>

<style src="@/assets/css/Login.css"></style>

<!-- <FontAwesomeIcon :icon="byPrefixAndName.fas['door-open']" /> -->