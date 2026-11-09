<template>
  <button class="login__submit" type="submit" :disabled="disabled">
    {{ disabled ? 'Iniciando sesión…' : 'Iniciar sesión' }}
  </button>
</template>

<script>
export default {
  name: 'LoginSubmitButton',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>
