<script setup>
import HeroSection from '@/components/HeroSection.vue'
import GigCard from '@/components/GigCard.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const popularGigs = ref([
  {
    id: 1,
    imgSrc: 'https://images.indianexpress.com/2022/11/Telegram-bots-2-1.jpg',
    sellerName: 'Olivia Hayes',
    descriptionKey: 'gigs.telegramBot',
    price: 50.0,
  },
  {
    id: 2,
    imgSrc:
      'https://www.collectivealternative.com/wp-content/uploads/2023/03/Social-Media-Marketing-for-Small-Businesses.jpg',
    sellerName: 'Isabelle Moreira',
    descriptionKey: 'gigs.socialMediaManager',
    price: 84.0,
  },
  {
    id: 3,
    imgSrc: 'https://i.ytimg.com/vi/i83HYdsy7mg/maxresdefault.jpg',
    sellerName: 'Lucas Griffths',
    descriptionKey: 'gigs.powerpointCreator',
    price: 89.0,
  },
  {
    id: 4,
    imgSrc: 'https://influencermarketinghub.com/wp-content/uploads/2019/04/Template.jpg',
    sellerName: 'Mia Zhang',
    descriptionKey: 'gigs.influencerScheduler',
    price: 89.0,
  },
  {
    id: 5,
    imgSrc:
      'https://www.dotsignage.com/wp-content/uploads/2024/03/eye-catching-digital-menu-boards-templates.jpg',
    sellerName: 'Allen Brooks',
    descriptionKey: 'gigs.menuDesigner',
    price: 89.0,
  },
])
</script>

<template>
  <HeroSection />

  <main class="main-content container" role="main">
    <section
      v-if="currentUser"
      class="user-profile"
      aria-labelledby="user-profile-title"
    >
      <img
        :src="currentUser.profileImage"
        alt="Foto de perfil del usuario"
        class="profile-img"
      />
      <div class="user-info">
        <h3 id="user-profile-title">
          {{ currentLanguage === 'es' ? 'Bienvenido' : 'Welcome' }},
          {{ currentUser.firstName }} {{ currentUser.lastName }}
        </h3>
        <p>{{ currentUser.email }}</p>
      </div>
    </section>


    <section class="gig-section" aria-labelledby="continue-browse-title">
      <h2 id="continue-browse-title" class="sr-only">
        {{ currentLanguage === 'es' ? 'Gigs recomendados para ti' : 'Recommended Gigs' }}
      </h2>
      <div class="gig-list">
        <GigCard
          v-for="gig in continueBrowseGigs"
          :key="gig.id"
          :img-src="gig.imgSrc"
          :seller-name="gig.sellerName"
          :description="t(gig.descriptionKey)"
          :price="gig.price"
        />
      </div>
    </section>


    <section class="gig-section" aria-labelledby="popular-gigs-title">
      <h2 id="popular-gigs-title">
        {{ currentLanguage === 'es' ? 'Gigs Populares de Tecnología' : 'Popular Tech Gigs' }}
      </h2>
      <div class="gig-list">
        <GigCard
          v-for="gig in popularGigs"
          :key="gig.id"
          :img-src="gig.imgSrc"
          :seller-name="gig.sellerName"
          :description="t(gig.descriptionKey)"
          :price="gig.price"
          currency="S/."
        />
      </div>
    </section>

    <button @click="switchLanguage" aria-label="Cambiar idioma">
      {{ currentLanguage === 'es' ? 'Cambiar a Inglés' : 'Switch to Spanish' }}
    </button>
  </main>
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
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

.gig-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}
.main-content {
  padding-top: 40px;
}
.gig-section {
  margin-bottom: 40px;
}
.gig-section h2 {
  font-size: 1.8rem;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.gig-section h2 a {
  font-size: 0.8em;
  text-decoration: none;
  color: #0073bb;
}
.gig-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}
</style>
