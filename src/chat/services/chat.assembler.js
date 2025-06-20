import { Chat } from '../models/chat.entity'

export const chatAssembler = {
  fromJson(json) {
    return new Chat({
      id: json.id,
      user_1_id: json.user_1_id,
      user_2_id: json.user_2_id,
      messages: json.messages || []
    })
  },

  toJson(entity) {
    return {
      id: entity.id,
      user_1_id: entity.user_1_id,
      user_2_id: entity.user_2_id,
      messages: entity.messages
    }
  }
}
