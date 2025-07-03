<template>
  <main class="service-overview" role="main" aria-labelledby="service-overview-heading">
    <nav class="overview-nav" role="navigation" aria-label="Service overview sections">
      <ul role="list">
        <li role="listitem" class="active" aria-current="page">Overview</li>
        <li role="listitem">Description</li>
        <li role="listitem">About the seller</li>
        <li role="listitem">Compare packages</li>
        <li role="listitem">Recommendations</li>
        <li role="listitem">Reviews</li>
      </ul>
    </nav>

    <section class="overview-section" aria-labelledby="service-banner-heading">
      <h2 id="service-banner-heading" class="sr-only">Service Banner</h2>
      <img
        :src="serviceData.imgSrc || serviceData.bannerUrl"
        :alt="serviceData.description || 'Service banner image'"
        class="banner-image"
      />
    </section>

    <section class="description-section" aria-labelledby="about-service-heading">
      <h2 id="about-service-heading">About this Gig</h2>
      <p>{{ serviceData.description || serviceData.fullDescription }}</p>
      <div v-if="serviceData.detailImage" class="detail-image">
        <img
          :src="serviceData.detailImage"
          :alt="'Detailed view of ' + (serviceData.description || 'the service')"
        />
      </div>
    </section>

    <section class="seller-section" aria-labelledby="about-seller-heading">
      <h2 id="about-seller-heading">About the seller</h2>
      <div class="seller-info">
        <img
          :src="serviceData.sellerAvatar"
          :alt="'Profile picture of ' + serviceData.sellerName"
          class="seller-avatar"
        />
        <div class="seller-details">
          <p class="seller-name">{{ serviceData.sellerName }}</p>
        </div>
      </div>
    </section>

    <section class="packages-section" aria-labelledby="packages-heading">
      <h2 id="packages-heading">Compare packages</h2>
      <div class="pricing-box" role="region" aria-labelledby="basic-package-heading">
        <div class="price-header">
          <span id="basic-package-heading" class="start-label">Start price</span>
          <span class="price">{{ serviceData.currency }}{{ serviceData.price || serviceData.startingPrice }}</span>
        </div>
        <p class="package-title">Basic Package Only</p>
        <p class="package-desc">Laptop-scenes Includes, Background Music, Logo, and 720HD Video</p>
        <div class="delivery-revision">
          <div class="delivery">
            <span class="icon" aria-hidden="true">&#9200;</span>
            <span>4 - 12 Days Delivery</span>
          </div>
          <div class="revision">
            <span class="icon" aria-hidden="true">&#8635;</span>
            <span>1 Revision</span>
          </div>
        </div>
        <ul class="features-list" role="list">
          <li role="listitem"><span class="check" aria-hidden="true">&#10003;</span> 8 captions</li>
          <li role="listitem"><span class="check" aria-hidden="true">&#10003;</span> 5 screenshots</li>
          <li role="listitem"><span class="check" aria-hidden="true">&#10003;</span> Screen recording</li>
          <li role="listitem"><span class="check" aria-hidden="true">&#10003;</span> Add logo</li>
          <li role="listitem"><span class="check" aria-hidden="true">&#10003;</span> Dynamic transitions</li>
          <li role="listitem"><span class="check" aria-hidden="true">&#10003;</span> 30 seconds running time</li>
        </ul>
      </div>
    </section>

    <section class="reviews-section" aria-labelledby="reviews-heading">
      <h2 id="reviews-heading">Reviews ({{ serviceData.reviews ? serviceData.reviews.length : 0 }})</h2>
      <div
        v-for="review in serviceData.reviews || []"
        :key="review.id"
        class="review"
        role="article"
        :aria-labelledby="'review-heading-' + review.id"
      >
        <h3 :id="'review-heading-' + review.id" class="sr-only">Review by {{ review.reviewer }}</h3>
        <div class="review-stars" aria-label="Rating: ${review.rating} out of 5 stars">
          <span
            v-for="n in Math.round(review.rating)"
            :key="n"
            class="star"
            aria-hidden="true"
          >&#9733;</span>
          <span
            v-for="n in (5 - Math.round(review.rating))"
            :key="n"
            class="star inactive"
            aria-hidden="true"
          >&#9733;</span>
        </div>
        <p class="review-comment">"{{ review.comment }}"</p>
        <p class="reviewer-name">- {{ review.reviewer }}</p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed } from 'vue';
