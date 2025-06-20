export class Pull {
  constructor({ id, seller_id, buyer_id, gig_id, price_init, price_update, state }) {
    this.id = id
    this.seller_id = seller_id
    this.buyer_id = buyer_id
    this.gig_id = gig_id
    this.price_init = price_init
    this.price_update = price_update
    this.state = state
  }
} 