<template>
    <div class="flex flex-wrap justify-center">
      <p
        :id="el.id"
        v-for="el in eventos"
        :key="el.id"
        class="bg-green-600 text-white py-2 px-4 rounded-md mx-2 my-2 cursor-pointer hover:bg-green-700 transition duration-300"
      >
        {{ el.nombreEvento}} - {{ el.fecha }} - {{ el.horaInicio }} - {{ el.horaFin }}
      </p>
    </div>
  </template>
<script setup lang="ts">
import { useEventosStore } from '@/stores/counter';
import { ref } from 'vue';
const eventosStore = useEventosStore();
const eventos = ref(eventosStore.eventos);

</script>

<style scoped>

</style>