<script setup>
import { useRouter } from 'vue-router'
import { selectedService } from '@/composables/useSelectedService'

const router = useRouter()

const props = defineProps({
  imgSrc: String,
  sellerAvatar: String,
  sellerName: String,
  description: String,
  price: Number,
  currency: {
    type: String,
    default: 'S/.',
  },
  name: String,
  service: {
    type: Object,
    default: () => ({ id: 'default' }),
  },
})

function goToOverview() {
  selectedService.value = {
    ...props.service,
    imgSrc: props.imgSrc,
    sellerAvatar: props.sellerAvatar,
    sellerName: props.sellerName,
    description: props.description,
    price: props.price,
    currency: props.currency,
    name: props.name,
  }
  router.push({ name: 'ServiceOverview', params: { serviceId: props.service.id } })
}
</script>

<template>
  <div class="gig-card" @click="goToOverview">
    <img :src="imgSrc" alt="Gig Image" class="gig-image" />
    <div class="seller-info">
      <span>{{ sellerName }}</span>
    </div>
    <p class="gig-description">{{ description }}</p>

    <div class="gig-price">{{ currency }}{{ price.toFixed(2) }}</div>
  </div>
</template>

<style scoped>
.gig-card {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  background-color: #fff;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  position: relative;
  z-index: 10;
}
.gig-card:hover {
  transform: scale(1.02);
  box-shadow: 0 50px 60px rgba(7, 11, 219, 0.1);
}
.gig-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  display: block;
}
.seller-info,
.gig-description,
.gig-price {
  padding: 10px 15px;
}
.seller-info {
  display: flex;
  align-items: center;
  font-size: 0.9em;
  color: #302f2f;
}
.gig-description {
  font-size: 1em;
  color: #302f2f;
  min-height: 60px;
}
.gig-price {
  font-weight: bold;
  color: #0e0d0d;
  text-align: right;
  border-top: 1px solid #07bdf5;
  padding-top: 10px;
  margin-top: 10px;
}
</style>
