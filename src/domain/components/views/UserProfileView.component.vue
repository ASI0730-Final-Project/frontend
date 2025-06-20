<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { authService } from '../../../shared/services/auth.service'

const { t } = useI18n()
const router = useRouter()
const user = ref(null)
const isEditing = ref(false)
const editedUser = ref({})

// Datos del seller
const sellerStats = ref({
  totalGigs: 8,
  activeGigs: 5,
  completedOrders: 24,
  totalEarnings: 3250.75
})

// Métricas de rendimiento
const performanceMetrics = ref({
  deliveredOnTime: 92,
  orderCompletion: 96,
  earnedInMonth: 850.50
})

const showSocialForm = ref(false)
const newSocial = ref({ type: '', url: '' })
const availableSocials = [
  { icon: 'pi pi-instagram', label: 'Instagram', value: 'instagram' },
  { icon: 'pi pi-facebook', label: 'Facebook', value: 'facebook' },
  { icon: 'pi pi-x', label: 'X', value: 'x' },
  { icon: 'pi pi-linkedin', label: 'LinkedIn', value: 'linkedin' },
]

const onlineStatus = ref(true)

const currentMonth = computed(() => {
  const date = new Date()
  let locale = t('profile.locale')
  if (!locale || locale === 'profile.locale' || !/^[a-z]{2,3}-[A-Z]{2,3}$/.test(locale)) locale = 'en-US'
  return date.toLocaleString(locale, { month: 'long' })
})

const notification = ref({ show: false, type: '', message: '' })
let notificationTimeout = null

