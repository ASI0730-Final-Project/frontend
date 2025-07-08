import httpInstance from '../../shared/services/http.instance'

const chatEndpointPath = import.meta.env.VITE_CHATS_ENDPOINT_PATH || '/api/v1/cchat'

class ChatService {
  /**
   * Obtiene los mensajes entre dos usuarios.
   * @param {number} senderId
   * @param {number} receiverId
   * @returns {Promise<Array<{ sender_id, content, timestamp }>>}
   */
  async getMessagesBetweenUsers(senderId, receiverId) {
    try {
      const { data } = await httpInstance.get(`${chatEndpointPath}/conversation`, {
        params: { senderId, receiverId }
      })

      // Adaptar al formato requerido por el componente
      return data.map(msg => ({
        sender_id: msg.senderId,
        content: msg.content,
        timestamp: msg.sentAt || msg.createdDate
      }))
    } catch (error) {
      console.error('Error fetching messages between users:', error)
      return []
    }
  }

  /**
   * Envía un nuevo mensaje entre dos usuarios.
   * @param {number} senderId
   * @param {number} receiverId
   * @param {string} content
   * @returns {Promise<object>}
   */
  async sendMessage(senderId, receiverId, content) {
    try {
      const payload = {
        senderId,
        receiverId,
        content
      }
      const { data } = await httpInstance.post(`${chatEndpointPath}`, payload)
      return data
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }
}

export const chatService = new ChatService()
