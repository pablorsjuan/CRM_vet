<template>
  <main class="signup">
    <section class="signup__card" aria-labelledby="signup-title">
      <SignupTitle />

      <form class="signup__form" @submit.prevent="submitRegistration">
        <SignupInput
          id="signup-nombre"
          v-model="form.nombre_usuario"
          label="Nombre completo"
          placeholder="Ingresa tu nombre"
          autocomplete="name"
        />
        <SignupInput
          id="signup-usuario"
          v-model="form.usuario"
          label="Usuario"
          placeholder="Crea tu nombre de usuario"
          autocomplete="username"
        />
        <SignupInput
          id="signup-contrasena"
          v-model="form.contrasena"
          label="Contraseña"
          type="password"
          placeholder="Crea una contraseña"
          autocomplete="new-password"
        />
        <SignupInput
          id="signup-correo"
          v-model="form.email"
          label="Correo electrónico"
          type="email"
          placeholder="nombre@ejemplo.com"
          autocomplete="email"
        />
        <SignupInput
          id="signup-celular"
          v-model="form.num_celular"
          label="Celular"
          type="tel"
          placeholder="+57 123456789"
          autocomplete="tel"
        />
        <div class="signup__field">
          <label class="signup__label" for="signup-sexo">Sexo</label>
          <select id="signup-sexo" v-model="form.sexo" class="signup__input" required>
            <option disabled value="">Selecciona una opción</option>
            <option value="Femenino">Femenino</option>
            <option value="Masculino">Masculino</option>
            <option value="Otro">Otro</option>
            <option value="Prefiero no decirlo">Prefiero no decirlo</option>
          </select>
        </div>
        <SignupInput
          id="signup-fecha-nacimiento"
          v-model="form.fecha_nacimiento"
          label="Fecha de nacimiento"
          type="date"
          :max="maxBirthDate"
          autocomplete="bday"
        />

        <SignupSubmitButton :disabled="isSubmitting" />
        <p v-if="statusMessage" class="signup__status" :role="isError ? 'alert' : 'status'">
          {{ statusMessage }}
        </p>
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
import { registerUser } from '@/services/authApi'

export default {
  name: 'SignUpView',
  components: {
    SignupInput,
    SignupSubmitButton,
    SignupTitle
  },
  data() {
    const today = new Date()
    const maxBirthDate = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0')
    ].join('-')

    return {
      form: {
        nombre_usuario: '',
        usuario: '',
        contrasena: '',
        email: '',
        num_celular: '',
        sexo: '',
        fecha_nacimiento: ''
      },
      maxBirthDate,
      isSubmitting: false,
      isError: false,
      statusMessage: ''
    }
  },
  methods: {
    async submitRegistration() {
      this.isSubmitting = true
      this.isError = false
      this.statusMessage = ''
      try {
        await registerUser(this.form)
        this.statusMessage = 'Cuenta creada correctamente. Ya puedes iniciar sesión.'
        await this.$router.push('/login')
      } catch (error) {
        this.isError = true
        this.statusMessage = error.message
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style src="@/assets/css/Sign_up.css"></style>
