<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { authService } from '../services/auth.service'

const { t } = useI18n()
const user = ref(null)
const isEditing = ref(false)
const editedUser = ref({})

const buyerStats = ref({
  totalPulls: 12,
  completedPulls: 8,
  activePulls: 2,
  totalSpent: 1250.50
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

onMounted(async () => {
  user.value = await authService.getCurrentUser()
  if (user.value) {
    if (user.value.rol && !user.value.role) user.value.role = user.value.rol
    if (user.value.role) user.value.role = user.value.role.toLowerCase().trim()
  }
})
</script>

<template>
  <div v-if="user && user.role === 'buyer'" class="buyer-profile-container">
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
        <p class="profile-role">{{ t('auth.role') }}: {{ t('auth.buyer') }}</p>
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

    <div class="stats-section">
      <h2 class="section-title">{{ t('profile.performance') }}</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="pi pi-shopping-cart"></i>
          </div>
          <div class="stat-content">
            <h3>{{ buyerStats.totalPulls }}</h3>
            <p>{{ t('profile.totalPulls') }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="pi pi-check-circle"></i>
          </div>
          <div class="stat-content">
            <h3>{{ buyerStats.completedPulls }}</h3>
            <p>{{ t('profile.completedPulls') }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="pi pi-clock"></i>
          </div>
          <div class="stat-content">
            <h3>{{ buyerStats.activePulls }}</h3>
            <p>{{ t('profile.activePulls') }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="pi pi-dollar"></i>
          </div>
          <div class="stat-content">
            <h3>S/ {{ buyerStats.totalSpent.toFixed(2) }}</h3>
            <p>{{ t('profile.totalSpent') }}</p>
          </div>
        </div>
      </div>
    </div>

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
          <div class="info-value">{{ t('auth.buyer') }}</div>
        </div>
      </div>
    </div>

    <div v-if="notification.show" :class="['notification', notification.type]">
      {{ notification.message }}
    </div>
  </div>
  
  <div v-else-if="user && user.role !== 'buyer'" class="profile-not-buyer">
    {{ t('profile.onlyBuyer') }}
  </div>
  
  <div v-else class="profile-loading">
    {{ t('profile.loading') }}
  </div>
</template>

<style scoped>
.buyer-profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: #18191d;
  min-height: 100vh;
  color: #fff;
}

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

.stats-section {
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
  grid-template-columns: repeat(2, 1fr);
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

.personal-info-section {
  background: #23242a;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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

.notification {
  position: fixed;
  top: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 500;
  color: #fff;
  z-index: 1000;
  animation: slideIn 0.3s ease;
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

.profile-not-buyer,
.profile-loading {
  text-align: center;
  color: #b71c1c;
  margin-top: 3rem;
  font-size: 1.2rem;
}

.profile-loading {
  color: #bdbdbd;
}

@media (max-width: 768px) {
  .buyer-profile-container {
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
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
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
}
</style> 
