<template>
  <div class="signup__field">
    <label class="signup__label" :for="id">{{ label }}</label>
    <input
      :id="id"
      class="signup__input"
      :type="type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      required
    >
  </div>
</template>

<script>
export default {
  name: 'SignupInput',
  emits: ['update:modelValue'],
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
    },
    modelValue: {
      type: String,
      default: ''
    }
  }
}
</script>
