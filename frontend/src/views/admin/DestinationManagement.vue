<template>
  <div class="destinations-management">
    <div class="management-header">
      <h2 class="management-title">Manage Destinations</h2>
      <button @click="openAddModal" class="add-button">
        <PlusIcon class="h-5 w-5" />
        <span>Add Destination</span>
      </button>
    </div>

    <div v-if="destinationStore.loading" class="loading-container">
      <LoadingSpinner />
    </div>

    <template v-else>
      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search destinations..."
          class="search-input"
        />
        <MagnifyingGlassIcon class="search-icon" />
      </div>

      <div class="destinations-table">
        <table class="table">
          <thead class="table-header">
            <tr>
              <th class="table-heading">Name</th>
              <th class="table-heading">Region</th>
              <th class="table-heading">Price</th>
              <th class="table-heading">Rating</th>
              <th class="table-heading">Actions</th>
            </tr>
          </thead>
          <tbody class="table-body">
            <tr
              v-for="destination in filteredDestinations"
              :key="destination._id"
              class="table-row"
            >
              <td class="table-cell">
                <div class="destination-info">
                  <img
                    :src="destination.images[0] || '/images/placeholder.jpg'"
                    :alt="destination.name"
                    class="destination-image"
                  />
                  <span>{{ destination.name }}</span>
                </div>
              </td>
              <td class="table-cell">{{ destination.region }}</td>
              <td class="table-cell">${{ destination.price }}</td>
              <td class="table-cell">
                <div class="rating">
                  <StarIcon
                    v-for="i in 5"
                    :key="i"
                    class="star"
                    :class="i <= Math.round(destination.rating) ? 'filled' : 'empty'"
                  />
                  <span class="rating-value">{{ destination.rating.toFixed(1) }}</span>
                </div>
              </td>
              <td class="table-cell">
                <div class="actions">
                  <button @click="openEditModal(destination)" class="action-button edit">
                    <PencilSquareIcon class="h-4 w-4" />
                  </button>
                  <button @click="confirmDelete(destination._id)" class="action-button delete">
                    <TrashIcon class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Pagination
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="handlePageChange"
      />
    </template>

    <DestinationModal
      :is-open="isModalOpen"
      :destination="currentDestination"
      :is-editing="isEditing"
      @close="closeModal"
      @save="saveDestination"
    />

    <ConfirmationModal
      :is-open="isDeleteModalOpen"
      title="Delete Destination"
      message="Are you sure you want to delete this destination? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="deleteDestination"
      @cancel="closeDeleteModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  StarIcon,
} from '@heroicons/vue/24/outline'
import { useDestinationStore } from '@/stores/destination'
import DestinationModal from '@/components/admin/DestinationModal.vue'
import ConfirmationModal from '@/components/common/ConfirmationModal.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Pagination from '@/components/common/Pagination.vue'

const destinationStore = useDestinationStore()

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalPages = ref(1)
const isModalOpen = ref(false)
const isEditing = ref(false)
const isDeleteModalOpen = ref(false)
const currentDestination = ref(null)
const destinationToDelete = ref(null)

const filteredDestinations = computed(() => {
  if (!searchQuery.value) {
    return destinationStore.destinations
  }

  const query = searchQuery.value.toLowerCase()
  return destinationStore.destinations.filter(
    (destination) =>
      destination.name.toLowerCase().includes(query) ||
      destination.region.toLowerCase().includes(query) ||
      destination.description.toLowerCase().includes(query),
  )
})

const openAddModal = () => {
  currentDestination.value = {
    name: '',
    region: '',
    price: 0,
    description: '',
    features: [],
    images: [],
  }
  isEditing.value = false
  isModalOpen.value = true
}

const openEditModal = (destination) => {
  currentDestination.value = { ...destination }
  isEditing.value = true
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveDestination = async (destinationData) => {
  if (isEditing.value) {
    await destinationStore.updateDestination(destinationData)
  } else {
    await destinationStore.createDestination(destinationData)
  }
  closeModal()
}

const confirmDelete = (id) => {
  destinationToDelete.value = id
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  destinationToDelete.value = null
}

const deleteDestination = async () => {
  if (destinationToDelete.value) {
    await destinationStore.deleteDestination(destinationToDelete.value)
    closeDeleteModal()
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  // Fetch destinations for the new page
}

onMounted(() => {
  destinationStore.fetchDestinations()
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.destinations-management {
  padding: $spacing-6;
}

.management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-6;
}

.management-title {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $gray-900;
}

.add-button {
  display: flex;
  align-items: center;
  padding: $spacing-2 $spacing-4;
  background-color: $primary;
  color: $white;
  border: none;
  border-radius: $rounded-md;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: $primary-hover;
  }

  svg {
    margin-right: $spacing-2;
  }
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.search-bar {
  position: relative;
  margin-bottom: $spacing-4;
}

.search-input {
  width: 100%;
  padding: $spacing-2 $spacing-3 $spacing-2 $spacing-10;
  border: 1px solid $gray-300;
  border-radius: $rounded-md;
  font-size: $font-size-base;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: $primary;
    box-shadow: 0 0 0 1px $primary;
  }
}

.search-icon {
  position: absolute;
  left: $spacing-3;
  top: 50%;
  transform: translateY(-50%);
  color: $gray-400;
  width: $spacing-5;
  height: $spacing-5;
}

.destinations-table {
  overflow-x: auto;
  margin-bottom: $spacing-6;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table-header {
  background-color: $gray-50;
}

.table-heading {
  padding: $spacing-3 $spacing-4;
  text-align: left;
  font-weight: $font-weight-semibold;
  color: $gray-700;
  border-bottom: 1px solid $gray-200;
}

.table-body {
  background-color: $white;
}

.table-row {
  border-bottom: 1px solid $gray-200;

  &:hover {
    background-color: $gray-50;
  }
}

.table-cell {
  padding: $spacing-3 $spacing-4;
  vertical-align: middle;
}

.destination-info {
  display: flex;
  align-items: center;
}

.destination-image {
  width: 40px;
  height: 40px;
  border-radius: $rounded-md;
  object-fit: cover;
  margin-right: $spacing-3;
}

.rating {
  display: flex;
  align-items: center;
}

.star {
  width: $spacing-4;
  height: $spacing-4;

  &.filled {
    color: $warning;
  }

  &.empty {
    color: $gray-300;
  }
}

.rating-value {
  margin-left: $spacing-2;
  font-size: $font-size-sm;
  color: $gray-600;
}

.actions {
  display: flex;
  gap: $spacing-2;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: $spacing-8;
  height: $spacing-8;
  border-radius: $rounded-md;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &.edit {
    background-color: $gray-100;
    color: $gray-700;

    &:hover {
      background-color: $gray-200;
    }
  }

  &.delete {
    background-color: lighten($danger, 40%);
    color: $danger;

    &:hover {
      background-color: lighten($danger, 35%);
    }
  }
}
</style>
