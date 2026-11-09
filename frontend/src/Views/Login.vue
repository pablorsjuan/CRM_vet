<template>
  <main class="login">
    <section class="login__card" aria-labelledby="login-title">
      <LoginTitle />

      <form class="login__form" @submit.prevent="submitLogin">
        <LoginInput
          id="usuario"
          label="Usuario"
          placeholder="Ingresa tu usuario"
          autocomplete="username"
          v-model="credentials.usuario"
        />
        <LoginInput
          id="contrasena"
          label="Contraseña"
          type="password"
          placeholder="Ingresa tu contraseña"
          autocomplete="current-password"
          v-model="credentials.contrasena"
        />

        <div class="login__actions">
          <ForgotPasswordButton />
          <LoginSubmitButton :disabled="isSubmitting" />
        </div>
        <p v-if="errorMessage" class="login__status" role="alert">{{ errorMessage }}</p>
      </form>
    </section>
  </main>
</template>

<script>
import ForgotPasswordButton from '@/components/login/ForgotPasswordButton.vue'
import LoginInput from '@/components/login/LoginInput.vue'
import LoginSubmitButton from '@/components/login/LoginSubmitButton.vue'
import LoginTitle from '@/components/login/LoginTitle.vue'
import { dashboardForRole, loginUser } from '@/services/authApi'

export default {
  name: 'LoginView',
  components: {
    ForgotPasswordButton,
    LoginInput,
    LoginSubmitButton,
    LoginTitle
  },
  data() {
    return {
      credentials: { usuario: '', contrasena: '' },
      isSubmitting: false,
      errorMessage: ''
    }
  },
  methods: {
    async submitLogin() {
      this.isSubmitting = true
      this.errorMessage = ''
      try {
        const user = await loginUser(this.credentials)
        const dashboard = dashboardForRole(user.rol)
        if (!dashboard) {
          throw new Error('Este tipo de cuenta no tiene un panel disponible.')
        }
        await this.$router.push(dashboard)
      } catch (error) {
        this.errorMessage = error.message
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style src="@/assets/css/Login.css"></style>

<!-- <FontAwesomeIcon :icon="byPrefixAndName.fas['door-open']" /> -->