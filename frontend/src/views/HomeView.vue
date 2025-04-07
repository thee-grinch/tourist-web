<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Discover Kenya's Wonders</h1>
        <p class="hero-subtitle">
          Explore breathtaking landscapes, vibrant cultures, and unforgettable adventures
        </p>
        <RouterLink to="/destinations" class="hero-button"> Explore Destinations </RouterLink>
      </div>
    </section>

    <!-- Featured Destinations -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">Featured Destinations</h2>
        <div v-if="destinationStore.loading" class="loading-container">
          <LoadingSpinner />
        </div>
        <div v-else class="destinations-grid">
          <DestinationCard
            v-for="destination in destinationStore.featuredDestinations"
            :key="destination._id"
            :destination="destination"
          />
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="section bg-gray-50">
      <div class="container">
        <h2 class="section-title">Why Choose Kenya Travel</h2>
        <div class="features-grid">
          <FeatureCard
            icon="globe"
            title="Authentic Experiences"
            description="We connect you with genuine cultural experiences that go beyond typical tourist attractions."
          />
          <FeatureCard
            icon="shield-check"
            title="Trusted Guides"
            description="Our local guides are vetted experts who know Kenya's hidden gems and best-kept secrets."
          />
          <FeatureCard
            icon="sparkles"
            title="Sustainable Travel"
            description="We're committed to eco-friendly tourism that supports local communities and preserves nature."
          />
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">What Our Travelers Say</h2>
        <TestimonialCarousel :testimonials="testimonials" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useDestinationStore } from '@/stores/destination'
import DestinationCard from '@/components/destinations/DestinationCard.vue'
import FeatureCard from '@/components/common/FeatureCard.vue'
import TestimonialCarousel from '@/components/common/TestimonialCarousel.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const destinationStore = useDestinationStore()

const testimonials = [
  {
    id: 1,
    quote:
      'The safari experience was beyond incredible. Seeing the Big Five in their natural habitat was a dream come true!',
    author: 'Sarah Johnson',
    location: 'Maasai Mara Safari',
    rating: 5,
  },
  {
    id: 2,
    quote:
      'Diani Beach was paradise. The white sand, turquoise water, and friendly locals made it a perfect getaway.',
    author: 'Michael Chen',
    location: 'Diani Beach Vacation',
    rating: 4,
  },
  {
    id: 3,
    quote:
      'Our guide in Lamu was so knowledgeable about the Swahili culture. The old town tour was fascinating!',
    author: 'Amina Hassan',
    location: 'Lamu Cultural Tour',
    rating: 5,
  },
]

onMounted(() => {
  destinationStore.fetchFeaturedDestinations()
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.home-view {
  overflow-x: hidden;
}

.hero-section {
  position: relative;
  height: 100vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
  background-size: cover;
  background-position: center;
  color: $white;
  text-align: center;
  padding: $spacing-8;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('@/assets/images/hero-bg.jpg') no-repeat center center;
    background-size: cover;
    z-index: -1;
  }
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: $font-size-4xl;
  margin-bottom: $spacing-4;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  @media (min-width: $breakpoint-md) {
    font-size: $font-size-5xl;
  }
}

.hero-subtitle {
  font-size: $font-size-xl;
  margin-bottom: $spacing-8;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  @media (min-width: $breakpoint-md) {
    font-size: $font-size-2xl;
  }
}

.hero-button {
  display: inline-block;
  padding: $spacing-3 $spacing-6;
  background-color: $primary;
  color: $white;
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  border-radius: $rounded-md;
  transition: all 0.3s ease;

  &:hover {
    background-color: $primary-hover;
    transform: translateY(-2px);
    box-shadow: $shadow-md;
  }
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.destinations-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: $spacing-6;

  @media (min-width: $breakpoint-sm) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: $breakpoint-lg) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: $spacing-8;

  @media (min-width: $breakpoint-md) {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
