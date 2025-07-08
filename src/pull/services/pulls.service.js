import httpInstance from '../../shared/services/http.instance'

const apiBase = '/api/Pull'

export class PullService {
  async getPullsBySeller(sellerId) {
    return (await httpInstance.get(`${apiBase}?sellerId=${sellerId}`)).data
  }

  async getPullsByBuyer(buyerId) {
    return (await httpInstance.get(`${apiBase}?buyerId=${buyerId}`)).data
  }

  async getPullById(id) {
    return (await httpInstance.get(`${apiBase}/${id}`)).data
  }

  async createPull(pullData) {
    return (await httpInstance.post(apiBase, pullData)).data
  }

  async updatePullPrice(id, newPrice) {
    return (await httpInstance.put(`${apiBase}/${id}`, { newPrice })).data
  }

  async acceptPull(id) {
    return (await httpInstance.put(`${apiBase}/${id}`, { newState: 'in_process' })).data
  }

  async updatePull(id, { newPrice, newState }) {
    const payload = {}
    if (newPrice !== undefined) payload.newPrice = newPrice
    if (newState !== undefined) payload.newState = newState
    return (await httpInstance.put(`${apiBase}/${id}`, payload)).data
  }

  async deletePull(id) {
    return (await httpInstance.delete(`${apiBase}/${id}`)).data
  }

  async getPullsByRoleBuyer(userId) {
    return (await httpInstance.get(`${apiBase}/by-role?role=buyer&userId=${userId}`)).data
  }

  async getPullsByRoleSeller(userId) {
    return (await httpInstance.get(`${apiBase}/by-role?role=seller&userId=${userId}`)).data
  }
}

export const pullService = new PullService()
