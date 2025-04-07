<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <RouterLink to="/" class="logo">
          <span class="logo-text">Kenya Travel</span>
        </RouterLink>

        <nav class="main-nav">
          <ul class="nav-list">
            <li class="nav-item">
              <RouterLink to="/destinations" class="nav-link">Destinations</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/about" class="nav-link">About</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/contact" class="nav-link">Contact</RouterLink>
            </li>
          </ul>
        </nav>

        <div class="auth-actions">
          <template v-if="authStore.user">
            <RouterLink
              v-if="authStore.user.role === 'admin'"
              to="/admin"
              class="btn btn-outline btn-sm mr-2"
            >
              Admin
            </RouterLink>
            <RouterLink to="/dashboard" class="btn btn-outline btn-sm mr-2"> Dashboard </RouterLink>
            <button @click="authStore.logout" class="btn btn-danger btn-sm">Logout</button>
          </template>
          <template v-else>
            <RouterLink to="/login" class="btn btn-outline btn-sm mr-2"> Login </RouterLink>
            <RouterLink to="/register" class="btn btn-primary btn-sm"> Register </RouterLink>
          </template>
        </div>

        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <Bars3Icon class="h-6 w-6" />
        </button>
      </div>

      <Transition name="slide-down">
        <div v-if="isMobileMenuOpen" class="mobile-menu">
          <ul class="mobile-nav-list">
            <li class="mobile-nav-item">
              <RouterLink to="/destinations" class="mobile-nav-link" @click="closeMobileMenu">
                Destinations
              </RouterLink>
            </li>
            <li class="mobile-nav-item">
              <RouterLink to="/about" class="mobile-nav-link" @click="closeMobileMenu">
                About
              </RouterLink>
            </li>
            <li class="mobile-nav-item">
              <RouterLink to="/contact" class="mobile-nav-link" @click="closeMobileMenu">
                Contact
              </RouterLink>
            </li>
            <template v-if="authStore.user">
              <li class="mobile-nav-item">
                <RouterLink
                  v-if="authStore.user.role === 'admin'"
                  to="/admin"
                  class="mobile-nav-link"
                  @click="closeMobileMenu"
                >
                  Admin
                </RouterLink>
              </li>
              <li class="mobile-nav-item">
                <RouterLink to="/dashboard" class="mobile-nav-link" @click="closeMobileMenu">
                  Dashboard
                </RouterLink>
              </li>
              <li class="mobile-nav-item">
                <button @click="handleLogout" class="mobile-nav-link text-left w-full">
                  Logout
                </button>
              </li>
            </template>
            <template v-else>
              <li class="mobile-nav-item">
                <RouterLink to="/login" class="mobile-nav-link" @click="closeMobileMenu">
                  Login
                </RouterLink>
              </li>
              <li class="mobile-nav-item">
                <RouterLink to="/register" class="mobile-nav-link" @click="closeMobileMenu">
                  Register
                </RouterLink>
              </li>
            </template>
          </ul>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { Bars3Icon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleLogout = () => {
  authStore.logout()
  closeMobileMenu()
}
</script>

<style lang="scss" scoped>
@use '@/assets/scss/_variables' as *;

.app-header {
  background-color: $white;
  box-shadow: $shadow-sm;
  position: sticky;
  top: 0;
  z-index: 50;
  padding: $spacing-4 0;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $primary;
  text-decoration: none;

  &:hover {
    color: $primary-hover;
  }
}

.main-nav {
  @media (max-width: $breakpoint-md) {
    display: none;
  }
}

.nav-list {
  display: flex;
  list-style: none;
}

.nav-item {
  margin-right: $spacing-4;
}

.nav-link {
  color: $gray-700;
  font-weight: $font-weight-medium;
  padding: $spacing-2 $spacing-3;
  border-radius: $rounded-md;
  transition: all 0.2s ease;

  &:hover {
    color: $primary;
    background-color: $gray-50;
  }

  &.router-link-active {
    color: $primary;
  }
}

.auth-actions {
  display: flex;
  align-items: center;

  @media (max-width: $breakpoint-md) {
    display: none;
  }
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: $gray-700;
  cursor: pointer;

  @media (max-width: $breakpoint-md) {
    display: block;
  }
}

.mobile-menu {
  display: none;
  margin-top: $spacing-4;
  padding: $spacing-4;
  background-color: $white;
  border-radius: $rounded-md;
  box-shadow: $shadow-md;

  @media (max-width: $breakpoint-md) {
    display: block;
  }
}

.mobile-nav-list {
  list-style: none;
}

.mobile-nav-item {
  margin-bottom: $spacing-2;
}

.mobile-nav-link {
  display: block;
  padding: $spacing-2 $spacing-3;
  color: $gray-700;
  border-radius: $rounded-md;
  transition: all 0.2s ease;

  &:hover {
    color: $primary;
    background-color: $gray-50;
  }

  &.router-link-active {
    color: $primary;
    background-color: $gray-50;
  }
}

// Slide down transition
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
}
</style>
