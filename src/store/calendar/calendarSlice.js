import { createSlice } from "@reduxjs/toolkit";
/* import { addHours } from "date-fns";

const tempEvent = {
  id: new Date().getTime(), // esto lo pongo de momento pq quiero hacer menos modificaciones en el lado del backend y el backend me devolverá un id con id
  title: "Cumpleaños del jefe",
  notes: "Hay que comprar el pastel",
  start: new Date(), //es decir, cuándo quiero que empiece el evento, p.e. el momento actual
  end: addHours(new Date(), 2), // le sumo a la hora actual, dos horas
  bgColor: "#fafafa", // ppdad personalizada q yo estoy creando
  user: {
    id: "123",
    name: "Fernando",
  },
};

const tempEvent2 = {
  id: new Date().getTime() + 1000,
  title: "Pruebecilla pa ver si",
  notes: "A ver si va, leñe",
  start: addHours(new Date(), 2),
  end: addHours(new Date(), 3),
  bgColor: "#fafafa",
  user: {
    id: "123",
    name: "Fernando",
  },
}; */

export const calendarSlice = createSlice({
  name: "calendar",
  initialState: {
    isLoadingEvents: true, //crearé una ppdad isLoadingEvents para saber cuándo está cargando los eventos y así poner alguna pantalla de Loading...
    events: [
      //  tempEvent, tempEvent2
    ],
    activeEvent: null,
  },
  reducers: {
    onSetActiveEvent: (state, { payload }) => {
      state.activeEvent = payload;
    },
    onAddNewEvent: (state, { payload }) => {
      state.events.push(payload);
      state.activeEvent = null;
    },
    onUpdateEvent: (state, { payload }) => {
      state.events = state.events.map((event) => {
        if (event.id === payload.id) {
          return payload;
        }
        return event;
      });
    },
    onDeleteEvent: (state) => {
      if (state.activeEvent) {
        state.events = state.events.filter(
          (event) => event.id !== state.activeEvent.id
        );
        state.activeEvent = null;
      } else {
        console.log("no hay notas activas");
      }
    },
    onLoadEvents: (state, { payload = [] }) => {
      state.isLoadingEvents = false;
      //state.events = payload; // esto sería correcto
      // pero si lo hago como sigue, solo insertará en events el evento que no esté ya en el events (lo hará por el id)
      payload.forEach((event) => {
        const exists = state.events.some((dbEvent) => dbEvent.id === event.id);
        if (!exists) {
          state.events.push(event);
        }
      });
    },
    onLogoutCalendar: (state) => {
      state.isLoadingEvents = true;
      state.events = [];
      state.activeEvent = null;
    },
  },
});

export const {
  onSetActiveEvent,
  onAddNewEvent,
  onUpdateEvent,
  onDeleteEvent,
  onLoadEvents,
  onLogoutCalendar,
} = calendarSlice.actions;
