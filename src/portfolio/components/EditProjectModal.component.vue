<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-content">
      <h3>{{ isNew ? 'Nuevo Proyecto' : 'Editar Proyecto' }}</h3>

      <input v-model="editable.title" placeholder="Título" />
      <textarea v-model="editable.description" placeholder="Descripción"></textarea>
      <input v-model="editable.price" placeholder="Precio" />
      <input v-model="editable.time" placeholder="Tiempo" />
      <input v-model="editable.gig_link" placeholder="Enlace del Gig" />

      <label>Subir imágenes:</label>
      <input type="file" multiple @change="handleImageUpload" />

      <div class="image-preview" v-if="editable.images.length">
        <img v-for="(img, i) in editable.images" :key="i" :src="img" />
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

const props = defineProps({
  project: { type: Object, required: true },
  isNew: { type: Boolean, default: false }
})
const emit = defineEmits(['save', 'close'])

const editable = ref({ ...props.project })

watch(() => props.project, (val) => {
  editable.value = { ...val }
  if (!editable.value.images) editable.value.images = []
})

function handleImageUpload(e) {
  const files = e.target.files
  for (const file of files) {
    const reader = new FileReader()
    reader.onload = () => editable.value.images.push(reader.result)
    reader.readAsDataURL(file)
  }
}

function save() {
  emit('save', { ...editable.value })
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
