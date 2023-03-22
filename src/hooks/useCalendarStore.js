import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import calendarApi from "../api/calendarApi";
import { convertEventsToDateEvents } from "../helpers";
import {
  onAddNewEvent,
  onDeleteEvent,
  onLoadEvents,
  onSetActiveEvent,
  onUpdateEvent,
} from "../store/calendar/calendarSlice";

export const useCalendarStore = () => {
  const dispatch = useDispatch();
  const { events, activeEvent } = useSelector((state) => state.calendar);
  const { user } = useSelector((state) => state.auth);

  const setActiveEvent = (calendarEvent) => {
    dispatch(onSetActiveEvent(calendarEvent));
  };

  const startSavingEvent = async (calendarEvent) => {
    //TODO: llegar al backend

    try {
      // si todo sale bien:
      if (calendarEvent.id) {
        // si el calendarEvent tiene el id
        // entonces estaríamos actualizando
        await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent); //no necesitamos la data
        dispatch(onUpdateEvent({ ...calendarEvent, user })); //podría poner solo dispatch(onUpdateEvent( calendarEvent )); lo puedo comprobar
        //al calendarEvent le sobreescribimos el usuario q nosotros tenemos (user es el usuario activo, el q está loggeado actualmente)
        return; //si hace la actualización, se sale y no continúa
      }
      // en caso contrario, si el calendarEvent no tiene el id,
      // entonces estaríamos creando
      const { data } = await calendarApi.post("/events", calendarEvent);
      // el calendarApi está incrustando el token mediante interceptores
      console.log({ data });
      // de la data que regresa el post, me interesa el id
      // el user lo tomaré del store, que será el usuario q está conectado en estos momentos
      // añado el evento al store con el id que me ha dado el backend
      dispatch(onAddNewEvent({ ...calendarEvent, id: data.evento.id, user }));
      //le envío el calendarEvent y el id me lo da el backend
    } catch (error) {
      //si intento modificar una nota que no hemos creado nosotros, tendremos un error
      console.log(error);
      Swal.fire("Error al guardar", error.response.data?.msg, "error"); //con data? confirmamos si tenemos o no el mensaje de error
    }
  };

  const startDeletingEvent = async () => {
    try {
      await calendarApi.delete(`/events/${activeEvent.id}`);
      dispatch(onDeleteEvent());
    } catch (error) {
      console.log(error);
      Swal.fire("Error al eliminar", error.response.data?.msg, "error"); //con data? confirmamos si tenemos o no el mensaje de error
    }
  };

  const startLoadingEvents = async () => {
    try {
      const { data } = await calendarApi.get("/events");
      //console.log({ data });
      // convertiré las fechas de strings a números (usaré el archivo convertEventsToDateEvents.js para ello)
      const events = convertEventsToDateEvents(data.eventos);
      console.log(events);
      dispatch(onLoadEvents(events));
    } catch (error) {
      // no estoy esperando que falle, pero por si falla:
      console.log("Error cargando eventos");
      console.log(error);
    }
  };

  return {
    // Properties
    activeEvent,
    events,
    hasEventSelected: !!activeEvent, //si es null, devolverá false; si hay un objeto, devolverá true
    // Methods
    setActiveEvent,
    startSavingEvent,
    startDeletingEvent,
    startLoadingEvents,
  };
};
