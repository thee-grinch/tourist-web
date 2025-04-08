<template>
  <div class="feature-card" :class="{ 'has-bg': hasBg }">
    <div class="feature-icon" v-if="icon">
      <component :is="icon" class="h-8 w-8" />
    </div>
    <div class="feature-icon-image" v-if="iconImage">
      <img :src="iconImage" :alt="title" class="h-12 w-12" />
    </div>
    <h3 class="feature-title">{{ title }}</h3>
    <p class="feature-description">{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: [Object, String],
    default: null
  },
  iconImage: {
    type: String,
    default: null
  },
  hasBg: {
    type: Boolean,
    default: true
  }
})
</script>

<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;
@use 'sass:color';

.feature-card {
  padding: $spacing-6;
  border-radius: $rounded-lg;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &.has-bg {
    background-color: $white;
    box-shadow: $shadow-sm;
    
    &:hover {
      transform: translateY(-8px);
      box-shadow: $shadow-md;
    }
  }
  
  &:not(.has-bg) {
    &:hover .feature-icon, 
    &:hover .feature-icon-image {
      transform: scale(1.1);
    }
  }
}

.feature-icon,
.feature-icon-image {
  margin-bottom: $spacing-4;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  width: 64px;
  border-radius: 50%;
  background-color: rgba($primary, 0.1);
  color: $primary;
  transition: all 0.3s ease;
  
  img {
    object-fit: contain;
  }
}

.feature-title {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  margin-bottom: $spacing-2;
  color: $gray-900;
}

.feature-description {
  color: $gray-600;
  line-height: 1.6;
  margin-top: auto;
}
</style>