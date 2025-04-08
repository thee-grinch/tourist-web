<template>
  <div class="profile-view">
    <h2 class="profile-title">My Profile</h2>

    <form @submit.prevent="updateProfile" class="profile-form">
      <div v-if="successMessage" class="profile-success">
        {{ successMessage }}
      </div>

      <div class="form-row">
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
            disabled
          />
          <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
        </div>
      </div>

      <div class="form-group">
        <label for="phone" class="form-label">Phone Number</label>
        <input
          type="tel"
          id="phone"
          v-model="form.phone"
          class="form-input"
          :class="{ error: errors.phone }"
          placeholder="Enter your phone number"
        />
        <span v-if="errors.phone" class="form-error">{{ errors.phone }}</span>
      </div>

      <div class="form-group">
        <label for="address" class="form-label">Address</label>
        <textarea
          id="address"
          v-model="form.address"
          class="form-input"
          :class="{ error: errors.address }"
          placeholder="Enter your address"
          rows="3"
        ></textarea>
        <span v-if="errors.address" class="form-error">{{ errors.address }}</span>
      </div>

      <div class="form-actions">
        <button type="submit" class="profile-button" :disabled="isLoading">
          <span v-if="isLoading">Updating...</span>
          <span v-else>Update Profile</span>
        </button>
      </div>
    </form>

    <div class="profile-section">
      <h3 class="section-title">Change Password</h3>
      <form @submit.prevent="changePassword" class="password-form">
        <div v-if="passwordError" class="password-error">
          {{ passwordError }}
        </div>

        <div v-if="passwordSuccess" class="password-success">
          {{ passwordSuccess }}
        </div>

        <div class="form-group">
          <label for="currentPassword" class="form-label">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            v-model="passwordForm.currentPassword"
            class="form-input"
            :class="{ error: passwordErrors.currentPassword }"
            placeholder="Enter your current password"
            required
          />
          <span v-if="passwordErrors.currentPassword" class="form-error">{{
            passwordErrors.currentPassword
          }}</span>
        </div>

        <div class="form-group">
          <label for="newPassword" class="form-label">New Password</label>
          <input
            type="password"
            id="newPassword"
            v-model="passwordForm.newPassword"
            class="form-input"
            :class="{ error: passwordErrors.newPassword }"
            placeholder="Enter your new password"
            required
          />
          <span v-if="passwordErrors.newPassword" class="form-error">{{
            passwordErrors.newPassword
          }}</span>
        </div>

        <div class="form-group">
          <label for="confirmPassword" class="form-label">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="passwordForm.confirmPassword"
            class="form-input"
            :class="{ error: passwordErrors.confirmPassword }"
            placeholder="Confirm your new password"
            required
          />
          <span v-if="passwordErrors.confirmPassword" class="form-error">{{
            passwordErrors.confirmPassword
          }}</span>
        </div>

        <div class="form-actions">
          <button type="submit" class="password-button" :disabled="isPasswordLoading">
            <span v-if="isPasswordLoading">Changing Password...</span>
            <span v-else>Change Password</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const form = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const errors = ref({})
const passwordErrors = ref({})
const successMessage = ref('')
const passwordError = ref('')
const passwordSuccess = ref('')
const isLoading = ref(false)
const isPasswordLoading = ref(false)

onMounted(() => {
  // Initialize form with user data
  if (authStore.user) {
    form.value = {
      name: authStore.user.name || '',
      email: authStore.user.email || '',
      phone: authStore.user.phone || '',
      address: authStore.user.address || '',
    }
  }
})

const updateProfile = async () => {
  isLoading.value = true
  errors.value = {}
  successMessage.value = ''

  try {
    // Update profile logic here
    // await authStore.updateProfile(form.value);
    successMessage.value = 'Profile updated successfully!'
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      errors.value = { general: error.message || 'Failed to update profile' }
    }
  } finally {
    isLoading.value = false
  }
}

const changePassword = async () => {
  isPasswordLoading.value = true
  passwordErrors.value = {}
  passwordError.value = ''
  passwordSuccess.value = ''

  try {
    // Validate form
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      throw new Error('New passwords do not match')
    }

    if (passwordForm.value.newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }

    // Change password logic here
    // await authStore.changePassword(passwordForm.value);
    passwordSuccess.value = 'Password changed successfully!'
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  } catch (error) {
    passwordError.value = error.message || 'Failed to change password'
  } finally {
    isPasswordLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;
@use 'sass:color';

.profile-view {
  padding: $spacing-6;
}

.profile-title {
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $gray-900;
  margin-bottom: $spacing-6;
}

.profile-form,
.password-form {
  margin-bottom: $spacing-8;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: $spacing-4;
  margin-bottom: $spacing-4;

  @media (min-width: $breakpoint-md) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.profile-success {
  background-color: color.scale($success, $lightness: 40%);
  color: $success;
  padding: $spacing-3;
  border-radius: $rounded-md;
  margin-bottom: $spacing-4;
  font-size: $font-size-sm;
}

.password-error {
  background-color: color.scale($danger, $lightness: 40%);  color: $danger;
  padding: $spacing-3;
  border-radius: $rounded-md;
  margin-bottom: $spacing-4;
  font-size: $font-size-sm;
}

.password-success {
  // background-color: lighten($success, 40%);
  background-color: color.scale($success, $lightness: 40%);
  color: $success;
  padding: $spacing-3;
  border-radius: $rounded-md;
  margin-bottom: $spacing-4;
  font-size: $font-size-sm;
}

.profile-button,
.password-button {
  padding: $spacing-3 $spacing-6;
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

.profile-section {
  margin-top: $spacing-8;
  padding-top: $spacing-8;
  border-top: 1px solid $gray-200;
}

.section-title {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $gray-900;
  margin-bottom: $spacing-4;
}
</style>
