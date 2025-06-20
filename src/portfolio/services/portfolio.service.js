import httpInstance from '../../shared/services/http.instance.js'
import { PortfolioAssembler } from './portfolio.assembler.js'

const portfolioEndpoint = '/Portfolio'

export class PortfolioService {
  async getPortfolioBySellerId(sellerId) {
    const response = await httpInstance.get(`${portfolioEndpoint}?seller_id=${sellerId}`)
    if (response.data.length === 0) return null
    return PortfolioAssembler.fromDTO(response.data[0])
  }

  async createPortfolio(portfolioDTO) {
    const response = await httpInstance.post(portfolioEndpoint, portfolioDTO)
    return PortfolioAssembler.fromDTO(response.data)
  }

  async updatePortfolio(portfolioId, updatedPortfolioDTO) {
    const response = await httpInstance.put(`${portfolioEndpoint}/${portfolioId}`, updatedPortfolioDTO)
    return PortfolioAssembler.fromDTO(response.data)
  }

  async addProject(portfolioId, newProject) {
    const response = await httpInstance.get(`${portfolioEndpoint}/${portfolioId}`)
    const portfolio = response.data
    if (!portfolio.projects) portfolio.projects = []
    newProject.id = crypto.randomUUID()
    portfolio.projects.push(newProject)
    return await this.updatePortfolio(portfolioId, portfolio)
  }

  async updateProject(portfolioId, updatedProject) {
    const response = await httpInstance.get(`${portfolioEndpoint}/${portfolioId}`)
    const portfolio = response.data
    const index = portfolio.projects.findIndex(p => p.id === updatedProject.id)
    if (index !== -1) {
      portfolio.projects[index] = updatedProject
      return await this.updatePortfolio(portfolioId, portfolio)
    }
  }
}

export const portfolioService = new PortfolioService()
