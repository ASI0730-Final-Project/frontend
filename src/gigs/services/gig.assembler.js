import { Gig } from '../models/gig.entity'

export class GigAssembler {
  static fromDTO(dto) {
    return new Gig({
      id: dto.id,
      title: dto.title,
      description: dto.description,
      tags: dto.tags || [],
      category: dto.category,
      image: dto.image,
      delivery_days: dto.deliveryDays,
      is_responsive: dto.isResponsive,
      revision_count: dto.revisionCount,
      page_count: dto.pageCount,
      extra_features: dto.extraFeatures || [],
      custom_animations: dto.customAnimations,
      price: dto.price,
      seller_id: dto.sellerId
    })
  }

  static toDTO(gigEntity) {
    return {
      id: gigEntity.id,
      title: gigEntity.title,
      description: gigEntity.description,
      tags: gigEntity.tags,
      category: gigEntity.category,
      image: gigEntity.image,
      deliveryDays: gigEntity.delivery_days,
      isResponsive: gigEntity.is_responsive,
      revisionCount: gigEntity.revision_count,
      pageCount: gigEntity.page_count,
      extraFeatures: gigEntity.extra_features,
      customAnimations: gigEntity.custom_animations,
      price: gigEntity.price,
      sellerId: gigEntity.seller_id
    }
  }
}
