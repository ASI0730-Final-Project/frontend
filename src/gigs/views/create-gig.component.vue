<script>
import { useI18n } from 'vue-i18n'
import { gigService } from '../services/gig.service'
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'

export default {
  name: "create-gig",
  title: "Create Gig",
  setup() {
    const { t } = useI18n()
    const router = useRouter()

    const currentStep = ref(1)
    const error = ref(null)
    const errors = ref({})
    const loading = ref(false)

    const gigData = ref({
      title: '',
      description: '',
      tags: [],
      category: '',
      image: '',
      delivery_days: 3,
      is_responsive: true,
      revision_count: 1,
      page_count: 1,
      extra_features: [],
      custom_animations: false,
      price: 0,
      seller_id: null
    })

    const availableCategories = [
      'Web Development',
      'UI/UX Design',
      'Graphic Design',
      'Content Writing',
      'Digital Marketing',
      'Video Editing'
    ]

    const availableFeatures = [
      'SEO optimization',
      'Performance tuning',
      'Custom icons',
      'Interactive elements',
      'Mobile optimization',
      'Social media integration'
    ]

    const user = computed(() => {
      const userData = localStorage.getItem('user')
      return userData ? JSON.parse(userData) : null
    })

    const calculatedPrice = computed(() => {
      let basePrice = 100
      basePrice += (7 - gigData.value.delivery_days) * 50
      if (gigData.value.is_responsive) basePrice += 200
      basePrice += gigData.value.revision_count * 50
      basePrice += gigData.value.page_count * 100
      basePrice += gigData.value.extra_features.length * 150
      if (gigData.value.custom_animations) basePrice += 300
      return basePrice
    })

    const validateStep1 = () => {
      errors.value = {}
      if (!gigData.value.title) errors.value.title = t('gigs.errors.titleRequired') || 'Title is required'
      if (!gigData.value.description) errors.value.description = t('gigs.errors.descriptionRequired') || 'Description is required'
      if (!gigData.value.category) errors.value.category = t('gigs.errors.categoryRequired') || 'Category is required'

      if (Object.keys(errors.value).length === 0) {
        currentStep.value++
        error.value = null
      } else {
        error.value = t('gigs.fillRequiredFields') || 'Please fill all required fields'
      }
    }

    const prevStep = () => {
      if (currentStep.value > 1) {
        currentStep.value--
        error.value = null
      }
    }

    const handleCreateGig = async () => {
      try {
        loading.value = true
        error.value = null

        if (!user.value || user.value.role !== 'seller') {
          error.value = 'Only sellers can create gigs'
          loading.value = false
          return
        }

        if (typeof gigData.value.tags === 'string') {
          gigData.value.tags = gigData.value.tags
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0)
        }

        gigData.value.price = calculatedPrice.value
        gigData.value.seller_id = user.value.id

        const gig = await gigService.createGig(gigData.value)

        if (gig) {
          router.push({ name: 'gigs' })
        }
      } catch (err) {
        error.value = t('gigs.createError') || 'Error creating gig'
        console.error('Create gig error:', err)
      } finally {
        loading.value = false
      }
    }

    const handleImageUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          gigData.value.image = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }

    return {
      t,
      currentStep,
      gigData,
      availableCategories,
      availableFeatures,
      calculatedPrice,
      error,
      errors,
      loading,
      validateStep1,
      prevStep,
      handleCreateGig,
      handleImageUpload
    }
  }
}
</script>

