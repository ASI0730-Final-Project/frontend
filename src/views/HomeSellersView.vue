<script setup>
import HeroSection from '@/components/HeroSection.vue' // Usamos '@' como alias para 'src/'
import GigCard from '@/components/GigCard.vue'
import { ref } from 'vue' // Para crear datos reactivos
import 'primeicons/primeicons.css'

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
  // Añade más gigs si quieres, copiando la estructura de la imagen
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
  // ... más gigs
])
</script>

<template>

  <section class="hero-section">
    <div class="container">
      <h1>
        Welcome to Our team <span class="highlight">Gigs</span> U<br />
      </h1>
      <p class="freelancer-count">
        <span class="number">#1892</span> Pals
      </p>
    </div>
  </section>

</template> 

<style scoped>
@font-face {
  font-family: 'JacquesFrancois';
  src: url('@/assets/fonts/JacquesFrancois-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'InriaSerif';
  src: url('@/assets/fonts/InriaSerif-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'KonkhmerSleokchher';
  src: url('@/assets/fonts/KonkhmerSleokchher-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
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
  background-color: #1B2A2E;
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
  font-weight: Regular;
  font-family: 'KonkhmerSleokchher';
}
</style>
