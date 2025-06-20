import httpInstance from '../../shared/services/http.instance'

const pullsEndpointPath = '/pulls'

export class PullService {
  // GET - Obtener pulls por vendedor
  async getPullsBySeller(sellerId) {
    return (await httpInstance.get(`${pullsEndpointPath}?seller_id=${sellerId}`)).data
  }

  // GET - Obtener pulls por comprador
  async getPullsByBuyer(buyerId) {
    return (await httpInstance.get(`${pullsEndpointPath}?buyer_id=${buyerId}`)).data
  }

  // GET - Obtener un pull por ID
  async getPullById(id) {
    return (await httpInstance.get(`${pullsEndpointPath}/${id}`)).data
  }

  // POST - Crear un nuevo pull
  async createPull(pullData) {
    return (await httpInstance.post(pullsEndpointPath, pullData)).data
  }

  // PUT - Actualizar solo el precio de la oferta
  async updatePullPrice(id, newPrice) {
    // Obtener el objeto actual
    const current = await this.getPullById(id);
    // Actualizar solo el campo necesario
    const updated = { ...current, price_update: newPrice };
    // Hacer el PUT con el objeto completo
    return (await httpInstance.put(`${pullsEndpointPath}/${id}`, updated)).data;
  }

  // PUT - Aceptar un pull (solo cambia el estado)
  async acceptPull(id) {
    const current = await this.getPullById(id);
    const updated = { ...current, state: 'in_process' };
    return (await httpInstance.put(`${pullsEndpointPath}/${id}`, updated)).data;
  }

  // PUT - Actualizar cualquier campo (uso general)
  async updatePull(id, data) {
    const current = await this.getPullById(id);
    const updated = { ...current, ...data };
    return (await httpInstance.put(`${pullsEndpointPath}/${id}`, updated)).data;
  }

  // DELETE - Eliminar un pull
  async deletePull(id) {
    return (await httpInstance.delete(`${pullsEndpointPath}/${id}`)).data
  }

  // Simulación de puja en tiempo real (para integración futura con WebSocket)
  // async subscribeToPullUpdates(pullId, callback) {
  //   // Aquí iría la lógica de WebSocket para escuchar cambios en el pull
  // }
}

export const pullService = new PullService() 