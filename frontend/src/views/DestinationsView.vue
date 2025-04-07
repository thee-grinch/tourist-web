<template>
  <div class="destinations-view">
    <div class="container">
      <div class="destinations-header">
        <h1 class="destinations-title">Explore Kenya's Destinations</h1>
        <p class="destinations-subtitle">
          Discover the diverse landscapes and rich cultures of Kenya
        </p>
      </div>

      <div class="destinations-layout">
        <div class="filter-column">
          <DestinationFilter
            :regions="regions"
            :min-price="minPrice"
            :max-price="maxPrice"
            @filter="handleFilter"
          />
        </div>

        <div class="content-column">
          <div v-if="destinationStore.loading" class="loading-container">
            <LoadingSpinner />
          </div>

          <template v-else>
            <div class="results-header">
              <p class="results-count">
                Showing {{ destinationStore.destinations.length }} of
                {{ totalDestinations }} destinations
              </p>

              <div class="sort-options">
                <label for="sort" class="sort-label">Sort by:</label>
                <select id="sort" v-model="sortOption" class="sort-select">
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Rating: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>

            <div v-if="destinationStore.destinations.length === 0" class="no-results">
              <p>No destinations found matching your criteria.</p>
              <button @click="resetFilters" class="no-results-button">Reset Filters</button>
            </div>

            <div v-else class="destinations-grid">
              <DestinationCard
                v-for="destination in destinationStore.destinations"
                :key="destination._id"
                :destination="destination"
              />
            </div>

            <Pagination
              v-if="totalPages > 1"
              :current-page="currentPage"
              :total-pages="totalPages"
              @page-change="handlePageChange"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useDestinationStore } from '@/stores/destination'
import DestinationFilter from '@/components/destinations/DestinationFilter.vue'
import DestinationCard from '@/components/destinations/DestinationCard.vue'
import Pagination from '@/components/common/Pagination.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const destinationStore = useDestinationStore()

const regions = ref(['Nairobi', 'Mombasa', 'Maasai Mara', 'Amboseli', 'Tsavo', 'Diani', 'Lamu'])
const minPrice = ref(0)
const maxPrice = ref(1000)
const currentPage = ref(1)
const itemsPerPage = ref(12)
const totalDestinations = ref(0)
const totalPages = ref(1)
const sortOption = ref('price-asc')

const filters = ref({
  minPrice: minPrice.value,
  maxPrice: maxPrice.value,
  regions: [],
  minRating: null,
})

const handleFilter = (newFilters) => {
  filters.value = newFilters
  currentPage.value = 1
  fetchDestinations()
}

const resetFilters = () => {
  filters.value = {
    minPrice: minPrice.value,
    maxPrice: maxPrice.value,
    regions: [],
    minRating: null,
  }
  sortOption.value = 'price-asc'
  currentPage.value = 1
  fetchDestinations()
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchDestinations()
}

const buildQueryString = () => {
  const query = []

  // Price filter
  if (filters.value.minPrice !== minPrice.value) {
    query.push(`price[gte]=${filters.value.minPrice}`)
  }
  if (filters.value.maxPrice !== maxPrice.value) {
    query.push(`price[lte]=${filters.value.maxPrice}`)
  }

  // Region filter
  if (filters.value.regions.length > 0) {
    query.push(`region[in]=${filters.value.regions.join(',')}`)
  }

  // Rating filter
  if (filters.value.minRating) {
    query.push(`rating[gte]=${filters.value.minRating}`)
  }

  // Pagination
  query.push(`page=${currentPage.value}`)
  query.push(`limit=${itemsPerPage.value}`)

  // Sorting
  let sortField = 'price'
  let sortOrder = 'asc'

  switch (sortOption.value) {
    case 'price-desc':
      sortField = 'price'
      sortOrder = 'desc'
      break
    case 'rating-desc':
      sortField = 'rating'
      sortOrder = 'desc'
      break
    case 'name-asc':
      sortField = 'name'
      sortOrder = 'asc'
      break
    case 'name-desc':
      sortField = 'name'
      sortOrder = 'desc'
      break
  }

  query.push(`sort=${sortField},${sortOrder}`)

  return query.join('&')
}

const fetchDestinations = async () => {
  const query = buildQueryString()
  await destinationStore.fetchDestinations(query)

  // Update pagination info (would normally come from API)
  totalDestinations.value = destinationStore.destinations.length * 3 // Mock value
  totalPages.value = Math.ceil(totalDestinations.value / itemsPerPage.value)
}

watch(sortOption, () => {
  fetchDestinations()
})

onMounted(() => {
  fetchDestinations()
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.destinations-view {
  padding: $spacing-8 0;
}

.destinations-header {
  text-align: center;
  margin-bottom: $spacing-8;
}

.destinations-title {
  font-size: $font-size-3xl;
  font-weight: $font-weight-bold;
  color: $gray-900;
  margin-bottom: $spacing-2;

  @media (min-width: $breakpoint-md) {
    font-size: $font-size-4xl;
  }
}

.destinations-subtitle {
  font-size: $font-size-lg;
  color: $gray-600;
  max-width: 600px;
  margin: 0 auto;
}

.destinations-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-8;

  @media (min-width: $breakpoint-lg) {
    grid-template-columns: 300px 1fr;
  }
}

.filter-column {
  @media (max-width: $breakpoint-lg) {
    order: 2;
  }
}

.content-column {
  @media (max-width: $breakpoint-lg) {
    order: 1;
  }
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-4;
}

.results-count {
  color: $gray-600;
  font-size: $font-size-sm;
}

.sort-options {
  display: flex;
  align-items: center;
}

.sort-label {
  margin-right: $spacing-2;
  font-size: $font-size-sm;
  color: $gray-600;
}

.sort-select {
  padding: $spacing-1 $spacing-2;
  border: 1px solid $gray-300;
  border-radius: $rounded-md;
  font-size: $font-size-sm;
  background-color: $white;

  &:focus {
    outline: none;
    border-color: $primary;
  }
}

.no-results {
  text-align: center;
  padding: $spacing-8;
  background-color: $gray-50;
  border-radius: $rounded-md;

  p {
    margin-bottom: $spacing-4;
    color: $gray-600;
  }
}

.no-results-button {
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
}

.destinations-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: $spacing-4;
  margin-bottom: $spacing-8;

  @media (min-width: $breakpoint-sm) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: $breakpoint-lg) {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