function showNotification(type, message) {
  notification.value = { show: true, type, message }
  if (notificationTimeout) clearTimeout(notificationTimeout)
  notificationTimeout = setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

function startEditing() {
  editedUser.value = { ...user.value }
  isEditing.value = true
}

function cancelEditing() {
  isEditing.value = false
  editedUser.value = {}
}

async function saveProfile() {
  try {
    user.value = { ...editedUser.value }
    isEditing.value = false
    showNotification('success', t('profile.saveSuccess'))
  } catch (error) {
    showNotification('error', t('profile.saveError'))
  }
}

function goToCreateGig() {
  router.push({ name: 'createGig' })
}

async function updateSocialNetworks() {
  if (!user.value?.id) return
  const res = await fetch(`http://localhost:3000/users/${user.value.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...user.value, socialNetworks: user.value.socialNetworks })
  })
  return res.ok
}

async function addSocialNetwork() {
  if (!newSocial.value.type || !newSocial.value.url) return
  if (!user.value.socialNetworks) user.value.socialNetworks = []
  user.value.socialNetworks.push({ ...newSocial.value })
  const ok = await updateSocialNetworks()
  if (ok) {
    showNotification('success', t('profile.socialAddSuccess'))
  } else {
    showNotification('error', t('profile.socialAddError'))
    user.value.socialNetworks.pop()
  }
  newSocial.value = { type: '', url: '' }
  showSocialForm.value = false
}

function openSocialForm() {
  showSocialForm.value = true
}

function closeSocialForm() {
  showSocialForm.value = false
}

async function removeSocialNetwork(idx) {
  const removed = user.value.socialNetworks.splice(idx, 1)
  const ok = await updateSocialNetworks()
  if (ok) {
    showNotification('success', t('profile.socialRemoveSuccess'))
  } else {
    showNotification('error', t('profile.socialRemoveError'))
    user.value.socialNetworks.splice(idx, 0, ...removed)
  }
}

onMounted(async () => {
  user.value = await authService.getCurrentUser()
  if (user.value) {
    if (user.value.rol && !user.value.role) user.value.role = user.value.rol
    if (user.value.role) user.value.role = user.value.role.toLowerCase().trim()
  }
})
</script>

<template>
  <div v-if="user && user.role === 'seller'" class="seller-profile-container">
    <!-- Header del perfil -->
    <div class="profile-header">
      <div class="profile-avatar-section">
        <div v-if="user.image" class="profile-avatar">
          <img :src="user.image" alt="Profile Image" />
        </div>
        <div v-else class="profile-avatar-placeholder">
          {{ user.name?.charAt(0) }}{{ user.lastname?.charAt(0) }}
        </div>
        <div class="profile-status">
          <div class="status-dot online"></div>
          <span>{{ t('profile.online') }}</span>
        </div>
      </div>
      
      <div class="profile-info">
        <h1 class="profile-name">{{ user.name }} {{ user.lastname }}</h1>
        <p class="profile-role">{{ t('auth.role') }}: {{ t('auth.seller') }}</p>
        <p class="profile-email">{{ user.email }}</p>
        
        <div class="profile-actions">
          <button v-if="!isEditing" @click="startEditing" class="edit-btn">
            <i class="pi pi-pencil"></i>
            {{ t('profile.edit') }}
          </button>
          <div v-else class="edit-actions">
            <button @click="saveProfile" class="save-btn">
              <i class="pi pi-check"></i>
              {{ t('profile.save') }}
            </button>
            <button @click="cancelEditing" class="cancel-btn">
              <i class="pi pi-times"></i>
              {{ t('profile.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Estadísticas principales -->
    <div class="stats-section">
      <h2 class="section-title">{{ t('profile.performance') }}</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="pi pi-briefcase"></i>
          </div>
          <div class="stat-content">
            <h3>{{ sellerStats.totalGigs }}</h3>
            <p>{{ t('profile.totalGigs') }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="pi pi-clock"></i>
          </div>
          <div class="stat-content">
            <h3>{{ sellerStats.activeGigs }}</h3>
            <p>{{ t('profile.activeGigs') }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="pi pi-check-circle"></i>
          </div>
          <div class="stat-content">
            <h3>{{ sellerStats.completedOrders }}</h3>
            <p>{{ t('profile.completedOrders') }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="pi pi-dollar"></i>
          </div>
          <div class="stat-content">
            <h3>S/ {{ sellerStats.totalEarnings.toFixed(2) }}</h3>
            <p>{{ t('profile.totalEarnings') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Métricas de rendimiento -->
    <div class="metrics-section">
      <h2 class="section-title">{{ t('profile.performanceMetrics') }}</h2>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-label">{{ t('profile.deliveredOnTime') }}</span>
            <span class="metric-value">{{ performanceMetrics.deliveredOnTime }}%</span>
          </div>
          <div class="metric-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: performanceMetrics.deliveredOnTime + '%' }"></div>
            </div>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-label">{{ t('profile.orderCompletion') }}</span>
            <span class="metric-value">{{ performanceMetrics.orderCompletion }}%</span>
          </div>
          <div class="metric-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: performanceMetrics.orderCompletion + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Información personal -->
    <div class="personal-info-section">
      <h2 class="section-title">{{ t('profile.personalInfo') }}</h2>
      <div class="info-grid">
        <div class="info-card">
          <label>{{ t('auth.name') }}</label>
          <div v-if="!isEditing" class="info-value">{{ user.name }}</div>
          <input v-else v-model="editedUser.name" type="text" class="info-input" />
        </div>
        
        <div class="info-card">
          <label>{{ t('auth.lastname') }}</label>
          <div v-if="!isEditing" class="info-value">{{ user.lastname }}</div>
          <input v-else v-model="editedUser.lastname" type="text" class="info-input" />
        </div>
        
        <div class="info-card">
          <label>{{ t('auth.email') }}</label>
          <div v-if="!isEditing" class="info-value">{{ user.email }}</div>
          <input v-else v-model="editedUser.email" type="email" class="info-input" />
        </div>
        
        <div class="info-card">
          <label>{{ t('auth.role') }}</label>
          <div class="info-value">{{ t('auth.seller') }}</div>
        </div>
      </div>
    </div>

    <!-- Redes sociales -->
    <div class="social-section">
      <h2 class="section-title">{{ t('profile.linkSocial') }}</h2>
      <div class="social-content">
        <div v-if="!user.socialNetworks || user.socialNetworks.length === 0" class="empty-social">
          <i class="pi pi-share-alt"></i>
          <p>{{ t('profile.noSocialNetworksPrompt') }}</p>
          <button @click="openSocialForm" class="add-social-btn">
            <i class="pi pi-plus"></i>
            {{ t('profile.addSocial') }}
          </button>
        </div>
        <div v-else class="social-grid">
          <div v-for="(sn, idx) in user.socialNetworks" :key="sn.type" class="social-item">
            <a :href="sn.url" target="_blank" rel="noopener" class="social-link">
              <i :class="availableSocials.find(s => s.value === sn.type)?.icon"></i>
              <span>{{ availableSocials.find(s => s.value === sn.type)?.label }}</span>
            </a>
            <button @click="removeSocialNetwork(idx)" class="remove-social-btn">
              <i class="pi pi-times"></i>
            </button>
          </div>
          <button @click="openSocialForm" class="add-social-btn">
            <i class="pi pi-plus"></i>
            {{ t('profile.addSocial') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para agregar red social -->
    <div v-if="showSocialForm" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ t('profile.addSocial') }}</h3>
          <button @click="closeSocialForm" class="modal-close">
            <i class="pi pi-times"></i>
          </button>
        </div>
        <form @submit.prevent="addSocialNetwork" class="social-form">
          <div class="form-group">
            <label>{{ t('profile.selectNetwork') }}</label>
            <select v-model="newSocial.type" required class="form-select">
              <option disabled value="">{{ t('profile.selectNetwork') }}</option>
              <option v-for="s in availableSocials" :key="s.value" :value="s.value">{{ s.label }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>{{ t('profile.linkPlaceholder') }}</label>
            <input v-model="newSocial.url" type="url" :placeholder="t('profile.linkPlaceholder')" required class="form-input" />
          </div>
          <div class="form-actions">
            <button type="button" @click="closeSocialForm" class="btn-secondary">
              {{ t('profile.cancel') }}
            </button>
            <button type="submit" class="btn-primary">
              {{ t('profile.add') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Notificación -->
    <div v-if="notification.show" :class="['notification', notification.type]">
      <i :class="notification.type === 'success' ? 'pi pi-check-circle' : 'pi pi-exclamation-triangle'"></i>
      <span>{{ notification.message }}</span>
    </div>
  </div>
  
  <div v-else-if="user && user.role !== 'seller'" class="profile-not-seller">
    {{ t('profile.onlySeller') }}
  </div>
  
  <div v-else class="profile-loading">
    {{ t('profile.loading') }}
  </div>
</template>

<style scoped>
.seller-profile-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background: #18191d;
  min-height: 100vh;
  color: #fff;
}

/* Header del perfil */
.profile-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  background: #23242a;
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.profile-avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.profile-avatar,
.profile-avatar-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #7b1fa2, #b39ddb);
  font-size: 3rem;
  font-weight: bold;
  color: #fff;
  box-shadow: 0 8px 25px rgba(123, 31, 162, 0.3);
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.profile-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #bdbdbd;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #fff;
  text-transform: capitalize;
}

.profile-role {
  font-size: 1.1rem;
  color: #b39ddb;
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.profile-email {
  font-size: 1rem;
  color: #bdbdbd;
  margin: 0 0 1.5rem 0;
}

.profile-actions {
  display: flex;
  gap: 1rem;
}

.edit-btn,
.save-btn,
.cancel-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-btn {
  background: #7b1fa2;
  color: #fff;
}

.edit-btn:hover {
  background: #a259c4;
  transform: translateY(-2px);
}

.save-btn {
  background: #22c55e;
  color: #fff;
}

.save-btn:hover {
  background: #16a34a;
  transform: translateY(-2px);
}

.cancel-btn {
  background: #dc2626;
  color: #fff;
}

.cancel-btn:hover {
  background: #b91c1c;
  transform: translateY(-2px);
}

.edit-actions {
  display: flex;
  gap: 1rem;
}

/* Sección de estadísticas */
.stats-section,
.metrics-section,
.personal-info-section,
.social-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #7b1fa2;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: #23242a;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: linear-gradient(135deg, #7b1fa2, #b39ddb);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #fff;
  flex-shrink: 0;
}

.stat-content h3 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.25rem 0;
}

.stat-content p {
  font-size: 0.9rem;
  color: #bdbdbd;
  margin: 0;
}

/* Métricas de rendimiento */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.metric-card {
  background: #23242a;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.metric-label {
  font-size: 1rem;
  color: #bdbdbd;
  font-weight: 500;
}

.metric-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #22c55e;
}

.metric-progress {
  width: 100%;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #35344a;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #16a34a);
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* Información personal */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-card label {
  font-size: 0.9rem;
  color: #b39ddb;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 1.1rem;
  color: #fff;
  padding: 0.75rem;
  background: #18191d;
  border-radius: 8px;
  border: 1px solid #35344a;
}

.info-input {
  font-size: 1.1rem;
  color: #fff;
  padding: 0.75rem;
  background: #18191d;
  border: 1px solid #7b1fa2;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s ease;
}

.info-input:focus {
  border-color: #b39ddb;
  box-shadow: 0 0 0 2px rgba(123, 31, 162, 0.2);
}

/* Redes sociales */
.social-content {
  background: #23242a;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.empty-social {
  text-align: center;
  color: #bdbdbd;
}

.empty-social i {
  font-size: 2.5rem;
  color: #7b1fa2;
  margin-bottom: 1rem;
}

.empty-social p {
  margin-bottom: 1rem;
  font-size: 1rem;
}

.social-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.social-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #18191d;
  padding: 0.75rem;
  border-radius: 10px;
  border: 1px solid #35344a;
  transition: all 0.3s ease;
}

.social-item:hover {
  border-color: #7b1fa2;
  transform: translateY(-2px);
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
  text-decoration: none;
  flex: 1;
  font-size: 0.9rem;
}

.social-link i {
  font-size: 1.1rem;
  color: #7b1fa2;
}

.remove-social-btn {
  background: #dc2626;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s ease;
  font-size: 0.8rem;
}

.remove-social-btn:hover {
  background: #b91c1c;
}

.add-social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #7b1fa2;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0.75rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px dashed #b39ddb;
}

.add-social-btn:hover {
  background: #a259c4;
  transform: translateY(-2px);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: #23242a;
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.modal-header h3 {
  font-size: 1.5rem;
  color: #fff;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: #bdbdbd;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: #35344a;
  color: #fff;
}

.social-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #bdbdbd;
  font-weight: 500;
}

.form-select,
.form-input {
  padding: 0.75rem;
  background: #18191d;
  border: 1px solid #35344a;
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
}

.form-select:focus,
.form-input:focus {
  border-color: #7b1fa2;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #7b1fa2;
  color: #fff;
}

.btn-primary:hover {
  background: #a259c4;
}

.btn-secondary {
  background: #35344a;
  color: #fff;
}

.btn-secondary:hover {
  background: #4a4b5a;
}

/* Notificación */
.notification {
  position: fixed;
  top: 2rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 500;
  color: #fff;
  z-index: 1000;
  animation: slideIn 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.notification.success {
  background: #22c55e;
}

.notification.error {
  background: #dc2626;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.profile-not-seller,
.profile-loading {
  text-align: center;
  color: #dc2626;
  margin-top: 3rem;
  font-size: 1.2rem;
}

.profile-loading {
  color: #bdbdbd;
}

/* Responsive */
@media (max-width: 768px) {
  .seller-profile-container {
    padding: 1rem;
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }
  
  .profile-name {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .social-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .profile-actions {
    justify-content: center;
  }
  
  .edit-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .edit-btn,
  .save-btn,
  .cancel-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .profile-avatar,
  .profile-avatar-placeholder {
    width: 80px;
    height: 80px;
    font-size: 2rem;
  }
  
  .profile-name {
    font-size: 1.5rem;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .social-grid {
    grid-template-columns: 1fr;
  }
}
</style> 