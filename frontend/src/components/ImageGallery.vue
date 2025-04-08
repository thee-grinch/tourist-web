<!-- components/ImageGallery.vue -->
<template>
    <div class="relative">
      <div class="relative h-96 overflow-hidden rounded-lg">
        <motion.img
          :src="currentImage"
          :key="currentIndex"
          class="absolute inset-0 w-full h-full object-cover"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <div class="flex justify-center mt-4 space-x-2">
        <button 
          v-for="(image, index) in images" 
          :key="index"
          @click="currentIndex = index"
          class="w-16 h-16 rounded overflow-hidden transition-all duration-200"
          :class="{ 'ring-2 ring-blue-500': currentIndex === index }"
        >
          <img :src="image" class="w-full h-full object-cover" />
        </button>
      </div>
      
      <button 
        @click="prevImage"
        class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
      >
        <ChevronLeftIcon class="h-6 w-6" />
      </button>
      
      <button 
        @click="nextImage"
        class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
      >
        <ChevronRightIcon class="h-6 w-6" />
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { motion } from 'framer-motion';
  import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';
  
  const props = defineProps({
    images: { type: Array, required: true }
  });
  
  const currentIndex = ref(0);
  
  const currentImage = computed(() => props.images[currentIndex.value]);
  
  const nextImage = () => {
    currentIndex.value = (currentIndex.value + 1) % props.images.length;
  };
  
  const prevImage = () => {
    currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length;
  };
  </script>