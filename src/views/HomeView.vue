<script setup>
import HeroSection from '@/components/HeroSection.vue'
import GigCard from '@/components/GigCard.vue'
import { ref, onMounted } from 'vue'

// Usuario actual desde localStorage
const currentUser = ref(null)

// Cargar datos del usuario al montar el componente
onMounted(() => {
  const userData = localStorage.getItem('loggedUser')
  if (userData) {
    currentUser.value = JSON.parse(userData)
  }
})

// Datos de ejemplo para gigs
const popularGigs = ref([
  {
    id: 1,
    imgSrc: 'https://images.indianexpress.com/2022/11/Telegram-bots-2-1.jpg',
    sellerName: 'Olivia Hayes',
    description: 'Codes Simple Telegram Bots.',
    price: 50.0,
  },
  {
    id: 2,
    imgSrc:
      'https://www.collectivealternative.com/wp-content/uploads/2023/03/Social-Media-Marketing-for-Small-Businesses.jpg',
    sellerName: 'Isabelle Moreira',
    description: 'Manages social media for small businesses.',
    price: 84.0,
  },
  {
    id: 3,
    imgSrc: 'https://i.ytimg.com/vi/i83HYdsy7mg/maxresdefault.jpg',
    sellerName: 'Lucas Griffths',
    description: 'Creates corporate PowerPoint presentations.',
    price: 89.0,
  },
  {
    id: 4,
    imgSrc: 'https://influencermarketinghub.com/wp-content/uploads/2019/04/Template.jpg',
    sellerName: 'Mia Zhang',
    description: 'Handles scheduling for influencers.',
    price: 89.0,
  },
  {
    id: 5,
    imgSrc:
      'https://www.dotsignage.com/wp-content/uploads/2024/03/eye-catching-digital-menu-boards-templates.jpg',
    sellerName: 'Allen Brooks',
    description: 'Designs digital menus for restaurants.',
    price: 89.0,
  },
])

const continueBrowseGigs = ref([
  {
    id: 6,
    imgSrc: 'https://cdn.kwork.com/pics/t5/35/25315226-63f3d9cdd8464.jpg',
    sellerName: 'Ethan Carter',
    description: 'I will design and build a web page.',
    price: 89.0,
  },
  {
    id: 7,
    imgSrc:
      'https://img.freepik.com/premium-vector/responsive-website-design-with-desktop-computer-screen-tablet-computer-illustration_47012-80.jpg',
    sellerName: 'Sophia Bennett',
    description: 'Writes short scripts for commercials.',
    price: 189.0,
  },
  {
    id: 8,
    imgSrc:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbZZlXQVXuIrHX_ccOfNbksUwVqBYOrvBh2FmqUOvcFeVTfpJDpu6XpqAcNHU-e2-tnR4&usqp=CAU',
    sellerName: 'Emily Sharpe',
    description: 'UI/UX mockups for apps.',
    price: 160.0,
  },
  {
    id: 9,
    imgSrc:
      'https://images.ctfassets.net/wowgx05xsdrr/78tynwsztqlpgZaqK4cN9D/f865d194ae7e2647313a6ffb39fce142/product-photography-hero-1.jpg?fm=webp&w=3840&q=75',
    sellerName: 'Alfredo Ugarte',
    description: 'Photographs Products for e-commerce',
    price: 260.0,
  },
  {
    id: 10,
    imgSrc:
      'https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/265996558/original/93d12aadf061a5264507d79a77e29aaff7972133/translate-any-technical-document-from-english-to-spanish.png',
    sellerName: 'Noah Simmons',
    description: 'Technical document translation to Spanish.',
    price: 89.0,
  },
])
</script>

<template>
  <HeroSection />

  <div class="main-content container">
    <!-- Perfil del usuario -->
    <div v-if="currentUser" class="user-profile">
      <img :src="currentUser.profileImage" alt="Foto de perfil" class="profile-img" />
      <div class="user-info">
        <h3>Bienvenido, {{ currentUser.firstName }} {{ currentUser.lastName }}</h3>
        <p>{{ currentUser.email }}</p>
      </div>
    </div>

    <!-- Gigs: Continue Browse -->
    <section class="gig-section">
      <h2>Continue Browse <a href="#">&rarr;</a></h2>
      <div class="gig-list">
        <GigCard
          v-for="gig in continueBrowseGigs"
          :key="gig.id"
          :img-src="gig.imgSrc"
          :seller-name="gig.sellerName"
          :description="gig.description"
          :price="gig.price"
        />
      </div>
    </section>

    <!-- Gigs: Populares -->
    <section class="gig-section">
      <h2>Popular Tech Gigs</h2>
      <div class="gig-list">
        <GigCard
          v-for="gig in popularGigs"
          :key="gig.id"
          :img-src="gig.imgSrc"
          :seller-name="gig.sellerName"
          :description="gig.description"
          :price="gig.price"
          currency="S/."
        />
      </div>
    </section>
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
