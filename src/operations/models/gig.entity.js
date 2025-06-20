export class Gig {
  constructor(data = {}) {
    this.id = data.id || null
    this.title = data.title || ''
    this.description = data.description || ''
    this.price = data.price || 0
    this.createdAt = data.createdAt || new Date().toISOString()
    this.id_user = data.id_user || null
    this.category = data.category || ''
    this.delivery_days = data.delivery_days || 0
  }
}