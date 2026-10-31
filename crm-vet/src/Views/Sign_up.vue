<template>
  <main class="signup">
    <section class="signup__card" aria-labelledby="signup-title">
      <SignupTitle />

      <form class="signup__form" @submit.prevent>
        <SignupInput
          id="signup-usuario"
          label="Usuario"
          placeholder="Crea tu nombre de usuario"
          autocomplete="username"
        />
        <SignupInput
          id="signup-contrasena"
          label="Contraseña"
          type="password"
          placeholder="Crea una contraseña"
          autocomplete="new-password"
        />
        <SignupInput
          id="signup-correo"
          label="Correo electrónico"
          type="email"
          placeholder="nombre@ejemplo.com"
          autocomplete="email"
        />
        <SignupInput
          id="signup-celular"
          label="Celular"
          type="tel"
          placeholder="Ingresa tu número de celular"
          autocomplete="tel"
        />

        <SignupSubmitButton />
      </form>

      <p class="signup__login">
        ¿Ya tienes una cuenta? <router-link to="/login">Inicia sesión</router-link>
      </p>
    </section>
  </main>
</template>

<script>
import SignupInput from '@/components/signup/SignupInput.vue'
import SignupSubmitButton from '@/components/signup/SignupSubmitButton.vue'
import SignupTitle from '@/components/signup/SignupTitle.vue'

export default {
  name: 'SignUpView',
  components: {
    SignupInput,
    SignupSubmitButton,
    SignupTitle
  }
}
</script>

<style src="@/assets/css/Sign_up.css"></style>
