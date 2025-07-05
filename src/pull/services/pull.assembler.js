// assemblers/pull.assembler.js
import { Pull } from '../models/pull.entity';

export const pullAssembler = {
  fromJson(json) {
    return new Pull({
      id: json.id,
      sellerId: json.sellerId,
      buyerId: json.buyerId,
      gigId: json.gigId,
      priceInit: json.priceInit,
      priceUpdate: json.priceUpdate,
      state: json.state
    });
  },

  toJson(entity) {
    return {
      id: entity.id,
      sellerId: entity.sellerId,
      buyerId: entity.buyerId,
      gigId: entity.gigId,
      priceInit: entity.priceInit,
      priceUpdate: entity.priceUpdate,
      state: entity.state
    };
  }
};
