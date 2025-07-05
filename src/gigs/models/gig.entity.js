export class Gig {
  constructor(data = {}) {
    this.id = data.id || null
    this.title = data.title || ''
    this.description = data.description || ''
    this.tags = data.tags || []
    this.category = data.category || ''
    this.image = data.image || ''
    this.delivery_days = data.delivery_days || 0
    this.is_responsive = data.is_responsive ?? null
    this.revision_count = data.revision_count || 0
    this.page_count = data.page_count || 0
    this.extra_features = data.extra_features || []
    this.custom_animations = data.custom_animations ?? null
    this.price = data.price || 0
    this.seller_id = data.seller_id || null
  }
}
