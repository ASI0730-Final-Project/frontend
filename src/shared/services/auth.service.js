import httpInstance from './http.instance'

const usersEndpointPath = '/api/v1/User'

export class AuthService {
  async login(credentials) {
  try {
    const response = await httpInstance.post(
      `${usersEndpointPath}/login`,
      credentials
    )

    const token = response.data
    if (token) {
      localStorage.setItem('token', token)

     
      const userResponse = await httpInstance.get(`${usersEndpointPath}/me`)
      const user = userResponse.data
      localStorage.setItem('user', JSON.stringify(user))

      return { token, user }
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
        role: userData.role || 'buyer',
        image: userData.image || ''
      }
      const response = await httpInstance.post(
        `${usersEndpointPath}/sign-up`,
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
      if (userData) {
        return JSON.parse(userData)
      }

      const response = await httpInstance.get(`${usersEndpointPath}/me`)
      const user = response.data
      localStorage.setItem('user', JSON.stringify(user))
      return user
    } catch (error) {
      console.error('Error fetching current user:', error)
      localStorage.removeItem('user')
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

  async updateUserImage(userId, imageBase64) {
    try {
      const response = await httpInstance.put(
        `${usersEndpointPath}/${userId}/image`,
        { image: imageBase64 }
      )
      return response.data
    } catch (error) {
      console.error('Error updating user image:', error)
      throw error
    }
  }

 
  async updateUser(userId, updatedData) {
    try {
      const response = await httpInstance.put(
        `${usersEndpointPath}/${userId}`,
        updatedData
      )
     
      const currentUser = JSON.parse(localStorage.getItem('user'))
      if (currentUser && currentUser.id === userId) {
        const newUser = { ...currentUser, ...updatedData }
        localStorage.setItem('user', JSON.stringify(newUser))
      }
      return response.data
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  getToken() {
    return localStorage.getItem('token')
  }
}

export const authService = new AuthService()
