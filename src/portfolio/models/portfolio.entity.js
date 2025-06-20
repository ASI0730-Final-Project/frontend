export class Project {
  constructor({ id, images, title, description, price, time, gig_link }) {
    this.id = id
    this.images = images
    this.title = title
    this.description = description
    this.price = price
    this.time = time
    this.gig_link = gig_link
  }
}

export class Portfolio {
  constructor({ id, seller_id, projects }) {
    this.id = id
    this.seller_id = seller_id
    this.projects = projects.map(project => new Project(project))
  }
}
