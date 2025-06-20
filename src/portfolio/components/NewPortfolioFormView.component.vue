<template>
  <div>
    <h2>Crear Nuevo Portafolio</h2>
    <form @submit.prevent="handleSubmit">
      <label>Seller ID:</label>
      <input type="number" v-model="form.seller_id" readonly />

      <h3>Proyectos</h3>
      <div v-for="(proj, index) in form.projects" :key="index">
        <input v-model="proj.title" placeholder="Título" required />
        <textarea v-model="proj.description" placeholder="Descripción"></textarea>
        <input v-model="proj.price" placeholder="Precio" />
        <input v-model="proj.time" placeholder="Tiempo" />
        <input v-model="proj.gig_link" placeholder="Gig Link" />
        <button type="button" @click="removeProject(index)">Eliminar</button>
      </div>
      <button type="button" @click="addProject">Agregar Proyecto</button>
      <button type="submit">Guardar</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { portfolioService } from '../services/portfolio.service'
import { useRouter } from 'vue-router'
import { authService } from '../../shared/services/auth.service'

const router = useRouter()
const form = ref({
  seller_id: null,
  projects: []
})

onMounted(async () => {
  const currentUser = await authService.getCurrentUser()
  if (currentUser) {
    form.value.seller_id = currentUser.id
  }
})

function addProject() {
  form.value.projects.push({
    title: '', description: '', price: '', time: '', gig_link: '', images: []
  })
}

function removeProject(index) {
  form.value.projects.splice(index, 1)
}

async function handleSubmit() {
  await portfolioService.createPortfolio(form.value)
  router.push('/home')
}
</script>
