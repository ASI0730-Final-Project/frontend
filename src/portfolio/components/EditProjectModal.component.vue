<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-content">
      <h3>{{ isNew ? 'Nuevo Proyecto' : 'Editar Proyecto' }}</h3>

      <input v-model="editable.title" type="text" placeholder="Título" required />
      <textarea v-model="editable.description" placeholder="Descripción" required></textarea>
      <input
        v-model="editable.price"
        type="text"
        placeholder="Precio"
        pattern="^[0-9]+(\.[0-9]{1,2})?$"
        title="Ingresa un precio válido"
      />
      <input v-model="editable.time" type="text" placeholder="Tiempo estimado" />
      <input v-model="editable.gig_link" type="text" placeholder="Enlace del Gig" />

      <label>Subir imágenes:</label>
      <input type="file" multiple accept="image/*" @change="handleImageUpload" />

      <div class="image-preview" v-if="editable.images?.length">
        <img
          v-for="(img, i) in editable.images"
          :key="i"
          :src="img"
          alt="Imagen subida"
          style="max-width: 100px; max-height: 100px; margin: 0 5px;"
        />
      </div>

      <div class="modal-actions">
        <button @click="save">Guardar</button>
        <button @click="close">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { portfolioService } from '../services/portfolio.service' 
import { authService } from '../../shared/services/auth.service' 

const props = defineProps({
  project: { type: Object, required: true },
  isNew: { type: Boolean, default: false }
})

const emit = defineEmits(['save', 'close'])

const editable = ref({ ...props.project })
const currentUser = ref(null)
const portfolioId = ref(null)

watch(
  () => props.project,
  async (val) => {
    editable.value = { ...val }
    if (!editable.value.images) editable.value.images = []

    if (!portfolioId.value) {
      currentUser.value = await authService.getCurrentUser()
      const portfolio = await portfolioService.getPortfolioBySellerId(currentUser.value.id)
      portfolioId.value = portfolio?.id
    }
  },
  { immediate: true }
)

function handleImageUpload(e) {
  const files = e.target.files
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue
    const reader = new FileReader()
    reader.onload = () => {
      editable.value.images.push(reader.result)
    }
    reader.readAsDataURL(file)
  }
}

async function save() {
  if (!editable.value.title || !editable.value.description) {
    alert('Por favor, completa el título y la descripción.')
    return
  }

  const projectToSave = {
    ...editable.value,
    gigLink: editable.value.gig_link || editable.value.gigLink
  }

  try {
    if (!props.isNew && portfolioId.value) {
      await portfolioService.updateProject(portfolioId.value, projectToSave)
    }

    emit('save', projectToSave) 
    close()
  } catch (err) {
    console.error('Error actualizando el proyecto:', err)
    alert('Error guardando el proyecto.')
  }
}

function close() {
  emit('close')
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0,0,0,0.5);
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.modal-content {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
}

.modal-content input,
.modal-content textarea {
  width: 100%;
  margin: 6px 0;
  padding: 8px;
  border: 1px solid #aaa;
  border-radius: 4px;
}

.modal-actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal-actions button {
  padding: 8px 12px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
}

.image-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.image-preview img {
  height: 70px;
  border-radius: 4px;
  object-fit: cover;
}
</style>
