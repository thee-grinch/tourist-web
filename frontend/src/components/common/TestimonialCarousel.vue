<template>
  <div class="testimonial-carousel">
    <div class="carousel-container">
      <div 
        class="carousel-wrapper" 
        :style="{ transform: `translateX(-${activeIndex * 100}%)` }"
      >
        <div 
          v-for="(testimonial, index) in testimonials" 
          :key="index"
          class="carousel-slide"
        >
          <div class="testimonial-content">
            <div class="testimonial-quote">
              <svg class="quote-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 16V8C4 5.79086 5.79086 4 8 4H9C9.55228 4 10 4.44772 10 5V8C10 8.55228 9.55228 9 9 9H7V16H9C9.55228 16 10 16.4477 10 17V19C10 19.5523 9.55228 20 9 20H5C4.44772 20 4 19.5523 4 19V17C4 16.4477 4.44772 16 5 16H4ZM14 16V8C14 5.79086 15.7909 4 18 4H19C19.5523 4 20 4.44772 20 5V8C20 8.55228 19.5523 9 19 9H17V16H19C19.5523 16 20 16.4477 20 17V19C20 19.5523 19.5523 20 19 20H15C14.4477 20 14 19.5523 14 19V17C14 16.4477 14.4477 16 15 16H14Z" fill="currentColor" opacity="0.2"/>
              </svg>
              <p>{{ testimonial.quote }}</p>
            </div>
            <div class="testimonial-author">
              <div class="author-image" v-if="testimonial.image">
                <img :src="testimonial.image" :alt="testimonial.name" />
              </div>
              <div class="author-initial" v-else>
                {{ testimonial?.name?.charAt(0) || 'N/A' }}
              </div>
              <div class="author-info">
                <h4 class="author-name">{{ testimonial.name }}</h4>
                <p class="author-title">{{ testimonial.title }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="carousel-controls">
      <button 
        class="carousel-control prev" 
        @click="prevSlide" 
        :disabled="activeIndex === 0"
        aria-label="Previous testimonial"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
      </button>
      
      <div class="carousel-indicators">
        <button
          v-for="(_, index) in testimonials"
          :key="index"
          class="carousel-indicator"
          :class="{ active: index === activeIndex }"
          @click="setActiveSlide(index)"
          :aria-label="`Go to testimonial ${index + 1}`"
        ></button>
      </div>
      
      <button 
        class="carousel-control next" 
        @click="nextSlide" 
        :disabled="activeIndex === testimonials.length - 1"
        aria-label="Next testimonial"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  testimonials: {
    type: Array,
    required: true,
    default: () => []
  },
  autoplay: {
    type: Boolean,
    default: true
  },
  interval: {
    type: Number,
    default: 5000
  }
});

const activeIndex = ref(0);
let autoplayInterval = null;

const nextSlide = () => {
  if (activeIndex.value < props.testimonials.length - 1) {
    activeIndex.value++;
  } else {
    activeIndex.value = 0;
  }
};

const prevSlide = () => {
  if (activeIndex.value > 0) {
    activeIndex.value--;
  } else {
    activeIndex.value = props.testimonials.length - 1;
  }
};

const setActiveSlide = (index) => {
  activeIndex.value = index;
};

const startAutoplay = () => {
  if (props.autoplay && props.testimonials.length > 1) {
    autoplayInterval = setInterval(() => {
      nextSlide();
    }, props.interval);
  }
};

const stopAutoplay = () => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
  }
};

onMounted(() => {
  startAutoplay();
});

onBeforeUnmount(() => {
  stopAutoplay();
});
</script>

<style lang="scss" scoped>
@use '@/assets/scss/_variables' as *;

.testimonial-carousel {
  position: relative;
  overflow: hidden;
  width: 100%;
}

.carousel-container {
  overflow: hidden;
}

.carousel-wrapper {
  display: flex;
  transition: transform 0.5s ease;
  width: 100%;
}

.carousel-slide {
  flex: 0 0 100%;
  padding: $spacing-4;
}

.testimonial-content {
  background-color: $white;
  border-radius: $rounded-lg;
  box-shadow: $shadow-md;
  padding: $spacing-6;
}

.testimonial-quote {
  position: relative;
  padding-top: $spacing-6;
  margin-bottom: $spacing-4;
  
  .quote-icon {
    position: absolute;
    top: 0;
    left: 0;
    height: 24px;
    width: 24px;
    color: $primary;
  }
  
  p {
    font-size: $font-size-lg;
    line-height: 1.7;
    color: $gray-700;
    font-style: italic;
  }
}

.testimonial-author {
  display: flex;
  align-items: center;
  
  .author-image, .author-initial {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: $spacing-3;
    overflow: hidden;
  }
  
  .author-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .author-initial {
    background-color: $primary;
    color: $white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
  }
  
  .author-name {
    font-weight: $font-weight-bold;
    color: $gray-900;
    margin-bottom: $spacing-1;
  }
  
  .author-title {
    font-size: $font-size-sm;
    color: $gray-600;
  }
}

.carousel-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: $spacing-4;
}

.carousel-control {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: $white;
  border: 1px solid $gray-200;
  color: $gray-700;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: $primary;
    color: $white;
    border-color: $primary;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.carousel-indicators {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 $spacing-3;
}

.carousel-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: $gray-300;
  margin: 0 $spacing-1;
  transition: all 0.2s ease;
  border: none;
  
  &.active {
    background-color: $primary;
    transform: scale(1.2);
  }
  
  &:hover {
    background-color: $primary-light;
  }
}
</style>