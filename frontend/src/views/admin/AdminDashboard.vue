<template>
  <div class="admin-dashboard">
    <AdminHeader title="Admin Dashboard" />
    <div class="admin-stats">
      <StatsCard title="Total Users" value="1,245" icon="UsersIcon" color="blue" />
      <StatsCard title="Destinations" value="42" icon="MapPinIcon" color="green" />
      <StatsCard title="Bookings" value="367" icon="CalendarIcon" color="purple" />
      <StatsCard title="Revenue" value="$24,589" icon="BanknotesIcon" color="yellow" />
    </div>
    <div class="admin-content">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import AdminHeader from '@/components/admin/AdminHeader.vue';
import StatsCard from '@/components/admin/StatsCard.vue';
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.admin-dashboard {
  padding: $spacing-6;
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

.admin-content {
  background-color: $white;
  border-radius: $rounded-lg;
  box-shadow: $shadow-sm;
  padding: $spacing-6;
}
</style>
