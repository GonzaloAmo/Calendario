<script setup lang="ts">
import monthCalendar from '@/components/monthCalendar.vue';
import { ref, watch ,onMounted } from 'vue';
import axios from 'axios'
import {useEventosStore} from '@/stores/counter'
const eventosStore=useEventosStore()
const mes = ref(1);
const anio = ref(2024);
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
let mesNombre = meses[mes.value - 1];
let timeout: ReturnType<typeof setTimeout> | null = null
if (mes.value === 0) {
  mes.value = 12;
} else if (mes.value === 13) {
  mes.value = 1;
}
const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  const derecha=event.clientX > window.innerWidth - 100
  const izquierda=event.clientX < 100
  if (derecha) {
    if (!timeout) {
      timeout = setTimeout(() => {
        mes.value++
        timeout = null
      }, 700)
    }
  } else if (izquierda) {
    if (!timeout) {
      timeout = setTimeout(() => {
        mes.value--
        timeout = null
      }, 700)
    }
  } else {
    clearTimeout(timeout!)
    timeout = null
  }
}

onMounted(() => {
  document.addEventListener('dragover', handleDragOver);
});
watch(() => mes.value, (value) => {
  mesNombre = meses[value - 1];
  if (value === 13) {
    mes.value = 1;
  } else if (value === 0) {
    mes.value = 12;
  }
});
const irMesHoy=()=>{
  mes.value=new Date().getMonth()+1
}
const deleteEvent = async (id: string) => {
  try {
    const response = await axios.delete(`http://localhost:3000/eventos/${id}`);
    if (response.status === 200) {
      eventosStore.deleteEvent(id);
    } else {
      console.error('Error al eliminar el evento. Estado:', response.status);
    }
  } catch (error) {
    console.error('Error al obtener eventos:', error);
  }
};
const eliminar = async(event: DragEvent) => {
  event.preventDefault();
  const id=event.dataTransfer?.getData('uid')
  await deleteEvent(id!)

}
</script>

<template>
  
  <div class="text-center text-2xl font-semibold text-gray-700 mb-4">
    {{ mesNombre }}
  </div>
  <div class="flex items-center space-x-4">
    <label for="mes" class="text-gray-600">Mes:</label>
    <input
      id="mes"
      type="number"
      v-model="mes"
      min="0"
      max="13"
      class="w-16 p-2 border rounded focus:outline-none focus:border-blue-500"
    />

    <label for="anio" class="text-gray-600">Año:</label>
    <input
      id="anio"
      type="number"
      v-model="anio"
      min="2000"
      max="2050"
      class="w-20 p-2 border rounded focus:outline-none focus:border-blue-500"
    />
    <!-- <label for="selectedMonths" class="text-gray-600">Meses a mostrar:</label>
    <select v-model="selectedMonths" class="p-2 rounded-md border border-gray-300">
      <option v-for="month in availableMonths" :key="month" :value="month">
        {{ month }} mes{{ month > 1 ? 'es' : '' }}
      </option>
    </select> -->
    <div class="flex justify-end">
      <div class="p-2">
        <button @click="irMesHoy" class="flex items-center space-x-1 bg-blue-500 text-white px-4 py-2 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar-fill" viewBox="0 0 16 16">
            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5h16V4H0V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5"/>
          </svg>
          <span>Hoy</span>
        </button>
      </div>
  </div>
  <button @drop.prevent="eliminar"  class="flex items-center space-x-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
      <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
    </svg>
    <span>Eliminar</span>
  </button>
  </div>
  <!-- <monthCalendar v-for="i in selectedMonths" :key="i"
    :mes="i" :anio="anio" /> -->
  <monthCalendar 
  :mes="mes" :anio="anio" />
</template>
