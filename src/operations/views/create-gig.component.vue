<script>
import { useI18n } from 'vue-i18n'
import { gigService } from '../services/gig.service'
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { authService } from '../../shared/services/auth.service'

export default {
  name: "create-gig",
  title: "Create Gig",
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    
    const currentStep = ref(1)
    const error = ref(null)
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
      price: 0
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
      let basePrice = 100 // Precio base
      
      // Añadir por días de entrega (menos días = más caro)
      basePrice += (7 - gigData.value.delivery_days) * 50
      
      // Añadir por responsive
      if (gigData.value.is_responsive) basePrice += 200
      
      // Añadir por revisiones
      basePrice += gigData.value.revision_count * 50
      
      // Añadir por páginas
      basePrice += gigData.value.page_count * 100
      
      // Añadir por características extra
      basePrice += gigData.value.extra_features.length * 150
      
      // Añadir por animaciones custom
      if (gigData.value.custom_animations) basePrice += 300
      
      return basePrice
    })
    
    const nextStep = () => {
      // Validar campos del paso 1 antes de continuar
      if (currentStep.value === 1) {
        if (!gigData.value.title || !gigData.value.description || !gigData.value.category) {
          error.value = t('gigs.fillRequiredFields')
          return
        }
      }
      currentStep.value++
      error.value = null
    }
    
    const prevStep = () => {
      currentStep.value--
      error.value = null
    }
    
    const handleCreateGig = async () => {
      try {
        loading.value = true
        error.value = null
        
        if (!user.value || user.value.role !== 'seller') {
          error.value = 'Only sellers can create gigs'
          return
        }
        
        // Asignar el precio calculado
        gigData.value.price = calculatedPrice.value
        
        // Asignar el seller_id
        gigData.value.seller_id = user.value.id
        
        const gig = await gigService.createGig(gigData.value)
        // En el método handleCreateGig, antes de enviar los datos:
        if (typeof gigData.value.tags === 'string') {
          // Convertir string de tags a array
          gigData.value.tags = gigData.value.tags
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0)
        }
        if (gig) {
          router.push({ name: 'gigs' })
        }
      } catch (err) {
        error.value = t('gigs.createError')
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
      loading,
      nextStep,
      prevStep,
      handleCreateGig,
      handleImageUpload
    }
  }
}
</script>

<template>
  <div class="create-gig-container">
    <h1 class="text-3xl mb-6 text-center">{{ t('gigs.create') }}</h1>
    
    <div class="steps-indicator mb-6">
      <div 
        :class="['step', { 'active': currentStep === 1 }]"
        @click="currentStep = 1"
      >
        Step 1: Basic Information
      </div>
      <div 
        :class="['step', { 'active': currentStep === 2 }]"
        @click="currentStep = 2"
        :disabled="!gigData.title || !gigData.description || !gigData.category"
      >
        Step 2: Configuration & Pricing
      </div>
    </div>
    
    <div v-if="error" class="error-message mb-4">
      {{ error }}
    </div>
    
    <!-- Paso 1: Información Básica -->
    <div v-if="currentStep === 1" class="step-content">
      <div class="form-group mb-4">
        <label for="title">{{ t('gigs.title') }} *</label>
        <pv-input-text
          id="title"
          v-model="gigData.title"
          class="w-full"
          required
        />
      </div>
      
      <div class="form-group mb-4">
        <label for="description">{{ t('gigs.description') }} *</label>
        <pv-textarea
          id="description"
          v-model="gigData.description"
          rows="5"
          class="w-full"
          required
        />
      </div>
      
      <div class="form-group mb-4">
        <label for="category">{{ t('gigs.category') }} *</label>
        <pv-dropdown
          id="category"
          v-model="gigData.category"
          :options="availableCategories"
          class="w-full"
          placeholder="Select a category"
        />
      </div>
      
      <div class="form-group mb-4">
        <label for="tags">Tags (separate with commas)</label>
        <pv-input-text
          id="tags"
          v-model="gigData.tags"
          class="w-full"
          placeholder="responsive, web, design"
        />
        <small class="text-gray-500">Example: responsive, web, design</small>
      </div>
      
      <div class="form-group mb-4">
        <label for="image">Gig Image</label>
        <input 
          type="file" 
          id="image"
          accept="image/*"
          @change="handleImageUpload"
          class="w-full"
        />
        <div v-if="gigData.image" class="mt-2">
          <img :src="gigData.image" alt="Preview" class="image-preview">
        </div>
      </div>
      
      <div class="flex justify-content-end">
        <pv-button 
          label="Next"
          @click="nextStep"
          icon="pi pi-arrow-right"
          iconPos="right"
        />
      </div>
    </div>
    
    <!-- Paso 2: Configuración y Precio -->
    <div v-if="currentStep === 2" class="step-content">
      <div class="grid">
        <div class="col-6">
          <div class="form-group mb-4">
            <label for="delivery_days">Delivery Days</label>
            <pv-dropdown
              id="delivery_days"
              v-model="gigData.delivery_days"
              :options="[1, 2, 3, 4, 5, 6, 7]"
              class="w-full"
            />
          </div>
          
          <div class="form-group mb-4">
            <label for="is_responsive">Responsive Design</label>
            <pv-dropdown
              id="is_responsive"
              v-model="gigData.is_responsive"
              :options="[true, false]"
              optionLabel="label"
              optionValue="value"
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
            />
            <small class="text-gray-500">+S/ 50 per revision</small>
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
            />
            <small class="text-gray-500">+S/ 100 per page</small>
          </div>
          
          <div class="form-group mb-4">
            <label for="extra_features">Extra Features</label>
            <pv-multi-select
              id="extra_features"
              v-model="gigData.extra_features"
              :options="availableFeatures"
              class="w-full"
              display="chip"
            />
            <small class="text-gray-500">+S/ 150 per feature</small>
          </div>
          
          <div class="form-group mb-4">
            <label for="custom_animations">Custom Animations</label>
            <pv-dropdown
              id="custom_animations"
              v-model="gigData.custom_animations"
              :options="[true, false]"
              optionLabel="label"
              optionValue="value"
              class="w-full"
            >
              <template #option="slotProps">
                {{ slotProps.option ? 'Yes (+S/ 300)' : 'No' }}
              </template>
            </pv-dropdown>
          </div>
        </div>
      </div>
      
      <div class="price-summary p-4 mb-4">
        <h3 class="text-xl mb-2">Estimated Price</h3>
        <div class="text-3xl font-bold">S/ {{ calculatedPrice }}</div>
        <small class="text-gray-500">Price will be calculated based on your selections</small>
      </div>
      
      <div class="flex justify-content-between">
        <pv-button 
          label="Back"
          @click="prevStep"
          icon="pi pi-arrow-left"
          class="p-button-secondary"
        />
        <pv-button 
          label="Create Gig"
          @click="handleCreateGig"
          icon="pi pi-check"
          :loading="loading"
          class="p-button-success"
        />
      </div>
    </div>
  </div>
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
}

.step.active {
  border-bottom-color: #28acd4;
  color: #28acd4;
  font-weight: bold;
}

.step[disabled] {
  cursor: not-allowed;
  opacity: 0.6;
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
</style>