import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import {
  CalendarEvent,
  CalendarModal,
  FabAddNew,
  Navbar,
  FabDelete,
} from "../";
import { localizer, getMessagesES } from "../../helpers";
//import { unstable_renderSubtreeIntoContainer } from "react-dom";
import { useEffect, useState } from "react";
import { useUiStore, useCalendarStore, useAuthStore } from "../../hooks";
//import { FabDelete } from "../components/FabDelete";

// const events = [
//   {
//     title: "Cumpleaños del jefe",
//     notes: "Hay que comprar el pastel",
//     start: new Date(), //es decir, cuándo quiero que empiece el evento, p.e. el momento actual
//     end: addHours(new Date(), 2), // le sumo a la hora actual, dos horas
//     bgColor: "#fafafa", // ppdad personalizada q yo estoy creando
//     user: {
//       _id: "123",
//       name: "Fernando",
//     },
//   },
// ];

export const CalendarPage = () => {
  const { user } = useAuthStore();
  const { openDateModal } = useUiStore();
  const {
    events,
    setActiveEvent /* , hasEventSelected  */,
    startLoadingEvents,
  } = useCalendarStore();

  const [lastView, setLastView] = useState(
    localStorage.getItem("lastView") || "week"
  ); // en el localStorage, si no tenemos un valor en lastView cuando se carga la primera vez, mandamos el 'week'

  // event, start, end, isSelected son los nombres
  // de los argumentos que yo quiero darle,
  // no tienen por qué llamarse así;
  // son los argumentos q yo voy a recibir
  const eventStyleGetter = (event, start, end, isSelected) => {
    //console.log({ event, start, end, isSelected });
    //console.log(event); //esto me muestra el evento en la consola; si lo modifico, me lo vuelve a mostrar, pero me cambia el _id del user por uid; esto podría arreglarlo para que se homogéneo

    const isMyEvent =
      user.uid === event.user._id || user.uid === event.user.uid; //la del uid es si ya hicimos alguna actualización

    const style = {
      backgroundColor: isMyEvent ? "#347CF7" : "#465660",
      borderRadius: "0px",
      opacity: 0.8,
      color: "white",
    };

    return {
      style,
    };
  };

  const onDoubleClick = (event) => {
    //console.log({ doubleClick: event });
    openDateModal();
  };

  const onSelect = (event) => {
    //console.log({ click: event });
    setActiveEvent(event);
  };

  const onViewChanged = (event) => {
    //console.log({ ViewChanged: event });
    localStorage.setItem("lastView", event);
    setLastView(event); // esto no es del todo necesario porque el calendario cambia a pesar d q tengamos un valor por defecto en la ppdad defaultView
  };

  useEffect(() => {
    startLoadingEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar />
      <Calendar
        culture="es"
        localizer={localizer}
        events={events}
        //defaultView={"agenda"}
        defaultView={lastView}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "calc(100vh - 80px)" }} //aquí le estoy restando al 100% de altura, unos 80px correspondientes al alto del navbar; esto lo hago para que no se mueve arriba y abajo el calendario
        messages={getMessagesES()}
        eventPropGetter={eventStyleGetter}
        components={{ event: CalendarEvent }}
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={onSelect} //este es una especie de onClick
        onView={onViewChanged}
      />
      <CalendarModal />
      <FabAddNew />
      {/*  {hasEventSelected && <FabDelete />} ESTA SERÍA UNA FORMA DE HACERLO*/}
      <FabDelete />
    </>
  );
};
