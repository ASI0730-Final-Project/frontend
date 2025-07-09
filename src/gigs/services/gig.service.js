import httpInstance from '../../shared/services/http.instance'
import { GigAssembler } from '../services/gig.assembler'

const gigsEndpointPath = '/api/v1/Gig'
const usersEndpointPath = '/api/v1/User'

export class GigService {
  async getAllGigs() {
    try {
      const [gigsResponse, usersResponse] = await Promise.all([
        httpInstance.get(gigsEndpointPath),
        httpInstance.get(usersEndpointPath)
      ])

      const gigs = gigsResponse.data.data
      const users = usersResponse.data

      return gigs.map(dto => {
        const seller = users.find(user => user.id === dto.sellerId)
        const gigEntity = GigAssembler.fromDTO(dto)
        return {
          ...gigEntity,
          seller: seller || null
        }
      })
    } catch (error) {
      console.error('Error loading gigs:', error.response?.data || error.message)
      throw error
    }
  }

  async getGigById(id) {
    try {
      const gigResponse = await httpInstance.get(`${gigsEndpointPath}/${id}`)
      const dto = gigResponse.data
      const sellerResponse = await httpInstance.get(`${usersEndpointPath}/${dto.sellerId}`)

      const gigEntity = GigAssembler.fromDTO(dto)
      return {
        ...gigEntity,
        seller: sellerResponse.data || null
      }
    } catch (error) {
      console.error(`Error fetching gig with id ${id}:`, error.response?.data || error.message)
      throw error
    }
  }

  async createGig(gigData) {
    try {
      const dtoToSend = GigAssembler.toDTO(gigData)
      const response = await httpInstance.post(gigsEndpointPath, dtoToSend)
      return GigAssembler.fromDTO(response.data)
    } catch (error) {
      console.error('Error creating gig:', error.response?.data || error.message)
      throw error
    }
  }
}

export const gigService = new GigService()
