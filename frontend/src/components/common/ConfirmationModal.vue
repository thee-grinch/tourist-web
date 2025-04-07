<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" class="modal" @close="cancel">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="modal-overlay" />
      </TransitionChild>

      <div class="modal-container">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 translate-y-0 sm:scale-100"
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <DialogPanel class="modal-content">
            <div class="modal-header">
              <DialogTitle class="modal-title">
                {{ title }}
              </DialogTitle>
              <button @click="cancel" class="modal-close-button">
                <XMarkIcon class="h-5 w-5" />
              </button>
            </div>

            <div class="modal-body">
              <p class="modal-message">{{ message }}</p>
            </div>

            <div class="modal-footer">
              <button @click="cancel" class="modal-button cancel">
                {{ cancelText }}
              </button>
              <button @click="confirm" class="modal-button confirm">
                {{ confirmText }}
              </button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: 'Confirm Action',
  },
  message: {
    type: String,
    required: true,
  },
  confirmText: {
    type: String,
    default: 'Confirm',
  },
  cancelText: {
    type: String,
    default: 'Cancel',
  },
})

const emit = defineEmits(['confirm', 'cancel'])

const confirm = () => {
  emit('confirm')
}

const cancel = () => {
  emit('cancel')
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.modal {
  position: fixed;
  inset: 0;
  z-index: 50;
  overflow-y: auto;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.2s ease;
}

.modal-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: $spacing-4;
}

.modal-content {
  position: relative;
  background-color: $white;
  border-radius: $rounded-lg;
  box-shadow: $shadow-xl;
  width: 100%;
  max-width: 500px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-4 $spacing-6;
  border-bottom: 1px solid $gray-200;
}

.modal-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $gray-900;
  margin: 0;
}

.modal-close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: $spacing-8;
  height: $spacing-8;
  border-radius: $rounded-full;
  color: $gray-500;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: $gray-100;
    color: $gray-700;
  }
}

.modal-body {
  padding: $spacing-6;
}

.modal-message {
  color: $gray-700;
  line-height: 1.5;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: $spacing-3;
  padding: $spacing-4 $spacing-6;
  border-top: 1px solid $gray-200;
}

.modal-button {
  padding: $spacing-2 $spacing-4;
  border-radius: $rounded-md;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: all 0.2s ease;

  &.cancel {
    background-color: $white;
    border: 1px solid $gray-300;
    color: $gray-700;

    &:hover {
      background-color: $gray-50;
    }
  }

  &.confirm {
    background-color: $danger;
    border: 1px solid $danger;
    color: $white;

    &:hover {
      background-color: darken($danger, 10%);
    }
  }
}
</style>