import { selectedService } from '@/composables/useSelectedService';

const serviceData = computed(() => {
  return selectedService.value || {
    id: "default",
    bannerUrl: "https://via.placeholder.com/1200x400?text=Default+Service+Banner",
    detailImage: "https://via.placeholder.com/800x400?text=Default+Service+Detail",
    fullDescription: "This is a default service description. No card information was selected.",
    description: "Default description",
    price: 286,
    currency: "S/.",
    startingPrice: 286,
    reviews: [
      {
        id: "rev1",
        rating: 4,
        comment: "Default review message.",
        reviewer: "Client A"
      }
    ],
    sellerName: "Default Seller"
  };
});
</script>

<style scoped>
.service-overview {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #fff;
  color: #333;
  font-size: 0.9rem;
}

.overview-nav {
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
}
.overview-nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0 20px;
}
.overview-nav li {
  padding: 12px 16px;
  cursor: pointer;
  font-size: 0.95rem;
  color: #555;
}
.overview-nav li.active {
  color: #0f2c32;
  border-bottom: 3px solid #0f2c32;
}

.overview-section {
  text-align: center;
  padding: 20px;
}
.banner-image {
  width: 50%;
  height: auto;
  object-fit: cover;
  border-radius: 4px;
}

.description-section,
.seller-section,
.packages-section,
.reviews-section {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.description-section h2,
.seller-section h2,
.packages-section h2,
.reviews-section h2 {
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: #0f2c32;
}

.description-section p,
.seller-section p,
.packages-section p,
.reviews-section p {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #444;
}

.detail-image {
  margin-top: 10px;
  text-align: center;
}
.detail-image img {
  width: 100%;
  max-width: 800px;
  border-radius: 4px;
}

.seller-info {
  display: flex;
  align-items: center;
  gap: 15px;
}
.seller-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}
.seller-details p {
  margin: 2px 0;
  font-size: 0.95rem;
}

.pricing-box {
  background-color: #f7f9fc;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  font-size: 0.87rem;

}
.price-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;

}
.start-label {
  font-weight: bold;
}
.price {
  font-weight: bold;
}
.package-title {
  font-size: 1rem;
  margin: 8px 0 4px;
  font-weight: bold;
  color: #0f2c32;
}
.package-desc {
  font-size: 0.9rem;
  margin-bottom: 10px;
  color: #555;
}
.delivery-revision {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.delivery, .revision {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: #555;
}
.icon {
  margin-right: 4px;
  font-size: 1rem;
}
.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.features-list li {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  margin: 4px 0;
  color: #555;
}
.check {
  color: #0f2c32;
  margin-right: 6px;
  font-size: 1rem;
}

.review {
  border-top: 1px solid #ddd;
  padding-top: 8px;
  margin-top: 8px;
}
.review-stars {
  color: #f5c518;
  margin-bottom: 4px;
}
.star {
  font-size: 1rem;
}
.star.inactive {
  color: #ccc;
}
.review-comment {
  font-size: 0.9rem;
  color: #555;
  margin: 4px 0;
}
.reviewer-name {
  font-size: 0.85rem;
  color: #888;
}

@media (max-width: 768px) {
  .overview-nav ul {
    flex-direction: column;
  }
  .overview-nav li {
    text-align: center;
    border-bottom: 1px solid #e0e0e0;
  }
}
</style>
