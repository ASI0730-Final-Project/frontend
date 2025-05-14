import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isLoggedIn = ref(false)
  const router = useRouter()
  const API_URL = 'https://6823dd5865ba058033981a59.mockapi.io/users'

  // Función mejorada para verificar usuario
  const checkUserExists = async (email) => {
    try {
      const response = await fetch(`${API_URL}?email=${encodeURIComponent(email)}`)
      if (!response.ok) throw new Error('Network response was not ok')
      const data = await response.json()
      return data.length > 0 ? data[0] : null
    } catch (error) {
      console.error('Error checking user:', error)
      return null
    }
  }

  // Login mejorado
  const loginUser = async (email, password) => {
    try {
      const userData = await checkUserExists(email)
      
      if (!userData) {
        throw new Error('User not found')
      }

      if (userData.Password !== password) {
        throw new Error('Incorrect password')
      }

      user.value = userData
      isLoggedIn.value = true
      localStorage.setItem('user', JSON.stringify(userData))
      return userData
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  // Registro mejorado
  const registerUser = async (userData) => {
    try {
      const existingUser = await checkUserExists(userData.Email)
      
      if (existingUser) {
        throw new Error('Email already in use')
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Name: userData.Name,
          LastName: userData.LastName,
          Email: userData.Email,
          Password: userData.Password,
          Rol: userData.Rol,
          Image: userData.Image || ''
        })
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      const newUser = await response.json()
      user.value = newUser
      isLoggedIn.value = true
      localStorage.setItem('user', JSON.stringify(newUser))
      return newUser
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  // Logout
  const logoutUser = () => {
    user.value = null
    isLoggedIn.value = false
    localStorage.removeItem('user')
    router.push('/login')
  }

  // Inicialización
  const initializeUser = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      user.value = JSON.parse(storedUser)
      isLoggedIn.value = true
    }
  }

  return {
    user,
    isLoggedIn,
    loginUser,
    registerUser,
    logoutUser,
    initializeUser
  }
})