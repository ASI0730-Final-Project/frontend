<script>
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './language-switcher.component.vue'
import { useRouter } from 'vue-router'
import { computed, ref, onMounted, watch } from 'vue'
import { authService } from '../../shared/services/auth.service'

export default {
  name: "toolbar-component",
  components: { Button, Toolbar, LanguageSwitcher, Avatar },
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const isMenuOpen = ref(false)
    const user = ref(null)

    // Carga usuario llamando al servicio que usa /me y cache local
    const loadUser = async () => {
      const currentUser = await authService.getCurrentUser()
      user.value = currentUser
    }

    onMounted(loadUser)

    // Refresca usuario cuando cambia ruta
    watch(
      () => router.currentRoute.value,
      () => loadUser(),
      { immediate: true }
    )

    const hasImage = computed(() => {
      return user.value?.image && user.value.image.trim() !== ''
    })

    const getInitials = () => {
      if (!user.value) return ''
      const firstName = user.value.name || ''
      const lastName = user.value.lastname || ''
      return `${firstName.charAt(0)}${lastName.charAt(0)}`
    }

    const navigationRoutes = computed(() => {
      if (!user.value) {
        return [{ name: 'home', label: 'toolbar.home' }]
      }
      if (user.value.role === 'buyer' || user.value.rol === 'buyer') {
        return [
          { name: 'gigs', label: 'toolbar.gigs' },
          { name: 'buyerPullListView', label: 'toolbar.myPulls' }
        ]
      }
      if (user.value.role === 'seller' || user.value.rol === 'seller') {
        return [
          { name: 'sellerGigs', label: 'toolbar.myGigs' },
          { name: 'createGig', label: 'toolbar.createGig' },
          { name: 'pullListView', label: 'toolbar.myPulls' }
        ]
      }
      return []
    })

    const navigateTo = (routeName) => {
      router.push({ name: routeName })
    }

    const logout = async () => {
      try {
        authService.logout()
        user.value = null
        router.push({ name: 'login', query: { timestamp: Date.now() } })
        setTimeout(() => window.location.reload(), 100)
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value
    }

    const handleNavigate = (routeName) => {
      navigateTo(routeName)
      toggleMenu()
    }

    return {
      t,
      navigationRoutes,
      navigateTo,
      user,
      logout,
      getInitials,
      hasImage,
      isMenuOpen,
      toggleMenu,
      handleNavigate
    }
  }
}
</script>

<template>
  <Toolbar
    class="my_toolbar p-px-4 py-3 flex justify-content-between align-items-center"
    aria-label="App toolbar"
  >
    <template #start>
      <div class="flex align-items-center gap-3">
        <img 
          src="/gigu.png" 
          alt="GigU Logo" 
          @click="navigateTo(user ? (user.role === 'seller' ? 'sellerGigs' : 'gigs') : 'home')"
          style="height: 48px; width: auto; cursor: pointer;"
        />
        <div class="desktop-nav flex gap-2 ml-4">
          <Button
            v-for="route in navigationRoutes"
            :key="route.name"
            :label="t(route.label)"
            class="p-button-text text-white hover:border-white transition-all"
            @click="navigateTo(route.name)"
            :aria-label="t(route.label)"
          />
        </div>
      </div>
    </template>

    <template #end>
      <div class="flex align-items-center gap-3">
        <div class="desktop-auth flex align-items-center gap-3">
          <template v-if="user">
            <div style="cursor:pointer;display:flex;align-items:center;gap:0.5rem" @click="navigateTo(user.role === 'buyer' ? 'buyerProfile' : 'userProfile')">
              <Avatar
                v-if="hasImage"
                :image="user.image"
                class="mr-2"
                size="large"
                shape="circle"
              />
              <Avatar 
                v-else
                :label="getInitials()"
                class="mr-2"
                size="large"
                shape="circle"
                :style="{
                  backgroundColor: '#7b1fa2',
                  color: 'white'
                }"
              />
            </div>
            <Button
              :label="t('auth.logout')"
              class="p-button-text text-white"
              @click="logout"
            />
          </template>
          <template v-else>
            <Button
              :label="t('auth.login')"
              class="p-button-text text-white"
              @click="navigateTo('login')"
            />
            <Button
              :label="t('auth.register')"
              class="p-button-text text-white"
              @click="navigateTo('register')"
            />
          </template>
          <LanguageSwitcher />
        </div>
        <Button
          icon="pi pi-bars"
          class="mobile-hamburger p-button-text text-white"
          @click="toggleMenu"
          aria-label="Toggle Menu"
        />
      </div>
    </template>
  </Toolbar>

  <div v-if="isMenuOpen" class="mobile-menu-overlay" @click="toggleMenu">
    <div class="mobile-menu" @click.stop>
      <div class="flex flex-column gap-2">
        <Button
          v-for="route in navigationRoutes"
          :key="route.name"
          :label="t(route.label)"
          class="p-button-text text-white w-full"
          @click="handleNavigate(route.name)"
        />
      </div>
      
      <hr>

      <div class="flex flex-column gap-2">
        <template v-if="user">
          <div 
            class="user-info"
            @click="handleNavigate(user.role === 'buyer' ? 'buyerProfile' : 'userProfile')"
          >
            <Avatar
              v-if="hasImage"
              :image="user.image"
              size="large"
              shape="circle"
            />
            <Avatar 
              v-else
              :label="getInitials()"
              size="large"
              shape="circle"
              :style="{ backgroundColor: '#7b1fa2', color: 'white' }"
            />
            <span>{{ user.name }} {{ user.lastname }}</span>
          </div>
          <Button
            :label="t('auth.logout')"
            class="p-button-text text-white w-full"
            @click="logout(); toggleMenu()"
          />
        </template>
        <template v-else>
          <Button
            :label="t('auth.login')"
            class="p-button-text text-white w-full"
            @click="handleNavigate('login')"
          />
          <Button
            :label="t('auth.register')"
            class="p-button-text text-white w-full"
            @click="handleNavigate('register')"
          />
        </template>
      </div>

      <div class="language-switcher-container">
        <LanguageSwitcher />
      </div>
    </div>
  </div>
</template>

<style scoped>
.my_toolbar {
  background-color: #4a148c;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.p-button-text {
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.p-button-text:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

.desktop-nav, .desktop-auth {
  display: flex;
}

.mobile-hamburger {
  display: none;
}

@media (max-width: 768px) {
  .desktop-nav, .desktop-auth {
    display: none;
  }
  .mobile-hamburger {
    display: inline-flex;
  }
}

.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  transition: opacity 0.3s ease;
}

.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100%;
  background-color: #23242a;
  padding: 1.5rem 0;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: slideInFromRight 0.3s ease-out;
}

.mobile-menu .p-button-text {
  color: white;
  width: 100%;
  justify-content: flex-start;
  padding: 0.75rem 1.5rem;
  border-radius: 0;
  font-size: 1rem;
}

.mobile-menu .p-button-text:hover {
  background-color: #4a148c;
}

.mobile-menu .user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  color: white;
  transition: background-color 0.2s ease;
}
.mobile-menu .user-info:hover {
  background-color: #4a148c;
}

.mobile-menu hr {
  border-color: #4a148c;
  margin: 0.5rem 1.5rem;
  border-width: 0.5px;
}

.mobile-menu .language-switcher-container {
  padding: 0 1.5rem;
  margin-top: auto;
}

@keyframes slideInFromRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>
