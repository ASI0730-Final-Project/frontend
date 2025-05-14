<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import HeroSection from '@/components/HeroSection.vue'
import GigCard from '@/components/GigCard.vue'

const { t, locale } = useI18n()

// Idioma actual
const currentLanguage = ref('es')
const switchLanguage = () => {
  currentLanguage.value = currentLanguage.value === 'es' ? 'en' : 'es'
  locale.value = currentLanguage.value
}

// Usuario actual
const currentUser = ref(null)
onMounted(() => {
  const userData = localStorage.getItem('loggedUser')
  if (userData) {
    currentUser.value = JSON.parse(userData)
  }
})

// Datos multilingües para gigs
const popularGigs = ref([
  {
    id: 1,
    imgSrc: 'https://images.indianexpress.com/2022/11/Telegram-bots-2-1.jpg',
    sellerName: 'Olivia Hayes',
    descriptionKey: 'gigs.olivia',
    price: 50.0,
  },
  {
    id: 2,
    imgSrc:
      'https://www.collectivealternative.com/wp-content/uploads/2023/03/Social-Media-Marketing-for-Small-Businesses.jpg',
    sellerName: 'Isabelle Moreira',
    descriptionKey: 'gigs.isabelle',
    price: 84.0,
  },
  {
    id: 3,
    imgSrc: 'https://i.ytimg.com/vi/i83HYdsy7mg/maxresdefault.jpg',
    sellerName: 'Lucas Griffths',
    descriptionKey: 'gigs.lucas',
    price: 89.0,
  },
  {
    id: 4,
    imgSrc: 'https://influencermarketinghub.com/wp-content/uploads/2019/04/Template.jpg',
    sellerName: 'Mia Zhang',
    descriptionKey: 'gigs.mia',
    price: 89.0,
  },
  {
    id: 5,
    imgSrc:
      'https://www.dotsignage.com/wp-content/uploads/2024/03/eye-catching-digital-menu-boards-templates.jpg',
    sellerName: 'Allen Brooks',
    descriptionKey: 'gigs.allen',
    price: 89.0,
  },
])

const continueBrowseGigs = ref([
  {
    id: 6,
    imgSrc: 'https://cdn.kwork.com/pics/t5/35/25315226-63f3d9cdd8464.jpg',
    sellerName: 'Ethan Carter',
    descriptionKey: 'gigs.ethan',
    price: 89.0,
  },
  {
    id: 7,
    imgSrc:
      'https://img.freepik.com/premium-vector/responsive-website-design-with-desktop-computer-screen-tablet-computer-illustration_47012-80.jpg',
    sellerName: 'Sophia Bennett',
    descriptionKey: 'gigs.sophia',
    price: 189.0,
  },
  {
    id: 8,
    imgSrc:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbZZlXQVXuIrHX_ccOfNbksUwVqBYOrvBh2FmqUOvcFeVTfpJDpu6XpqAcNHU-e2-tnR4&usqp=CAU',
    sellerName: 'Emily Sharpe',
    descriptionKey: 'gigs.emily',
    price: 160.0,
  },
  {
    id: 9,
    imgSrc:
      'https://images.ctfassets.net/wowgx05xsdrr/78tynwsztqlpgZaqK4cN9D/f865d194ae7e2647313a6ffb39fce142/product-photography-hero-1.jpg?fm=webp&w=3840&q=75',
    sellerName: 'Alfredo Ugarte',
    descriptionKey: 'gigs.alfredo',
    price: 260.0,
  },
  {
    id: 10,
    imgSrc:
      'https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/265996558/original/93d12aadf061a5264507d79a77e29aaff7972133/translate-any-technical-document-from-english-to-spanish.png',
    sellerName: 'Noah Simmons',
    descriptionKey: 'gigs.noah',
    price: 89.0,
  },
])
</script>

<template>
  <HeroSection />

  <div class="main-content container">
    <div v-if="currentUser" class="user-profile">
      <img :src="currentUser.profileImage" alt="Foto de perfil" class="profile-img" />
      <div class="user-info">
        <h3>
          {{ currentLanguage === 'es' ? 'Bienvenido' : 'Welcome' }}, {{ currentUser.firstName }}
          {{ currentUser.lastName }}
        </h3>
        <p>{{ currentUser.email }}</p>
      </div>
    </div>

    <section class="gig-section">
      <h2>
        {{ currentLanguage === 'es' ? 'Continúa explorando' : 'Continue Browse' }}
        <a href="#">&rarr;</a>
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

    <section class="gig-section">
      <h2>{{ currentLanguage === 'es' ? 'Gigs Populares de Tecnología' : 'Popular Tech Gigs' }}</h2>
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

    <button @click="switchLanguage">
      {{ currentLanguage === 'es' ? 'Cambiar a Inglés' : 'Switch to Spanish' }}
    </button>
  </div>
</template>

<style scoped>
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
@media (max-width: 1200px) {
  .gig-list {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
@media (max-width: 768px) {
  .gig-list {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}
@media (max-width: 480px) {
  .gig-list {
    grid-template-columns: 1fr;
  }
}

/* Estilo de perfil */
.user-profile {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  background: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
}
.profile-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 20px;
}
.user-info h3 {
  margin: 0;
}
.user-info p {
  margin: 5px 0 0;
  color: #666;
}
</style>
