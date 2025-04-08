<template>
  <div class="dashboard-view">
    <div class="container">
      <div class="dashboard-header">
        <h1 class="dashboard-title">Welcome, {{ authStore.user?.name }}</h1>
        <p class="dashboard-subtitle">Manage your bookings and profile</p>
      </div>

      <div class="dashboard-grid">
        <div class="dashboard-sidebar">
          <nav class="dashboard-nav">
            <RouterLink
              to="/dashboard"
              class="dashboard-nav-link"
              :class="{ active: $route.path === '/dashboard' }"
              exact
            >
              <UserIcon class="h-5 w-5" />
              <span>Profile</span>
            </RouterLink>
            <RouterLink
              to="/dashboard/bookings"
              class="dashboard-nav-link"
              :class="{ active: $route.path === '/dashboard/bookings' }"
            >
              <CalendarIcon class="h-5 w-5" />
              <span>My Bookings</span>
            </RouterLink>
            <RouterLink
              to="/dashboard/reviews"
              class="dashboard-nav-link"
              :class="{ active: $route.path === '/dashboard/reviews' }"
            >
              <StarIcon class="h-5 w-5" />
              <span>My Reviews</span>
            </RouterLink>
            <button @click="authStore.logout" class="dashboard-nav-link">
              <ArrowLeftOnRectangleIcon class="h-5 w-5" />
              <span>Logout</span>
            </button>
          </nav>
        </div>

        <div class="dashboard-content">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  UserIcon,
  CalendarIcon,
  StarIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;
@use 'sass:color';

.dashboard-view {
  padding: $spacing-8 0;
}

.dashboard-header {
  margin-bottom: $spacing-8;
}

.dashboard-title {
  font-size: $font-size-3xl;
  font-weight: $font-weight-bold;
  color: $gray-900;
  margin-bottom: $spacing-2;
}

.dashboard-subtitle {
  color: $gray-600;
  font-size: $font-size-lg;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-8;

  @media (min-width: $breakpoint-lg) {
    grid-template-columns: 250px 1fr;
  }
}

.dashboard-sidebar {
  @media (max-width: $breakpoint-lg) {
    order: 2;
  }
}

.dashboard-nav {
  display: flex;
  flex-direction: column;
  gap: $spacing-1;

  @media (max-width: $breakpoint-lg) {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

.dashboard-nav-link {
  display: flex;
  align-items: center;
  padding: $spacing-3 $spacing-4;
  border-radius: $rounded-md;
  color: $gray-700;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover:not(.active) {
    background-color: $gray-100;
    color: $gray-900;
  }

  &.active {
    background-color: $primary;
    color: $white;
  }

  svg {
    margin-right: $spacing-3;
  }

  @media (max-width: $breakpoint-lg) {
    padding: $spacing-2 $spacing-3;
    font-size: $font-size-sm;

    svg {
      margin-right: $spacing-2;
    }
  }
}

.dashboard-content {
  background-color: $white;
  border-radius: $rounded-lg;
  box-shadow: $shadow-sm;
  padding: $spacing-6;

  @media (min-width: $breakpoint-lg) {
    padding: $spacing-8;
  }
}
</style>
