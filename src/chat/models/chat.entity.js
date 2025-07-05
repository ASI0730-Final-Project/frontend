export class Chat {
  constructor({ id, user_1_id, user_2_id, messages = [] }) {
    this.id = id
    this.user_1_id = user_1_id
    this.user_2_id = user_2_id
    this.messages = messages
  }

  addMessage(message) {
    this.messages.push(message)
  }
}
