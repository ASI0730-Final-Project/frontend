<script setup>
import HeroSection from '@/components/HeroSection.vue'
import GigCard from '@/components/GigCard.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n' // i18n import
import 'primeicons/primeicons.css'

const { t } = useI18n() // usar función de traducción

const popularGigs = ref([
  {
    id: 1,
    imgSrc: 'https://images.indianexpress.com/2022/11/Telegram-bots-2-1.jpg',
    sellerName: 'Olivia Hayes',
    description: t('gigs.telegramBot'),
    price: 50.0,
  },
  {
    id: 2,
    imgSrc:
      'https://www.collectivealternative.com/wp-content/uploads/2023/03/Social-Media-Marketing-for-Small-Businesses.jpg',
    sellerName: 'Isabelle Moreira',
    description: t('gigs.socialMediaManager'),
    price: 84.0,
  },
  {
    id: 3,
    imgSrc: 'https://i.ytimg.com/vi/i83HYdsy7mg/maxresdefault.jpg',
    sellerName: 'Lucas Griffths',
    description: t('gigs.powerpointCreator'),
    price: 89.0,
  },
  {
    id: 4,
    imgSrc: 'https://influencermarketinghub.com/wp-content/uploads/2019/04/Template.jpg',
    sellerName: 'Mia Zhang',
    description: t('gigs.influencerScheduler'),
    price: 89.0,
  },
  {
    id: 5,
    imgSrc:
      'https://www.dotsignage.com/wp-content/uploads/2024/03/eye-catching-digital-menu-boards-templates.jpg',
    sellerName: 'Allen Brooks',
    description: t('gigs.menuDesigner'),
    price: 89.0,
  },
])
</script>

<template>
  <!-- Hero section -->
  <HeroSection />

  <section class="hero-section">
    <div class="container">
      <h1>
        {{ t('home.welcome') }} <span class="highlight">{{ t('home.gigs') }}</span> U<br />
      </h1>
      <p class="freelancer-count"><span class="number">#1892</span> {{ t('home.pals') }}</p>
    </div>
  </section>

  <!-- Gig cards section -->
  <section class="gig-list">
    <div class="gig-grid">
      <GigCard
        v-for="gig in popularGigs"
        :key="gig.id"
        :imgSrc="gig.imgSrc"
        :sellerName="gig.sellerName"
        :description="gig.description"
        :price="gig.price"
        :service="{ id: gig.id }"
      />
    </div>
  </section>
</template>

<style scoped>
@font-face {
  font-family: 'JacquesFrancois';
  src: url('@/assets/fonts/JacquesFrancois-Regular.ttf') format('truetype');
}

@font-face {
  font-family: 'InriaSerif';
  src: url('@/assets/fonts/InriaSerif-Regular.ttf') format('truetype');
}

@font-face {
  font-family: 'KonkhmerSleokchher';
  src: url('@/assets/fonts/KonkhmerSleokchher-Regular.ttf') format('truetype');
}

.hero-section {
  background-color: #ffffff;
  padding: 100px 0;
  text-align: center;
  color: #ffffff;
}

.container {
  max-width: 85%;
  border-radius: 25px;
  margin: 0 auto;
  padding: 50px 20px;
  background-color: #1b2a2e;
}

h1 {
  font-size: 64px;
  line-height: 1.4;
  margin-bottom: 30px;
  color: #ffffff;
  font-family: 'InriaSerif', serif;
}

.highlight {
  color: #51c2e5;
  font-family: 'JacquesFrancois', serif;
}

.freelancer-count {
  margin-top: 20px;
  font-size: 32px;
  color: #ffffff;
  font-family: 'InriaSerif', serif;
}

.freelancer-count .number {
  font-size: 48px;
  font-weight: normal;
  font-family: 'KonkhmerSleokchher';
}

.gig-list {
  padding: 40px 20px;
  background: #f4f4f4;
}

.gig-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
</style>
