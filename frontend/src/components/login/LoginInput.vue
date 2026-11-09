<template>
  <div class="login__field">
    <label class="login__label" :for="id">{{ label }}</label>
    <input
      :id="id"
      class="login__input"
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
  name: 'LoginInput',
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
