import httpInstance from './http.instance'

const usersEndpointPath = '/users'

export class AuthService {
  async login(credentials) {
    try {
      const response = await httpInstance.get(
        `${usersEndpointPath}?email=${credentials.email}&password=${credentials.password}`
      )
      
      console.log('Login response:', response.data)
      
      if (response.data && response.data.length > 0) {
        return response.data[0]
      }
      return null
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  async register(userData) {
    try {
      const userToCreate = {
        ...userData,
        rol: userData.role || userData.rol || 'buyer'
      }
      
      const response = await httpInstance.post(
        usersEndpointPath,
        userToCreate
      )
      return response.data
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  async getCurrentUser() {
    try {
      const userData = localStorage.getItem('user')
      if (!userData) return null
      
      const user = JSON.parse(userData)
      const response = await httpInstance.get(`${usersEndpointPath}/${user.id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching current user:', error)
      return null
    }
  }

  async getUserById(id) {
    try {
      const response = await httpInstance.get(`${usersEndpointPath}/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching user by id:', error)
      return null
    }
  }
}

export const authService = new AuthService()