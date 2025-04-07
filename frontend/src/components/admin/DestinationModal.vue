<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" class="modal" @close="close">
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
                {{ isEditing ? 'Edit Destination' : 'Add Destination' }}
              </DialogTitle>
              <button @click="close" class="modal-close-button">
                <XMarkIcon class="h-5 w-5" />
              </button>
            </div>

            <div class="modal-body">
              <form @submit.prevent="save">
                <div v-if="errorMessage" class="modal-error">
                  {{ errorMessage }}
                </div>

                <div class="form-grid">
                  <div class="form-group">
                    <label for="name" class="form-label">Name</label>
                    <input
                      type="text"
                      id="name"
                      v-model="form.name"
                      class="form-input"
                      :class="{ error: errors.name }"
                      placeholder="Destination name"
                      required
                    />
                    <span v-if="errors.name" class="form-error">{{ errors.name }}</span>
                  </div>

                  <div class="form-group">
                    <label for="region" class="form-label">Region</label>
                    <select
                      id="region"
                      v-model="form.region"
                      class="form-input"
                      :class="{ error: errors.region }"
                      required
                    >
                      <option value="" disabled>Select a region</option>
                      <option v-for="region in regions" :key="region" :value="region">
                        {{ region }}
                      </option>
                    </select>
                    <span v-if="errors.region" class="form-error">{{ errors.region }}</span>
                  </div>

                  <div class="form-group">
                    <label for="price" class="form-label">Price per night ($)</label>
                    <input
                      type="number"
                      id="price"
                      v-model.number="form.price"
                      class="form-input"
                      :class="{ error: errors.price }"
                      placeholder="0"
                      min="0"
                      step="1"
                      required
                    />
                    <span v-if="errors.price" class="form-error">{{ errors.price }}</span>
                  </div>

                  <div class="form-group">
                    <label for="features" class="form-label">Features</label>
                    <div class="features-input">
                      <input
                        type="text"
                        id="features"
                        v-model="featureInput"
                        @keydown.enter.prevent="addFeature"
                        class="form-input"
                        placeholder="Add features (press Enter to add)"
                      />
                      <div class="features-tags">
                        <span
                          v-for="(feature, index) in form.features"
                          :key="index"
                          class="feature-tag"
                        >
                          {{ feature }}
                          <button @click="removeFeature(index)" class="feature-remove">
                            <XMarkIcon class="h-4 w-4" />
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="form-group col-span-2">
                    <label for="description" class="form-label">Description</label>
                    <textarea
                      id="description"
                      v-model="form.description"
                      class="form-input"
                      :class="{ error: errors.description }"
                      rows="4"
                      placeholder="Destination description"
                      required
                    ></textarea>
                    <span v-if="errors.description" class="form-error">{{
                      errors.description
                    }}</span>
                  </div>

                  <div class="form-group col-span-2">
                    <label class="form-label">Images</label>
                    <div class="images-upload">
                      <div class="upload-area">
                        <input
                          type="file"
                          id="image-upload"
                          ref="fileInput"
                          multiple
                          accept="image/*"
                          @change="handleImageUpload"
                          class="upload-input"
                        />
                        <label for="image-upload" class="upload-label">
                          <div class="upload-content">
                            <PhotoIcon class="upload-icon" />
                            <p class="upload-text">Click to upload or drag and drop</p>
                            <p class="upload-hint">PNG, JPG up to 5MB</p>
                          </div>
                        </label>
                      </div>

                      <div class="images-preview">
                        <div
                          v-for="(image, index) in form.images"
                          :key="index"
                          class="image-preview"
                        >
                          <img :src="image" class="image-thumbnail" />
                          <button @click="removeImage(index)" class="image-remove">
                            <XMarkIcon class="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="modal-actions">
                  <button type="button" @click="close" class="modal-button cancel">Cancel</button>
                  <button type="submit" class="modal-button save" :disabled="isLoading">
                    <span v-if="isLoading">Saving...</span>
                    <span v-else>{{ isEditing ? 'Update' : 'Save' }}</span>
                  </button>
                </div>
              </form>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon, PhotoIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  destination: {
    type: Object,
    default: () => ({
      name: '',
      region: '',
      price: 0,
      description: '',
      features: [],
      images: [],
    }),
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'save'])

const regions = ['Nairobi', 'Mombasa', 'Maasai Mara', 'Amboseli', 'Tsavo', 'Diani', 'Lamu']
const form = ref({ ...props.destination })
const featureInput = ref('')
const errors = ref({})
const errorMessage = ref('')
const isLoading = ref(false)
const fileInput = ref(null)

