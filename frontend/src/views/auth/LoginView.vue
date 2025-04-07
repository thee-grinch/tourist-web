<template>
  <div class="auth-view">
    <div class="auth-container">
      <div class="auth-header">
        <h1 class="auth-title">Welcome Back</h1>
        <p class="auth-subtitle">Sign in to your account to continue</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div v-if="errorMessage" class="auth-error">
          {{ errorMessage }}
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
            placeholder="Enter your password"
            required
          />
          <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
        </div>

        <div class="form-actions">
          <button type="submit" class="auth-button" :disabled="isLoading">
            <span v-if="isLoading">Signing In...</span>
            <span v-else>Sign In</span>
          </button>
        </div>

        <div class="auth-footer">
          <p class="auth-text">
            Don't have an account?
            <RouterLink to="/register" class="auth-link">Register here</RouterLink>
          </p>
          <RouterLink to="/forgot-password" class="auth-link">Forgot password?</RouterLink>
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
  email: '',
  password: '',
})

const errors = ref({})
const errorMessage = ref('')
const isLoading = ref(false)

const validateForm = () => {
  errors.value = {}
  let isValid = true

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

  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    await authStore.login({
      email: form.value.email,
      password: form.value.password,
    })

    // Redirect to dashboard or previous page
    const redirect = router.currentRoute.value.query.redirect || '/dashboard'
    router.push(redirect)
  } catch (error) {
    errorMessage.value = error.message || 'Login failed. Please try again.'
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
