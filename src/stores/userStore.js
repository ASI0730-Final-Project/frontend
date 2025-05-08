// src/stores/userStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isLoggedIn = ref(false)

  function setUser(userData) {
    user.value = userData
    isLoggedIn.value = true
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function logout() {
    user.value = null
    isLoggedIn.value = false
    localStorage.removeItem('user')
  }

  function loadUserFromStorage() {
    const storedUser = JSON.parse(localStorage.getItem('user'))
    if (storedUser) {
      user.value = storedUser
      isLoggedIn.value = true
    }
  }

  return {
    user,
    isLoggedIn,
    setUser,
    logout,
    loadUserFromStorage,
  }
})
