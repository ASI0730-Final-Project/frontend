<template>
  <div class="service-overview">
    <!-- Barra de navegación superior -->
    <nav class="overview-nav">
      <ul>
        <li class="active">Overview</li>
        <li>Description</li>
        <li>About the seller</li>
        <li>Compare packages</li>
        <li>Recommendations</li>
        <li>Reviews</li>
      </ul>
    </nav>

    <!-- Sección Overview: Banner -->
    <section class="overview-section">
      <img :src="serviceData.imgSrc || serviceData.bannerUrl" alt="Service Banner" class="banner-image" />
    </section>

    <!-- Sección Description -->
    <section class="description-section">
      <h2>About this Gig</h2>
      <p>{{ serviceData.description || serviceData.fullDescription }}</p>
      <div v-if="serviceData.detailImage" class="detail-image">
        <img :src="serviceData.detailImage" alt="Service Detail" />
      </div>
    </section>

    <!-- Sección About the Seller -->
    <section class="seller-section">
      <h2>About the seller</h2>
      <div class="seller-info">
        <img :src="serviceData.sellerAvatar" alt="Seller Avatar" class="seller-avatar" />
        <div class="seller-details">
          <p class="seller-name">{{ serviceData.sellerName }}</p>
        </div>
      </div>
    </section>

    <!-- Sección Compare Packages / Pricing -->
    <section class="packages-section">
      <h2>Compare packages</h2>
      <div class="pricing-box">
        <div class="price-header">
          <span class="start-label">Start price</span>
          <span class="price">{{ serviceData.currency }}{{ serviceData.price || serviceData.startingPrice }}</span>
        </div>
        <p class="package-title">Basic Package Only</p>
        <p class="package-desc">Laptop-scenes Includes, Background Music, Logo, and 720HD Video</p>
        <div class="delivery-revision">
          <div class="delivery">
            <span class="icon">&#9200;</span>
            <span>4 - 12 Days Delivery</span>
          </div>
          <div class="revision">
            <span class="icon">&#8635;</span>
            <span>1 Revision</span>
          </div>
        </div>
        <ul class="features-list">
          <li><span class="check">&#10003;</span> 8 captions</li>
          <li><span class="check">&#10003;</span> 5 screenshots</li>
          <li><span class="check">&#10003;</span> Screen recording</li>
          <li><span class="check">&#10003;</span> Add logo</li>
          <li><span class="check">&#10003;</span> Dynamic transitions</li>
          <li><span class="check">&#10003;</span> 30 seconds running time</li>
        </ul>
      </div>
    </section>

    <!-- Sección Reviews -->
    <section class="reviews-section">
      <h2>Reviews ({{ serviceData.reviews ? serviceData.reviews.length : 0 }})</h2>
      <div v-for="review in serviceData.reviews || []" :key="review.id" class="review">
        <div class="review-stars">
          <span v-for="n in Math.round(review.rating)" :key="n" class="star">&#9733;</span>
          <span v-for="n in (5 - Math.round(review.rating))" :key="n" class="star inactive">&#9733;</span>
        </div>
        <p class="review-comment">"{{ review.comment }}"</p>
        <p class="reviewer-name">- {{ review.reviewer }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { selectedService } from '@/composables/useSelectedService';

// Si el usuario navega directamente sin seleccionar una card,
// usamos datos por defecto.
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

/* Barra de navegación superior */
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

/* Secciones */
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

/* Sección Seller */
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

/* Pricing Box */
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

/* Reviews */
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

/* Ajustes responsivos */
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