const addFeature = () => {
  if (featureInput.value.trim() && !form.value.features.includes(featureInput.value.trim())) {
    form.value.features.push(featureInput.value.trim())
    featureInput.value = ''
  }
}

const removeFeature = (index) => {
  form.value.features.splice(index, 1)
}

const handleImageUpload = (event) => {
  const files = event.target.files
  if (!files.length) return

  // Simulate image upload
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const reader = new FileReader()

    reader.onload = (e) => {
      form.value.images.push(e.target.result)
    }

    reader.readAsDataURL(file)
  }

  // Reset file input
  fileInput.value.value = ''
}

const removeImage = (index) => {
  form.value.images.splice(index, 1)
}

const validateForm = () => {
  errors.value = {}
  let isValid = true

  if (!form.value.name.trim()) {
    errors.value.name = 'Name is required'
    isValid = false
  }

  if (!form.value.region) {
    errors.value.region = 'Region is required'
    isValid = false
  }

  if (form.value.price <= 0) {
    errors.value.price = 'Price must be greater than 0'
    isValid = false
  }

  if (!form.value.description.trim()) {
    errors.value.description = 'Description is required'
    isValid = false
  }

  return isValid
}

const save = async () => {
  if (!validateForm()) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    await emit('save', form.value)
    close()
  } catch (error) {
    errorMessage.value = error.message || 'Failed to save destination'
  } finally {
    isLoading.value = false
  }
}

const close = () => {
  emit('close')
}

watch(
  () => props.destination,
  (newVal) => {
    form.value = { ...newVal }
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
@use '@/assets/scss/variables';

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
  max-width: 800px;
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

.modal-error {
  background-color: lighten($danger, 40%);
  color: $danger;
  padding: $spacing-3;
  border-radius: $rounded-md;
  margin-bottom: $spacing-4;
  font-size: $font-size-sm;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-4;
  margin-bottom: $spacing-6;
}

.form-group {
  &.col-span-2 {
    grid-column: span 2;
  }
}

.form-label {
  display: block;
  margin-bottom: $spacing-2;
  font-weight: $font-weight-medium;
  color: $gray-700;
}

.form-input {
  width: 100%;
  padding: $spacing-2 $spacing-3;
  border: 1px solid $gray-300;
  border-radius: $rounded-md;
  font-size: $font-size-base;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: $primary;
    box-shadow: 0 0 0 1px $primary;
  }

  &.error {
    border-color: $danger;
  }

  &[type='file'] {
    display: none;
  }
}

textarea.form-input {
  min-height: 100px;
  resize: vertical;
}

.form-error {
  display: block;
  margin-top: $spacing-1;
  color: $danger;
  font-size: $font-size-sm;
}

.features-input {
  .form-input {
    margin-bottom: $spacing-2;
  }
}

.features-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-2;
}

.feature-tag {
  display: inline-flex;
  align-items: center;
  background-color: $gray-100;
  color: $gray-800;
  padding: $spacing-1 $spacing-2;
  border-radius: $rounded-full;
  font-size: $font-size-sm;
}

.feature-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: $spacing-1;
  color: $gray-500;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    color: $gray-700;
  }
}

.images-upload {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-4;

  @media (min-width: $breakpoint-md) {
    grid-template-columns: 200px 1fr;
  }
}

.upload-area {
  border: 2px dashed $gray-300;
  border-radius: $rounded-md;
  padding: $spacing-6;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: $gray-400;
  }
}

.upload-label {
  display: block;
  cursor: pointer;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-icon {
  width: $spacing-8;
  height: $spacing-8;
  color: $gray-400;
  margin-bottom: $spacing-2;
}

.upload-text {
  font-size: $font-size-sm;
  color: $gray-700;
  margin-bottom: $spacing-1;
}

.upload-hint {
  font-size: $font-size-xs;
  color: $gray-500;
}

.images-preview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: $spacing-3;
}

.image-preview {
  position: relative;
  aspect-ratio: 1;
  border-radius: $rounded-md;
  overflow: hidden;
}

.image-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-remove {
  position: absolute;
  top: $spacing-1;
  right: $spacing-1;
  width: $spacing-6;
  height: $spacing-6;
  background-color: rgba($danger, 0.8);
  color: $white;
  border: none;
  border-radius: $rounded-full;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;

  .image-preview:hover & {
    opacity: 1;
  }
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: $spacing-3;
  padding-top: $spacing-4;
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

  &.save {
    background-color: $primary;
    border: 1px solid $primary;
    color: $white;

    &:hover:not(:disabled) {
      background-color: $primary-hover;
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
}
</style>