<template>
  <main class="create-gig-container" role="main" aria-labelledby="create-gig-heading">
    <h1 id="create-gig-heading" class="text-3xl mb-6 text-center">{{ t('gigs.create') }}</h1>

    <div class="steps-indicator mb-6" role="tablist" aria-label="Gig creation steps">
      <div
        :class="['step', { 'active': currentStep === 1 }]"
        @click="currentStep = 1"
        role="tab"
        :aria-selected="currentStep === 1"
        :aria-controls="'step-1-content'"
        :tabindex="currentStep === 1 ? 0 : -1"
        :aria-disabled="false"
      >
        Step 1: Basic Information
      </div>
      <div
        :class="['step', { 'active': currentStep === 2, 'disabled': Object.keys(errors).length > 0 }]"
        @click="Object.keys(errors).length === 0 && (currentStep = 2)"
        role="tab"
        :aria-selected="currentStep === 2"
        :aria-controls="'step-2-content'"
        :tabindex="Object.keys(errors).length === 0 ? (currentStep === 2 ? 0 : -1) : -1"
        :aria-disabled="Object.keys(errors).length > 0"
      >
        Step 2: Configuration & Pricing
      </div>
    </div>

    <div v-if="error" class="error-message mb-4" role="alert" aria-live="assertive">
      {{ error }}
    </div>

    <div
      v-if="currentStep === 1"
      class="step-content"
      id="step-1-content"
      role="tabpanel"
      aria-labelledby="step-1-tab"
    >
      <div class="form-group mb-4">
        <label for="title">{{ t('gigs.title') }} *</label>
        <pv-input-text
          id="title"
          v-model="gigData.title"
          class="w-full"
          required
          aria-required="true"
          :aria-invalid="!!errors.title"
          :aria-describedby="errors.title ? 'title-error' : null"
        />
        <span v-if="errors.title" id="title-error" class="error-text">{{ errors.title }}</span>
      </div>

      <div class="form-group mb-4">
        <label for="description">{{ t('gigs.description') }} *</label>
        <pv-textarea
          id="description"
          v-model="gigData.description"
          rows="5"
          class="w-full"
          required
          aria-required="true"
          :aria-invalid="!!errors.description"
          :aria-describedby="errors.description ? 'description-error' : null"
        />
        <span v-if="errors.description" id="description-error" class="error-text">{{ errors.description }}</span>
      </div>

      <div class="form-group mb-4">
        <label for="category">{{ t('gigs.category') }} *</label>
        <pv-dropdown
          id="category"
          v-model="gigData.category"
          :options="availableCategories"
          class="w-full"
          placeholder="Select a category"
          aria-required="true"
          :aria-invalid="!!errors.category"
          :aria-describedby="errors.category ? 'category-error' : null"
        />
        <span v-if="errors.category" id="category-error" class="error-text">{{ errors.category }}</span>
      </div>

      <div class="form-group mb-4">
        <label for="tags">Tags (separate with commas)</label>
        <pv-input-text
          id="tags"
          v-model="gigData.tags"
          class="w-full"
          placeholder="responsive, web, design"
          aria-describedby="tags-help"
        />
        <small id="tags-help" class="text-gray-500">Example: responsive, web, design</small>
      </div>

      <div class="form-group mb-4">
        <label for="image">Gig Image</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          @change="handleImageUpload"
          class="w-full"
          aria-describedby="image-help"
        />
        <small id="image-help" class="text-gray-500">Recommended size: 1200×800px</small>
        <div v-if="gigData.image" class="mt-2">
          <img :src="gigData.image" :alt="'Preview of gig image for ' + gigData.title" class="image-preview">
        </div>
      </div>

      <div class="flex justify-content-end">
        <pv-button
          label="Next"
          @click="validateStep1"
          icon="pi pi-arrow-right"
          iconPos="right"
          aria-label="Proceed to step 2"
        />
      </div>
    </div>

    <div
      v-if="currentStep === 2"
      class="step-content"
      id="step-2-content"
      role="tabpanel"
      aria-labelledby="step-2-tab"
    >
      <div class="grid">
        <div class="col-6">
          <div class="form-group mb-4">
            <label for="delivery_days">Delivery Days</label>
            <pv-dropdown
              id="delivery_days"
              v-model="gigData.delivery_days"
              :options="[1, 2, 3, 4, 5, 6, 7]"
              class="w-full"
              aria-describedby="delivery-help"
            />
            <small id="delivery-help" class="text-gray-500">Standard delivery time</small>
          </div>

          <div class="form-group mb-4">
            <label for="is_responsive">Responsive Design</label>
            <pv-dropdown
              id="is_responsive"
              v-model="gigData.is_responsive"
              :options="[true, false]"
              class="w-full"
            >
              <template #option="slotProps">
                {{ slotProps.option ? 'Yes' : 'No' }}
              </template>
            </pv-dropdown>
          </div>

          <div class="form-group mb-4">
            <label for="revision_count">Number of Revisions</label>
            <pv-dropdown
              id="revision_count"
              v-model="gigData.revision_count"
              :options="[0, 1, 2, 3, 4, 5]"
              class="w-full"
              aria-describedby="revisions-help"
            />
            <small id="revisions-help" class="text-gray-500">+S/ 50 per revision</small>
          </div>
        </div>

        <div class="col-6">
          <div class="form-group mb-4">
            <label for="page_count">Number of Pages</label>
            <pv-dropdown
              id="page_count"
              v-model="gigData.page_count"
              :options="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
              class="w-full"
              aria-describedby="pages-help"
            />
            <small id="pages-help" class="text-gray-500">+S/ 100 per page</small>
          </div>

          <div class="form-group mb-4">
            <label for="extra_features">Extra Features</label>
            <pv-multi-select
              id="extra_features"
              v-model="gigData.extra_features"
              :options="availableFeatures"
              class="w-full"
              aria-describedby="features-help"
            />
            <small id="features-help" class="text-gray-500">+S/ 150 per feature</small>
          </div>

          <div class="form-group mb-4">
            <label for="custom_animations">Custom Animations</label>
            <pv-dropdown
              id="custom_animations"
              v-model="gigData.custom_animations"
              :options="[true, false]"
              class="w-full"
            >
              <template #option="slotProps">
                {{ slotProps.option ? 'Yes' : 'No' }}
              </template>
            </pv-dropdown>
          </div>
        </div>
      </div>

      <div class="price-summary mb-4">
        <h3>{{ t('gigs.price') }}: S/ {{ calculatedPrice }}</h3>
      </div>

      <div class="flex justify-content-between">
        <pv-button
          label="Back"
          icon="pi pi-arrow-left"
          @click="prevStep"
          aria-label="Back to step 1"
        />
        <pv-button
          label="Create Gig"
          icon="pi pi-check"
          :loading="loading"
          @click="handleCreateGig"
          aria-label="Submit gig creation"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
