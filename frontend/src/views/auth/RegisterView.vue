<template>
  <div class="auth-view">
    <div class="auth-container">
      <div class="auth-header">
        <h1 class="auth-title">Create Account</h1>
        <p class="auth-subtitle">Join us to start your journey</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div v-if="errorMessage" class="auth-error">
          {{ errorMessage }}
        </div>

        <div class="form-group">
          <label for="name" class="form-label">Full Name</label>
          <input
            type="text"
            id="name"
            v-model="form.name"
            class="form-input"
            :class="{ error: errors.name }"
            placeholder="Enter your full name"
            required
          />
          <span v-if="errors.name" class="form-error">{{ errors.name }}</span>
        </div>

        <div class="form-group">
          <label for="email" class="form-label">Email Address</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            class="form-input"
            :class="{ error: errors.email }"
            placeholder="Enter your email"
            required
          />
          <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            class="form-input"
            :class="{ error: errors.password }"
            placeholder="Create a password"
            required
          />
          <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
        </div>

        <div class="form-group">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="form.confirmPassword"
            class="form-input"
            :class="{ error: errors.confirmPassword }"
            placeholder="Confirm your password"
            required
          />
          <span v-if="errors.confirmPassword" class="form-error">{{ errors.confirmPassword }}</span>
        </div>

        <div class="form-actions">
          <button type="submit" class="auth-button" :disabled="isLoading">
            <span v-if="isLoading">Creating Account...</span>
            <span v-else>Create Account</span>
          </button>
        </div>

        <div class="auth-footer">
          <p class="auth-text">
            Already have an account?
            <RouterLink to="/login" class="auth-link">Sign in here</RouterLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { validateEmail } from '@/utils/validators'

const authStore = useAuthStore()
const router = useRouter()

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const errors = ref({})
const errorMessage = ref('')
const isLoading = ref(false)

const validateForm = () => {
  errors.value = {}
  let isValid = true

  if (!form.value.name) {
    errors.value.name = 'Name is required'
    isValid = false
  }

  if (!form.value.email) {
    errors.value.email = 'Email is required'
    isValid = false
  } else if (!validateEmail(form.value.email)) {
    errors.value.email = 'Please enter a valid email'
    isValid = false
  }

  if (!form.value.password) {
    errors.value.password = 'Password is required'
    isValid = false
  } else if (form.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
    isValid = false
  }

  if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  return isValid
}

const handleRegister = async () => {
  if (!validateForm()) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    await authStore.register({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
    })

    // Redirect to dashboard after successful registration
    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = error.message || 'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/scss/variables';

.auth-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: $spacing-8 $spacing-4;
  background-color: $gray-50;
}

.auth-container {
  width: 100%;
  max-width: 400px;
  background-color: $white;
  border-radius: $rounded-lg;
  box-shadow: $shadow-md;
  padding: $spacing-8;
}

.auth-header {
  text-align: center;
  margin-bottom: $spacing-8;
}

.auth-title {
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $gray-900;
  margin-bottom: $spacing-2;
}

.auth-subtitle {
  color: $gray-600;
}

.auth-form {
  margin-top: $spacing-6;
}

.auth-error {
  background-color: lighten($danger, 40%);
  color: $danger;
  padding: $spacing-3;
  border-radius: $rounded-md;
  margin-bottom: $spacing-4;
  font-size: $font-size-sm;
}

.form-group {
  margin-bottom: $spacing-4;
}

.form-label {
  display: block;
  margin-bottom: $spacing-2;
  font-weight: $font-weight-medium;
  color: $gray-700;
}

.form-input {
  width: 100%;
  padding: $spacing-2 $spacing-3;
  border: 1px solid $gray-300;
  border-radius: $rounded-md;
  font-size: $font-size-base;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: $primary;
    box-shadow: 0 0 0 3px rgba($primary, 0.1);
  }

  &.error {
    border-color: $danger;
  }
}

.form-error {
  display: block;
  margin-top: $spacing-1;
  color: $danger;
  font-size: $font-size-sm;
}

.form-actions {
  margin-top: $spacing-6;
}

.auth-button {
  width: 100%;
  padding: $spacing-3;
  background-color: $primary;
  color: $white;
  border: none;
  border-radius: $rounded-md;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: $primary-hover;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.auth-footer {
  margin-top: $spacing-4;
  text-align: center;
}

.auth-text {
  color: $gray-600;
  margin-bottom: $spacing-2;
}

.auth-link {
  color: $primary;
  font-weight: $font-weight-medium;

  &:hover {
    text-decoration: underline;
  }
}
</style>
