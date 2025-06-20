import httpInstance from '../../shared/services/http.instance'
import { chatAssembler } from './chat.assembler'

const chatEndpointPath = import.meta.env.VITE_CHATS_ENDPOINT_PATH || '/chats'

class ChatService {
  async getAll() {
    try {
      const { data } = await httpInstance.get(chatEndpointPath)
      return data
    } catch (error) {
      console.error('Error fetching chats:', error)
      throw error
    }
  }

  async getById(chatId) {
    try {
      const { data } = await httpInstance.get(`${chatEndpointPath}/${chatId}`)
      return data
    } catch (error) {
      console.error(`Error fetching chat by ID ${chatId}:`, error)
      throw error
    }
  }

  async getByPullId(pullId) {
    try {
      const { data } = await httpInstance.get(`${chatEndpointPath}?pull_id=${pullId}`)
      return data.length > 0 ? chatAssembler.fromJson(data[0]) : null
    } catch (error) {
      console.error(`Error fetching chat for pull_id=${pullId}:`, error)
      throw error
    }
  }

  async createChat(pullId, user1Id, user2Id) {
    try {
      const chat = {
        pull_id: pullId,
        user_1_id: user1Id,
        user_2_id: user2Id,
        messages: []
      }

      const { data } = await httpInstance.post(chatEndpointPath, chat)
      return chatAssembler.fromJson(data)
    } catch (error) {
      console.error('Error creating chat:', error)
      throw error
    }
  }

  async addMessage(chatId, message) {
    try {
      const chat = await this.getById(chatId)
      chat.messages.push(message)

      const { data } = await httpInstance.put(
        `${chatEndpointPath}/${chatId}`,
        chat
      )
      return data
    } catch (error) {
      console.error(`Error adding message to chat ID ${chatId}:`, error)
      throw error
    }
  }

  async sendMessageForPull(pullId, senderId, content) {
    try {
      let chat = await this.getByPullId(pullId)
      if (!chat) {
        const pull = await import('../../pull/services/pulls.service').then(m => m.pullService.getPullById(pullId))
        const user1Id = pull.seller_id
        const user2Id = pull.buyer_id
        chat = await this.createChat(pullId, user1Id, user2Id)
      }
      const message = {
        sender_id: senderId,
        content: content,
        timestamp: new Date().toISOString()
      }
      chat.addMessage(message)
      const { data } = await httpInstance.put(
        `${chatEndpointPath}/${chat.id}`,
        chatAssembler.toJson(chat)
      )
      return chatAssembler.fromJson(data)
    } catch (error) {
      console.error('Error sending message for pull:', error)
      throw error
    }
  }

  async getMessagesByPullId(pullId) {
    try {
      const chat = await this.getByPullId(pullId)
      return chat?.messages || []
    } catch (error) {
      console.error(`Error getting messages for pull_id=${pullId}:`, error)
      return []
    }
  }

  async deleteChatByPullId(pullId) {
    try {
      const { data } = await httpInstance.get(`${chatEndpointPath}?pull_id=${pullId}`)
      if (data.length > 0) {
        const chatId = data[0].id
        await httpInstance.delete(`${chatEndpointPath}/${chatId}`)
      }
    } catch (error) {
      console.error(`Error deleting chat for pull_id=${pullId}:`, error)
    }
  }
}

export const chatService = new ChatService()
