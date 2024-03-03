import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

interface Evento {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
}
export const useEventosStore = defineStore('eventos', {
  state: () => ({
    eventos: [] as any,
  }),
  getters: {
    getEventosEnFecha: (state) => (fecha: string) => {
      return state.eventos.filter((evento:any) => evento.fecha === fecha);
    },
    getEventosPorId: (state) => (id: string) => {
      return state.eventos.find((evento:any) => evento.id === id);
    }
  },
  actions: {
      agregarEvento(evento: Evento) {
        this.eventos.push(evento);
      },
    modificarEvento(evento: Evento) {
      const index = this.eventos.findIndex((e:any) => e.id === evento.id);
      this.eventos[index] = evento;
    },
    setEvents(eventos: any){
      this.eventos = eventos;
    },
    deleteEvent(id: string) {
      this.eventos = this.eventos.filter((evento:Evento) => evento.id !== id);
    }
  },
});

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
