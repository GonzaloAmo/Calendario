<!-- modalAdd.vue -->
<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-md shadow-md w-96">
      <h2 class="text-xl font-semibold mb-4">{{ props.valor }}</h2>
      <input v-if="props.id" type="date" id="fecha" v-model="fecha">
      <!-- Input para la hora de inicio -->
      <label for="horaInicio" class="block mt-3 text-sm font-medium text-gray-600">Hora de Inicio:</label>
      <input v-model="horaInicio" id="horaInicio" type="time" class="mt-1 p-2 border rounded w-full" />
      <!-- Input para la hora de fin -->
      <label for="horaFin" class="block mt-3 text-sm font-medium text-gray-600">Hora de Fin:</label>
      <input v-model="horaFin" id="horaFin" type="time" class="mt-1 p-2 border rounded w-full" />

      <!-- Input para el nombre del evento -->
      <label for="nombreEvento" class="block text-sm font-medium text-gray-600">Nombre del Evento:</label>
      <input v-model="todos.nombreEvento" id="nombreEvento" type="text" class="mt-1 p-2 border rounded w-full"
        placeholder="Nombre del evento" />

      <!-- Texto de descripción -->
      <label for="descripcion" class="block mt-3 text-sm font-medium text-gray-600">Descripción:</label>
      <textarea v-model="todos.descripcion" id="descripcion" rows="3" class="mt-1 p-2 border rounded w-full"
        placeholder="Descripción del evento"></textarea>

      <!-- Botón para añadir evento -->
      <button @click="agregarEvento" class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        {{ props.id ? 'Modificar Evento' : 'Añadir Evento' }}
      </button>

      <button @click="close" class="mt-2 text-gray-500 hover:text-gray-700">Cerrar</button>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { defineProps, ref, watch } from 'vue';
import { useEventosStore } from '../stores/counter';
import axios from 'axios';

const eventosStore = useEventosStore();
interface Props {
  valor?: string;
  display?: boolean;
  object?: any;
  id?: string;
}
const props = defineProps<Props>();
const emit = defineEmits(["close"]);
const close = () => {
  emit("close", false);
};
const horaInicio = ref<string>('09:30');
const horaFin = ref<string>('10:30');
const todos = ref<any>(props?.object || {
  nombreEvento: '',
  descripcion: '',
});
const visible = ref(props.display);

function generateId() {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return randomNumber.toString();
}
function transformarFormato(valor: string) {
  const [day, month, year] = valor.split('/');
  const fechaTransformada = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  return fechaTransformada;
}
function transformarAFormatoOriginal(valor: string) {
  const [year, month, day] = valor.split('-');
  const dayWithoutPadding = parseInt(day, 10).toString();
  const monthWithoutPadding = parseInt(month, 10).toString();
  const fechaOriginal = `${dayWithoutPadding}/${monthWithoutPadding}/${year}`;
  return fechaOriginal;
}
const fecha = ref<string>('');
fecha.value = transformarFormato(props.valor as string);
const agregarEvento = async () => {
  const fechaEvento=props.valor as string?transformarAFormatoOriginal(fecha.value):fecha.value;
  const nuevoEvento = {
    ...todos.value,
    id: props.id || generateId(),
    fecha: fechaEvento,
    horaInicio: horaInicio.value,
    horaFin: horaFin.value,
  };
  console.log(nuevoEvento);
 
  console.log(todos.value);
  try {
    if (props.id) {
      const response = await axios.put(`http://localhost:3000/eventos/${props.id}`, nuevoEvento);
      if (response.status === 200) {
        eventosStore.modificarEvento(nuevoEvento as any);
      } else {
        console.error('Error al modificar el evento. Estado:', response.status);
      }
    } else {
      const response = await axios.post('http://localhost:3000/eventos', nuevoEvento);
      if (response.status === 201) {
        eventosStore.agregarEvento(nuevoEvento as any);
        todos.value = { nombreEvento: '', descripcion: '' };
      } else {
        console.error('Error al agregar el evento. Estado:', response.status);
      }
    }

  } catch (error) {
    console.error('Error de red:', error);
  }

  emit("close", false);
};
watch(() => props.display, () => {
  visible.value = !visible.value;
  if (props.id) {
    obtenerDatosEvento(props.id);
  } else {
    todos.value = { nombreEvento: '', descripcion: '' };
  }
});
watch(() => props.valor, () => {
  fecha.value = transformarFormato(props.valor as string);
});

const obtenerDatosEvento = (id: string) => {
  const evento = eventosStore.eventos.find((evento: any) => evento.id === id);
  if (evento) {
    todos.value.nombreEvento = evento.nombreEvento;
    todos.value.descripcion = evento.descripcion;
  }
};


</script>