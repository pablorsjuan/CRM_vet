<template>
  <button class="signup__submit" type="submit" :disabled="disabled">
    {{ disabled ? 'Creando cuenta…' : 'Crear cuenta' }}
  </button>
</template>

<script>
export default {
  name: 'SignupSubmitButton',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>
