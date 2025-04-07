<template>
  <nav class="pagination">
    <ul class="pagination-list">
      <li class="pagination-item">
        <button
          @click="goToPage(1)"
          :disabled="currentPage === 1"
          class="pagination-link"
          :class="{ disabled: currentPage === 1 }"
        >
          &laquo;
        </button>
      </li>

      <li class="pagination-item">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="pagination-link"
          :class="{ disabled: currentPage === 1 }"
        >
          &lsaquo;
        </button>
      </li>

      <template v-for="page in displayedPages" :key="page">
        <li class="pagination-item">
          <button
            @click="goToPage(page)"
            class="pagination-link"
            :class="{ active: page === currentPage }"
          >
            {{ page }}
          </button>
        </li>
      </template>

      <li class="pagination-item">
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="pagination-link"
          :class="{ disabled: currentPage === totalPages }"
        >
          &rsaquo;
        </button>
      </li>

      <li class="pagination-item">
        <button
          @click="goToPage(totalPages)"
          :disabled="currentPage === totalPages"
          class="pagination-link"
          :class="{ disabled: currentPage === totalPages }"
        >
          &raquo;
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['page-change'])

const displayedPages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = 1
  let end = props.totalPages

  if (props.totalPages > maxVisible) {
    const half = Math.floor(maxVisible / 2)
    start = Math.max(1, props.currentPage - half)
    end = Math.min(props.totalPages, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('page-change', page)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.pagination {
  display: flex;
  justify-content: center;
  margin-top: $spacing-8;
}

.pagination-list {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.pagination-item {
  margin: 0 $spacing-1;
}

.pagination-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid $gray-300;
  border-radius: $rounded-md;
  background-color: $white;
  color: $gray-700;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(.disabled):not(.active) {
    background-color: $gray-100;
    border-color: $gray-400;
  }

  &.active {
    background-color: $primary;
    border-color: $primary;
    color: $white;
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
