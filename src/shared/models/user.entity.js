export class User {
  constructor(data = {}) {
    this.id = data.id || null
    this.name = data.name || ''
    this.lastname = data.lastname || ''
    this.email = data.email || ''
    this.password = data.password || ''
    this.role = data.role || 'buyer'
    this.image = data.image || ''
  }
}