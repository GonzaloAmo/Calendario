<!-- monthCalendar.vue -->
<script setup lang="ts">
import axios from 'axios';
import {reactive} from 'vue';
import { computed, defineProps, withDefaults, onMounted, ref, watchEffect } from 'vue'
import router from '@/router';
import { useEventosStore } from '../stores/counter';
import fieldCalendar from './fieldCalendar.vue';

const eventosStore = useEventosStore();

const peticion = async (e: string = "") => {
  try {
    const response = await axios.get(`http://localhost:3000/eventos${e}`);
    eventosStore.setEvents(response.data as any);
  } catch (error) {
    console.error('Error al obtener eventos:', error);
  }
};
interface Props {
  mes?: number
  anio?: number
  cols?: string[]
  COLS?: number
  ROWS?: number
}

const props = withDefaults(defineProps<Props>(), {
  cols: () => ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
  COLS: 7,
  ROWS: 6,
  anio: 2000,
  mes: 1,
  
})

// Convertimos el número de orden del día en filas y columnas
const anadevalorSecuencial = (numero: number, valor: string, celdas: string[][]) => {
  const fila = Math.floor(numero / props.COLS);
  const columna = numero % props.COLS;
  celdas[fila][columna] = valor
}

const tablaMes = computed(() => {
  const celdas = Array.from(Array(7).keys()).map(() =>
    Array.from(Array(props.ROWS).keys()).map(() => ''))
  const primerDia = new Date(`${props.anio}-${props.mes}-1`)
  const posicionPrimerDia = [6, 0, 1, 2, 3, 4, 5][primerDia.getDay()]
  const numDiasMes = new Date(props.anio!, props.mes!, 0).getDate()
  const rangoNumeros = [...Array(numDiasMes).keys()].map(i => i + posicionPrimerDia)
  rangoNumeros.map((el, ind) => anadevalorSecuencial(el, `${ind + 1}/${props.mes}/${props.anio}`, celdas))
  return celdas
})
onMounted(async () => {
  await peticion();
})

interface Options {
  texto: string;
  inicio: number;
  fin: number;
}
const diasSemana = ref<any>(props.COLS)

const opciones: Options[][] = [
  [
    { texto: 'Todos los días', inicio: diasSemana.value.length - 7, fin: diasSemana.value.length },
    { texto: 'Lunes-Viernes', inicio: props.cols.length - 7, fin: props.cols.length - 2 },
  ]
]

const createArray = (length: number): number[] => {
  return [...Array(length).keys()];
};
const selectedOption = ref(0);

const handleSelect = () => {
  const { inicio, fin } = opciones[0][selectedOption.value];
  diasSemana.value = createArray(7).slice(inicio, fin);
};

watchEffect(() => {
  handleSelect();
});
const mostrarEventos = () => {
  router.push('/eventos');

}

</script>

<template>
  <div class="flex items-center space-x-4">
    <select v-model="selectedOption" @change="handleSelect" class="p-2 rounded-md border border-gray-300">
      <option v-for="(option, index) in opciones[0]" :key="index" :value="index">
        {{ option.texto }}
      </option>
    </select>
    <button @click="mostrarEventos" class="flex items-center space-x-1 bg-blue-500 text-white px-4 py-2 rounded-md">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
        class="bi bi-calendar4-range mr-2" viewBox="0 0 16 16">
        <path
          d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M2 2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1zm13 3H1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z" />
        <path d="M9 7.5a.5.5 0 0 1 .5-.5H15v2H9.5a.5.5 0 0 1-.5-.5zm-2 3v1a.5.5 0 0 1-.5.5H1v-2h5.5a.5.5 0 0 1 .5.5" />
      </svg>
      <span>Eventos</span>
    </button>
  </div>
  <table>
    <thead>
      <tr>
        <th></th>
        <th v-for="c in diasSemana" :key="c">{{ cols[c] }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="i in props.ROWS" :key="i">
        <th></th>
        <td v-for="(c, j) in diasSemana" :key="c">
          <fieldCalendar :valor="tablaMes[i - 1][j]" v-if="tablaMes[i - 1][j]" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style>
body {
  margin: 0;
}

table {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
}

th {
  background-color: #eee;
}

tr:first-of-type th {
  width: 100px;
}

tr:first-of-type th:first-of-type {
  width: 25px;
}

td {
  border: 1px solid #ccc;
  height: 1.5em;
  overflow: hidden;
}
</style>