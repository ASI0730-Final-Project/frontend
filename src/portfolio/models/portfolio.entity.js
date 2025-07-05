
export class Project {
  constructor({ title, description, price, time, gigLink }) {
    this.id = crypto.randomUUID() // Generar un ID temporal en frontend
    this.images = [] // Backend no lo proporciona aún
    this.title = title
    this.description = description
    this.price = price
    this.time = time
    this.gig_link = gigLink // Mapea gigLink a gig_link (para frontend)
  }
}

export class Portfolio {
  constructor({ id, sellerId, projects }) {
    this.id = id
    this.seller_id = sellerId // Convertir sellerId a seller_id
    this.projects = projects.map(project => new Project(project))
  }
}
