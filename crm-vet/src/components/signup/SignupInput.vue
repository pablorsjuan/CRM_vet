<template>
  <div class="signup__field">
    <label class="signup__label" :for="id">{{ label }}</label>
    <input
      :id="id"
      class="signup__input"
      :type="type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      required
    >
  </div>
</template>

<script>
export default {
  name: 'SignupInput',
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
