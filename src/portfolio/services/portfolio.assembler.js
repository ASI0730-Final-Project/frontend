import { Portfolio } from '../models/portfolio.entity'

export class PortfolioAssembler {
  static fromDTO(dto) {
    return new Portfolio(dto)
  }

  static toDTO(entity) {
    return {
      id: entity.id,
      seller_id: entity.seller_id,
      projects: entity.projects
    }
  }
}
