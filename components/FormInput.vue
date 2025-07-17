<!-- filepath: components/FormInput.vue -->
<template>
  <div class="form-group">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <div class="relative">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        @input="updateValue"
        @blur="$emit('blur')"
        @focus="$emit('focus')"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :maxlength="maxlength"
        :minlength="minlength"
        :pattern="pattern"
        :autocomplete="autocomplete"
        :class="[
          'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors duration-200',
          error
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500',
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
        ]"
      />
    </div>

    <!-- Error message -->
    <p v-if="error" class="mt-1 text-sm text-red-600 flex items-center">
      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      {{ error }}
    </p>

    <!-- Help text -->
    <p v-if="help && !error" class="mt-1 text-sm text-gray-500">
      {{ help }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  label: String,
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'email', 'password', 'number', 'tel', 'url', 'search'].includes(value)
  },
  modelValue: [String, Number],
  placeholder: String,
  required: Boolean,
  disabled: Boolean,
  error: String,
  help: String,
  maxlength: Number,
  minlength: Number,
  pattern: String,
  autocomplete: String
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

const sanitizeInput = (value) => {
  if (typeof value !== 'string') return value

  // Basic XSS prevention - remove dangerous characters
  return value
    .replace(/[<>]/g, '') // Remove < and >
    .trim()
}

const updateValue = (event) => {
  const sanitizedValue = sanitizeInput(event.target.value)
  emit('update:modelValue', sanitizedValue)
}
</script>