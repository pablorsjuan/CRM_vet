<template>
  <div class="forgot-password__field">
    <label class="forgot-password__label" :for="id">{{ label }}</label>
    <input
      :id="id"
      class="forgot-password__input"
      :type="type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      required
    >
  </div>
</template>

<script>
export default {
  name: 'ForgotPasswordInput',
  props: {
    id: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    autocomplete: {
      type: String,
      default: 'off'
    }
  }
}
</script>