.create-gig-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.steps-indicator {
  display: flex;
  border-bottom: 1px solid #ddd;
}

.step {
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  margin-right: 1rem;
  color: #666;
  transition: all 0.2s ease;
}

.step.active {
  border-bottom-color: #28acd4;
  color: #28acd4;
  font-weight: bold;
}

.step.disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.step:focus-visible {
  outline: 2px solid #28acd4;
  outline-offset: 2px;
}

.step-content {
  background-color: #1e1f20;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.image-preview {
  max-width: 200px;
  max-height: 200px;
  border-radius: 4px;
  border: 1px solid #c2c2c2;
}

.price-summary {
  background-color: #2995ec;
  border-radius: 8px;
}

.error-message {
  color: #e42315;
  padding: 1rem;
  background-color: #ffebee;
  border-radius: 4px;
}

.error-text {
  color: #e42315;
  font-size: 0.875rem;
  display: block;
  margin-top: 0.25rem;
}

input:focus-visible,
textarea:focus-visible,
.p-dropdown:focus-visible,
.p-multiselect:focus-visible {
  outline: 2px solid #28acd4;
  outline-offset: 2px;
}

@media (forced-colors: active) {
  .step.active {
    border-bottom-color: Highlight;
    color: Highlight;
  }

  .price-summary {
    forced-color-adjust: none;
    background-color: Highlight;
    color: HighlightText;
  }
}
</style>
