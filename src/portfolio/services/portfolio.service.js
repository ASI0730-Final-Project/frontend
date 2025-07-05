import httpInstance from '../../shared/services/http.instance.js'
import { PortfolioAssembler } from './portfolio.assembler.js'

const portfolioEndpoint = '/api/v1/Briefcase'

function toUpdateDTO(portfolio) {
  return {
    id: portfolio.id,
    name: portfolio.name || portfolio.title || 'Unnamed Portfolio',
    description: portfolio.description || '',
    publishDate: new Date(), // o usa la original si la tienes
    projects: portfolio.projects || [],
    sellerId: portfolio.sellerId
  }
}

export class PortfolioService {
  async getPortfolioBySellerId(sellerId) {
    const response = await httpInstance.get(`${portfolioEndpoint}/by-seller/${sellerId}`)
    return PortfolioAssembler.fromDTO(response.data)
  }

  async createPortfolio(portfolioDTO) {
    await httpInstance.post(portfolioEndpoint, portfolioDTO)
    return await this.getPortfolioBySellerId(portfolioDTO.sellerId)
  }

  async updatePortfolio(portfolioId, updatedPortfolio) {
    if (!portfolioId) throw new Error('updatePortfolio: portfolioId is required')
    
    const updateDTO = toUpdateDTO(updatedPortfolio)

    await httpInstance.put(`${portfolioEndpoint}/${portfolioId}`, updateDTO)
    return await this.getPortfolioBySellerId(updateDTO.sellerId)
  }

  async addProject(portfolioId, newProject) {
    if (!portfolioId) throw new Error('addProject: portfolioId is required')

    const response = await httpInstance.get(`${portfolioEndpoint}/by-seller/${portfolioId}`)
    const portfolio = response.data

    if (!portfolio.projects) portfolio.projects = []
    newProject.id = crypto.randomUUID()
    portfolio.projects.push(newProject)

    return await this.updatePortfolio(portfolio.id, portfolio)
  }

  async updateProject(portfolioId, updatedProject) {
  if (!portfolioId) throw new Error('updateProject: portfolioId is required')
  if (!updatedProject?.id) throw new Error('updateProject: updatedProject.id is required')

  // 🔥 En lugar de hacer un GET por seller (incorrecto), hacemos un GET por ID
  const response = await httpInstance.get(`${portfolioEndpoint}/${portfolioId}`)
  const portfolio = response.data

  if (!portfolio.projects || portfolio.projects.length === 0) {
    throw new Error('updateProject: no projects found in portfolio')
  }

  const index = portfolio.projects.findIndex(p => p.id === updatedProject.id)
  if (index === -1) {
    throw new Error(`updateProject: project with id ${updatedProject.id} not found`)
  }

  portfolio.projects[index] = updatedProject

  // Hacemos un PUT para actualizar el portafolio entero
  return await this.updatePortfolio(portfolio.id, portfolio)
}


  async deletePortfolio(portfolioId) {
    if (!portfolioId) throw new Error('deletePortfolio: portfolioId is required')
    await httpInstance.delete(`${portfolioEndpoint}/${portfolioId}`)
  }

  
}

export const portfolioService = new PortfolioService()
