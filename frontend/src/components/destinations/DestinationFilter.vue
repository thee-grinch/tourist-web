<template>
  <div class="destination-filter">
    <div class="filter-header">
      <h3 class="filter-title">Filter Destinations</h3>
      <button v-if="isFilterActive" @click="resetFilters" class="filter-reset">
        Reset Filters
      </button>
    </div>

    <div class="filter-section">
      <h4 class="filter-subtitle">Price Range</h4>
      <div class="price-range">
        <div class="price-inputs">
          <div class="price-input-group">
            <label class="price-label">Min</label>
            <input type="number" v-model="priceRange[0]" class="price-input" placeholder="0" />
          </div>
          <div class="price-input-group">
            <label class="price-label">Max</label>
            <input type="number" v-model="priceRange[1]" class="price-input" placeholder="1000" />
          </div>
        </div>
        <div class="price-slider">
          <input
            type="range"
            v-model="priceRange[0]"
            :min="minPrice"
            :max="maxPrice"
            class="range-input"
            @input="updatePriceRange"
          />
          <input
            type="range"
            v-model="priceRange[1]"
            :min="minPrice"
            :max="maxPrice"
            class="range-input"
            @input="updatePriceRange"
          />
        </div>
      </div>
    </div>

    <div class="filter-section">
      <h4 class="filter-subtitle">Regions</h4>
      <div class="region-options">
        <label v-for="region in regions" :key="region" class="region-option">
          <input
            type="checkbox"
            v-model="selectedRegions"
            :value="region"
            class="region-checkbox"
          />
          <span class="region-label">{{ region }}</span>
        </label>
      </div>
    </div>

    <div class="filter-section">
      <h4 class="filter-subtitle">Rating</h4>
      <div class="rating-options">
        <label v-for="rating in [5, 4, 3, 2, 1]" :key="rating" class="rating-option">
          <input type="radio" v-model="selectedRating" :value="rating" class="rating-radio" />
          <div class="rating-stars">
            <StarIcon
              v-for="i in 5"
              :key="i"
              class="star-icon"
              :class="i <= rating ? 'filled' : 'empty'"
            />
          </div>
          <span v-if="rating === 5" class="rating-text">& up</span>
        </label>
      </div>
    </div>

    <button @click="applyFilters" class="filter-apply">Apply Filters</button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { StarIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  regions: {
    type: Array,
    required: true,
  },
  minPrice: {
    type: Number,
    default: 0,
  },
  maxPrice: {
    type: Number,
    default: 1000,
  },
})

const emit = defineEmits(['filter'])

const priceRange = ref([props.minPrice, props.maxPrice])
const selectedRegions = ref([])
const selectedRating = ref(null)

const isFilterActive = computed(() => {
  return (
    priceRange.value[0] !== props.minPrice ||
    priceRange.value[1] !== props.maxPrice ||
    selectedRegions.value.length > 0 ||
    selectedRating.value !== null
  )
})

const updatePriceRange = () => {
  if (priceRange.value[0] > priceRange.value[1]) {
    const temp = priceRange.value[0]
    priceRange.value[0] = priceRange.value[1]
    priceRange.value[1] = temp
  }
}

const applyFilters = () => {
  emit('filter', {
    minPrice: priceRange.value[0],
    maxPrice: priceRange.value[1],
    regions: selectedRegions.value,
    minRating: selectedRating.value,
  })
}

const resetFilters = () => {
  priceRange.value = [props.minPrice, props.maxPrice]
  selectedRegions.value = []
  selectedRating.value = null
  applyFilters()
}

watch(
  () => props.minPrice,
  (newVal) => {
    priceRange.value[0] = newVal
  },
)

watch(
  () => props.maxPrice,
  (newVal) => {
    priceRange.value[1] = newVal
  },
)
</script>

<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;

.destination-filter {
  background-color: $white;
  border-radius: $rounded-lg;
  padding: $spacing-4;
  box-shadow: $shadow;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-4;
}

.filter-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $gray-800;
}

.filter-reset {
  font-size: $font-size-sm;
  color: $primary;
  background: none;
  border: none;
  cursor: pointer;
  padding: $spacing-1 $spacing-2;

  &:hover {
    text-decoration: underline;
  }
}

.filter-section {
  margin-bottom: $spacing-6;
}

.filter-subtitle {
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  color: $gray-700;
  margin-bottom: $spacing-3;
}

.price-range {
  margin-top: $spacing-4;
}

.price-inputs {
  display: flex;
  gap: $spacing-4;
  margin-bottom: $spacing-4;
}

.price-input-group {
  flex: 1;
}

.price-label {
  display: block;
  font-size: $font-size-sm;
  color: $gray-600;
  margin-bottom: $spacing-1;
}

.price-input {
  width: 100%;
  padding: $spacing-2;
  border: 1px solid $gray-300;
  border-radius: $rounded-md;
  font-size: $font-size-sm;

  &:focus {
    outline: none;
    border-color: $primary;
    box-shadow: 0 0 0 1px $primary;
  }
}

.price-slider {
  position: relative;
  height: $spacing-4;
}

.range-input {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-appearance: none;
  background: none;
  pointer-events: none;

  &::-webkit-slider-thumb {
    pointer-events: auto;
    -webkit-appearance: none;
    width: $spacing-4;
    height: $spacing-4;
    background-color: $primary;
    border-radius: $rounded-full;
    cursor: pointer;
  }
}

.region-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-2;
}

.region-option {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.region-checkbox {
  margin-right: $spacing-2;
  cursor: pointer;
}

.region-label {
  font-size: $font-size-sm;
  color: $gray-700;
}

.rating-options {
  display: flex;
  flex-direction: column;
  gap: $spacing-2;
}

.rating-option {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.rating-radio {
  margin-right: $spacing-2;
  cursor: pointer;
}

.rating-stars {
  display: flex;
  margin-right: $spacing-1;
}

.star-icon {
  width: $spacing-4;
  height: $spacing-4;

  &.filled {
    color: $warning;
  }

  &.empty {
    color: $gray-300;
  }
}

.rating-text {
  font-size: $font-size-sm;
  color: $gray-600;
}

.filter-apply {
  width: 100%;
  padding: $spacing-2;
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
</style>
