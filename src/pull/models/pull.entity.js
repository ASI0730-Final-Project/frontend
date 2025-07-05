// models/pull.entity.js
export class Pull {
  constructor(data = {}) {
    this.id = data.id || null;
    this.sellerId = data.sellerId || null;
    this.buyerId = data.buyerId || null;
    this.gigId = data.gigId || null;
    this.priceInit = data.priceInit || 0;
    this.priceUpdate = data.priceUpdate || 0;
    this.state = data.state || 'pending';
  }
}
