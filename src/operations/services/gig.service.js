import httpInstance from '../../shared/services/http.instance'

const gigsEndpointPath = '/gigs'
const usersEndpointPath = '/users'

export class GigService {
  async getAllGigs() {
    try {
      const [gigsResponse, usersResponse] = await Promise.all([
        httpInstance.get(gigsEndpointPath),
        httpInstance.get(usersEndpointPath)
      ])
      
      // Combinar gigs con información de usuarios
      return gigsResponse.data.map(gig => {
        const seller = usersResponse.data.find(user => user.id === gig.seller_id)
        return {
          ...gig,
          seller: seller || null
        }
      })
    } catch (error) {
      console.error('Error fetching gigs:', error)
      throw error
    }
  }

  async getGigById(id) {
    try {
      const gigResponse = await httpInstance.get(`${gigsEndpointPath}/${id}`)
      const sellerResponse = await httpInstance.get(`${usersEndpointPath}/${gigResponse.data.seller_id}`)
      
      return {
        ...gigResponse.data,
        seller: sellerResponse.data || null
      }
    } catch (error) {
      console.error(`Error fetching gig with id ${id}:`, error)
      throw error
    }
  }

  async createGig(gigData) {
    try {
      const response = await httpInstance.post(gigsEndpointPath, gigData)
      return response.data
    } catch (error) {
      console.error('Error creating gig:', error)
      throw error
    }
  }
}

export const gigService = new GigService()