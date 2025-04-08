<template>
  <div class="loading-spinner">
    <div class="spinner"></div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;
@use 'sass:color';


.loading-spinner {
  display: inline-block;
  width: 50px;
  height: 50px;
}

.spinner {
  display: block;
  width: 100%;
  height: 100%;
  border: 4px solid $gray-200;
  border-top: 4px solid $primary;
  border-radius: $rounded-full;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
