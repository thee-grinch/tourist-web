<template>
  <RouterLink
    :to="{ name: 'destination', params: { id: destination._id } }"
    class="destination-card"
  >
    <div class="card-image-container">
      <img
        :src="destination.images[0] || '/images/placeholder.jpg'"
        :alt="destination.name"
        class="card-image"
      />
      <div class="card-rating">
        <StarIcon class="h-4 w-4 fill-current" />
        <span>{{ destination.rating.toFixed(1) }}</span>
      </div>
    </div>
    <div class="card-content">
      <h3 class="card-title">{{ destination.name }}</h3>
      <p class="card-location">
        <MapPinIcon class="h-4 w-4" />
        {{ destination.region }}
      </p>
      <p class="card-description">{{ truncateDescription(destination.description) }}</p>
      <div class="card-footer">
        <span class="card-price"
          >From ${{ destination.price }}<span class="text-sm"> / night</span></span
        >
        <button class="card-button">View Details</button>
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
import { StarIcon, MapPinIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  destination: {
    type: Object,
    required: true,
  },
})

const truncateDescription = (text) => {
  if (!text) return ''
  if (text.length > 100) {
    return text.substring(0, 100) + '...'
  }
  return text
}
</script>

<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;
@use 'sass:color';

.destination-card {
  display: block;
  background-color: $white;
  border-radius: $rounded-lg;
  overflow: hidden;
  box-shadow: $shadow;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  height: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;
  }
}

.card-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  .destination-card:hover & {
    transform: scale(1.05);
  }
}

.card-rating {
  position: absolute;
  top: $spacing-2;
  right: $spacing-2;
  display: flex;
  align-items: center;
  background-color: rgba($white, 0.9);
  padding: $spacing-1 $spacing-2;
  border-radius: $rounded-full;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;

  svg {
    color: $warning;
    margin-right: $spacing-1;
  }
}

.card-content {
  padding: $spacing-4;
}

.card-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  margin-bottom: $spacing-2;
}

.card-location {
  display: flex;
  align-items: center;
  color: $gray-600;
  font-size: $font-size-sm;
  margin-bottom: $spacing-3;

  svg {
    margin-right: $spacing-1;
    color: $danger;
  }
}

.card-description {
  color: $gray-600;
  margin-bottom: $spacing-4;
  font-size: $font-size-sm;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.card-price {
  font-weight: $font-weight-bold;
  color: $primary;
  font-size: $font-size-lg;
}

.card-button {
  padding: $spacing-1 $spacing-3;
  background-color: $primary;
  color: $white;
  border-radius: $rounded-md;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: $primary-hover;
  }
}
</style>
