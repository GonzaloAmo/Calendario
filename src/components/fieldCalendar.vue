<!-- fieldCalendar -->
<script setup lang="ts">
import modalAdd from './modalAdd.vue';
import { defineProps, ref, watchEffect } from 'vue';
import { useEventosStore } from '../stores/counter';
import axios from 'axios';

interface Props {
  valor?: string;
}

const props = defineProps<Props>();
const modalVisible = ref<boolean>(false);
const id = ref<string>('');
const eventosEnFecha = ref<any[]>([]);
const eventosStore = useEventosStore();

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

const mostrarModal = (eventId: string = '') => {
  modalVisible.value = true;
  id.value = eventId;
};

let idActivo:string

document.addEventListener('dragstart', function (event) {
  idActivo = (event.target as HTMLElement).id;
  event.dataTransfer?.setData('uid',idActivo)
});


const handleDrop = async (event: DragEvent) => {
  event.preventDefault();
  const eventoModificar = eventosStore.getEventosPorId(idActivo);
  if (eventoModificar) {
    const nuevaFecha = (event.target as HTMLElement).id;
    eventoModificar.fecha = nuevaFecha;
    const response = await axios.put(`http://localhost:3000/eventos/${idActivo}`, eventoModificar);
    if (response.status === 200) {
      eventosStore.modificarEvento(eventoModificar);
    } else {
      console.error('Error al modificar el evento. Estado:', response.status);
    }
  }
};
const diaHoy=ref<string>(new Date().toLocaleDateString())
const evento = ref(null);

// function parseFecha(fecha:string) {
//   const partesFecha = fecha.split('/');

//   const mes = partesFecha[1].padStart(2, '0');
//   const dia = partesFecha[0].padStart(2, '0');

//   return `day=${dia}&month=${mes}`;
// }
// const HistoriaDias = async (dia:string) => {
//   try {
//     const response = await axios.get(`https://holidayapi.com/v1/holidays?country=ES&year=2023&${dia}&key=258bad10-3174-4804-8f54-94dde306f460`, {
//     });
//     if(response.status===200){
//       return response.data
//     }else
//     {
//       console.error('Error al obtener eventos. Estado:', response.status);
//     }
//   } catch (error) {
//     console.error('Error al obtener eventos:', error);
//     throw error;
//   }
// };

// const obtenerDatos = async (dia:string) => {
//       try {
//         const datos = await HistoriaDias(parseFecha(dia));
//         if (datos?.holidays?.length > 0) {
//           evento.value = datos.holidays[0].name;
//         } else {
//           evento.value = null;
//         }
//       } catch (error) {
//         console.error('Error al obtener datos:', error);
//       }
//     };
watchEffect(() => {
  eventosEnFecha.value = eventosStore.getEventosEnFecha(props.valor!);
  // obtenerDatos(props.valor!);
});
</script>

<template>
  <div
    :id="props.valor" 
    @drop="handleDrop" 
    @dragover.prevent 
    class="p-4 rounded-md shadow-md"
    :class="{'bg-blue-200': props.valor === diaHoy, 'bg-gray-100': props.valor !== diaHoy}"
    >
    <p :id="props.valor" class="text-lg font-semibold">{{ props.valor }}</p>
    <p v-if="evento" class="bg-red-200 text-red-800 p-2 rounded-md mt-2">{{ evento }}</p>
    <div v-if="eventosEnFecha.length > 0">
      <p 
        :id="evento.id" 
        draggable="true"
        v-for="evento in eventosEnFecha"
        :key="evento.id"
        class="bg-green-600 text-white py-2 px-4 rounded mt-2"
      >
        {{ evento.nombreEvento }}
        <button @click="deleteEvent(evento.id)" class="bg-red-500 hover:bg-red-700 text-white  py-2 px-2 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar-x" viewBox="0 0 16 16">
            <path d="M6.146 7.146a.5.5 0 0 1 .708 0L8 8.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 9l1.147 1.146a.5.5 0 0 1-.708.708L8 9.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 9 6.146 7.854a.5.5 0 0 1 0-.708"/>
            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
          </svg>
        </button>
        <button @click="mostrarModal(evento.id)" class="bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-2 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar2-minus" viewBox="0 0 16 16">
            <path d="M5.5 10.5A.5.5 0 0 1 6 10h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5"/>
            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"/>
            <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5z"/>
          </svg>
        </button>
      </p>
    </div>
    <button @click="mostrarModal()" class="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
      </svg>
    </button>
    <modalAdd
    @close="modalVisible = false"
    :valor="props.valor"
    :display="modalVisible"
    :id="id"
    />
  </div>
</template>

<style>
.cell, .cell input {
  height: 1.5em;
  line-height: 1.5;
  font-size: 15px;
}

.cell span {
  padding: 0 6px;
}

.cell input {
  width: 100%;
  box-sizing: border-box;
}
</style>