<template>
  <div>
    <h2>Crear Nuevo Portafolio</h2>
    <form @submit.prevent="handleSubmit">
      <label>Seller ID:</label>
      <input type="number" v-model="form.sellerId" readonly />

      <label>Nombre:</label>
      <input v-model="form.name" placeholder="Nombre del portafolio" required />

      <label>Descripción:</label>
      <textarea v-model="form.description" placeholder="Descripción del portafolio"></textarea>

      <h3>Proyectos</h3>
      <div v-for="(proj, index) in form.projects" :key="index">
        <input v-model="proj.title" placeholder="Título" required />
        <textarea v-model="proj.description" placeholder="Descripción"></textarea>
        <input v-model="proj.price" placeholder="Precio" />
        <input v-model="proj.time" placeholder="Tiempo" />
        <input v-model="proj.gigLink" placeholder="Gig Link" />
        <button type="button" @click="removeProject(index)">Eliminar</button>
      </div>
      <button type="button" @click="addProject">Agregar Proyecto</button>
      <button type="submit">Guardar</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { portfolioService } from '../services/portfolio.service'
import { authService } from '../../shared/services/auth.service'

const router = useRouter()
const form = ref({
  name: '',
  description: '',
  publishDate: new Date().toISOString(),
  sellerId: null,
  projects: []
})

onMounted(async () => {
  const currentUser = await authService.getCurrentUser()
  if (currentUser) {
    form.value.sellerId = currentUser.id
  }
})

function addProject() {
  form.value.projects.push({
    title: '',
    description: '',
    price: '',
    time: '',
    gigLink: '',
    images: []
  })
}

function removeProject(index) {
  form.value.projects.splice(index, 1)
}

async function handleSubmit() {
  if (!form.value.sellerId) return
  try {
    await portfolioService.createPortfolio(form.value)
    router.push('/home')
  } catch (err) {
    console.error('Error al crear portafolio:', err)
    alert('Error al crear el portafolio. Revisa los campos.')
  }
}
</script>
