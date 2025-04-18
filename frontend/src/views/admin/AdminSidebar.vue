<template>
  <aside class="admin-sidebar">
    <nav>
      <ul class="menu">
        <li>
          <router-link to="/admin/dashboard" class="menu-item" active-class="active">
            <span class="icon"><DashboardIcon /></span>
            <span class="label">Dashboard</span>
          </router-link>
        </li>
        <li>
          <router-link to="/admin/destinations" class="menu-item" active-class="active">
            <span class="icon"><MapPinIcon /></span>
            <span class="label">Destinations</span>
          </router-link>
        </li>
        <li>
          <router-link to="/admin/bookings" class="menu-item" active-class="active">
            <span class="icon"><CalendarIcon /></span>
            <span class="label">Bookings</span>
          </router-link>
        </li>
        <li>
          <router-link to="/admin/users" class="menu-item" active-class="active">
            <span class="icon"><UsersIcon /></span>
            <span class="label">Users</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import DashboardIcon from '@/assets/icons/DashboardIcon.vue';
import MapPinIcon from '@/assets/icons/MapPinIcon.vue';
import CalendarIcon from '@/assets/icons/CalendarIcon.vue';
import UsersIcon from '@/assets/icons/UsersIcon.vue';
</script>

<style scoped>
.admin-sidebar {
  width: 250px;
  background-color: #1a202c;
  color: #fff;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  padding: 1rem;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #cbd5e0;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #2d3748;
  }
}

.menu-item.active {
  background-color: #4a5568;
  color: #fff;
}

.icon {
  margin-right: 0.75rem;
}
</style>