<template>
  <div class="admin-dashboard">
    <div class="admin-header">
      <h1 class="admin-title">Admin Dashboard</h1>
      <p class="admin-subtitle">Manage your travel platform</p>
    </div>

    <div class="admin-stats">
      <div class="stat-card">
        <div class="stat-icon bg-blue-100 text-blue-600">
          <UsersIcon class="h-6 w-6" />
        </div>
        <div class="stat-content">
          <h3 class="stat-title">Total Users</h3>
          <p class="stat-value">1,245</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon bg-green-100 text-green-600">
          <MapPinIcon class="h-6 w-6" />
        </div>
        <div class="stat-content">
          <h3 class="stat-title">Destinations</h3>
          <p class="stat-value">42</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon bg-purple-100 text-purple-600">
          <CalendarIcon class="h-6 w-6" />
        </div>
        <div class="stat-content">
          <h3 class="stat-title">Bookings</h3>
          <p class="stat-value">367</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon bg-yellow-100 text-yellow-600">
          <BanknotesIcon class="h-6 w-6" />
        </div>
        <div class="stat-content">
          <h3 class="stat-title">Revenue</h3>
          <p class="stat-value">$24,589</p>
        </div>
      </div>
    </div>

    <div class="admin-content">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { UsersIcon, MapPinIcon, CalendarIcon, BanknotesIcon } from '@heroicons/vue/24/outline'
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.admin-dashboard {
  padding: $spacing-6;
}

.admin-header {
  margin-bottom: $spacing-8;
}

.admin-title {
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $gray-900;
  margin-bottom: $spacing-2;
}

.admin-subtitle {
  color: $gray-600;
}

.admin-stats {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: $spacing-4;
  margin-bottom: $spacing-8;

  @media (min-width: $breakpoint-sm) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: $breakpoint-lg) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat-card {
  display: flex;
  align-items: center;
  background-color: $white;
  border-radius: $rounded-lg;
  box-shadow: $shadow-sm;
  padding: $spacing-4;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: $rounded-full;
  margin-right: $spacing-4;

  svg {
    width: 24px;
    height: 24px;
  }
}

.stat-content {
  flex: 1;
}

.stat-title {
  font-size: $font-size-sm;
  color: $gray-500;
  margin-bottom: $spacing-1;
}

.stat-value {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $gray-900;
}

.admin-content {
  background-color: $white;
  border-radius: $rounded-lg;
  box-shadow: $shadow-sm;
  padding: $spacing-6;
}
</style>
