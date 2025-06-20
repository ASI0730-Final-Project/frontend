import { Pull } from '../models/pull.entity'

export const pullAssembler = {
  fromJson(json) {
    return new Pull({
      id: json.id,
      seller_id: json.seller_id,
      buyer_id: json.buyer_id,
      gig_id: json.gig_id,
      price_init: json.price_init,
      price_update: json.price_update,
      state: json.state
    })
  },
  toJson(entity) {
    return {
      id: entity.id,
      seller_id: entity.seller_id,
      buyer_id: entity.buyer_id,
      gig_id: entity.gig_id,
      price_init: entity.price_init,
      price_update: entity.price_update,
      state: entity.state
    }
  }
}
