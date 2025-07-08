<template>
  <div class="chat-container">
    <div class="messages" ref="messagesContainer">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['message', { 'message--own': String(message.sender_id) === String(senderId) }]"
      >
        <div class="message__sender">
          {{ String(message.sender_id) === String(senderId) ? 'Tú' : otherUserName }}
        </div>
        <div class="message__content">{{ message.content }}</div>
        <div class="message__time">{{ formatTime(message.timestamp) }}</div>
      </div>
    </div>

    <form @submit.prevent="sendMessage" class="message-form">
      <input
        v-model="newMessage"
        type="text"
        placeholder="Escribe un mensaje..."
        :disabled="isLoading"
        required
      />
      <button type="submit" :disabled="!newMessage.trim() || isLoading">
        {{ isLoading ? 'Enviando...' : 'Enviar' }}
      </button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted, watch, nextTick, onUnmounted } from 'vue'
import { chatService } from '../services/chat.service'

export default {
  name: 'ChatBox',
  props: {
    senderId: { type: Number, required: true },
    receiverId: { type: Number, required: true },
    otherUserName: { type: String, default: 'Otro' }
  },
  setup(props) {
    const messages = ref([])
    const newMessage = ref('')
    const messagesContainer = ref(null)
    const isLoading = ref(false)
    const isActive = ref(true)

    const fetchMessages = async () => {
      if (!isActive.value) return
      try {
        const fetchedMessages = await chatService.getMessagesBetweenUsers(props.senderId, props.receiverId)
        messages.value = fetchedMessages
        scrollToBottom()
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    }

    const sendMessage = async () => {
      if (!newMessage.value.trim() || isLoading.value) return
      try {
        isLoading.value = true
        await chatService.sendMessage(props.senderId, props.receiverId, newMessage.value.trim())
        newMessage.value = ''
        await fetchMessages()
      } catch (error) {
        console.error('Error sending message:', error)
      } finally {
        isLoading.value = false
      }
    }

    const scrollToBottom = () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
      })
    }

    const formatTime = (timestamp) => {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    let pollingInterval = null
    onMounted(() => {
      isActive.value = true
      fetchMessages()
      pollingInterval = setInterval(fetchMessages, 2000)
    })

    onUnmounted(() => {
      isActive.value = false
      if (pollingInterval) clearInterval(pollingInterval)
    })

    watch(messages, scrollToBottom)

    return {
      messages,
      newMessage,
      sendMessage,
      messagesContainer,
      formatTime,
      senderId: props.senderId,
      isLoading
    }
  }
}
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 400px;
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
  background: #1a1a1a;
  max-width: 100%;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 100%;
}

.message {
  max-width: 70%;
  padding: 0.75rem;
  border-radius: 1rem;
  background: #2a2a2a;
  color: #fff;
  word-break: break-word;
  width: fit-content;
}

.message--own {
  align-self: flex-end;
  background: #0084ff;
}

.message__sender {
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
  opacity: 0.8;
}

.message__content {
  margin-bottom: 0.25rem;
  word-break: break-word;
}

.message__time {
  font-size: 0.75rem;
  opacity: 0.7;
  text-align: right;
}

.message-form {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #242424;
  border-top: 1px solid #333;
  flex-wrap: wrap;
}

input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #333;
  border-radius: 0.5rem;
  background: #1a1a1a;
  color: #fff;
  min-width: 0;
}

input::placeholder {
  color: #666;
}

button {
  padding: 0.75rem 1.5rem;
  background: #0084ff;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  min-width: 100px;
}

button:hover:not(:disabled) {
  background: #0073e6;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .chat-container {
    height: 300px;
    padding: 0.5rem;
  }
  .messages {
    padding: 0.5rem;
    gap: 0.5rem;
  }
  .message {
    max-width: 90%;
    font-size: 0.95rem;
    padding: 0.5rem;
  }
  .message-form {
    gap: 0.5rem;
    padding: 0.5rem;
  }
  button {
    padding: 0.5rem 1rem;
    min-width: 80px;
  }
}
</style>