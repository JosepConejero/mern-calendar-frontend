import { addHours, differenceInSeconds } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import "./CalendarModal.css";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useCalendarStore, useUiStore } from "../../hooks";

registerLocale("es", es);

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

// he de poner dentro de setAppElement
// el string #root, donde root es lo
// q hay en el id del div ppal de nto index.html
Modal.setAppElement("#root");

export const CalendarModal = () => {
  //necesito saber si nuestro modal está abierto sacando el isDateMOdalOpen del useUiStore
  const { isDateModalOpen, closeDateModal } = useUiStore();
  const { activeEvent, startSavingEvent } = useCalendarStore();

  //const [isOpen, setIsOpen] = useState(true);//este lo usamos al ppio pero lo sustituimos por el isDateModalOpen

  // este es para saber si se ha hecho el submit del formulario
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [formValues, setFormValues] = useState({
    title: "",
    notes: "",
    start: new Date(),
    end: addHours(new Date(), 1),
  });

  useEffect(() => {
    if (activeEvent !== null) {
      setFormValues({
        ...activeEvent, //de esta forma, esparciendo las ppdades, se crea un nv obj
      });
    }
  }, [activeEvent]);
  //este efecto se va a disparar cada vez que activeEvent cambie, es decir, cada vez que esa nota cambie
  //pero hay un punto en la cual es nula, e.d. cuando cargo la aplicación será null,
  //p.t. cuando no sea null, se ejecutará el efecto

  // esto lo creo para controlar que cambie el is-valid del input
  // si el título cambia o el formSubmitted cambia, volverá a memorizarse este valor
  const titleClass = useMemo(() => {
    if (!formSubmitted) return "";
    // si la persona no ha ingresado el título o el título está vacío, mostraré el input en rojo (error)
    return formValues.title.length > 0 ? "is-valid" : "is-invalid"; // puedo quitar el is-valid pq cn se hace el submit del formulario, ya no hace falta
  }, [formValues.title, formSubmitted]);

  const onInputChanged = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
  };

  //changing va a vale "start" o "end"
  const onDateChange = (event, changing) => {
    //console.log(event);
    setFormValues({
      ...formValues,
      [changing]: event,
      // voy a tomar la propiedad start o end (es decir, changing) y va a tener el valor del evento q estoy recibiendo
      // así este onDateChange me va a servir para ambas cajas de texto, la de start y la de end
    });
  };

  const onCloseModal = () => {
    //console.log("cerrando modal");
    //setIsOpen(false); esto lo usé al ppio pero lo he sustituido por una variable suministrada por el customhook
    closeDateModal();
    //si solo está esta función closeDateModal() podría poner directamente la referencia a esta función en la propiedad onRequestClose del <Modal que hay más abajo
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);

    const difference = differenceInSeconds(formValues.end, formValues.start);
    //console.log({ difference: difference });

    // si una de los dos inputs está vacío o las fechas están mal puestas
    if (isNaN(difference) || difference <= 0) {
      //console.log("error en las fechas");
      Swal.fire("Fechas incorrectas", "Revise las fechas ingresadas", "error");
      return;
    }

    // si no hay título
    if (formValues.title.length <= 0) return;

    // si todo está bien, entonces:
    //console.log({ ...formValues, difference: difference });//este me lo he inventado yo, esparzo todas las ppdades de formValues y le añado la diferencia

    await startSavingEvent(formValues);
    closeDateModal();
    setFormSubmitted(false);
  };

  return (
    <>
      <Modal
        isOpen={isDateModalOpen}
        onRequestClose={onCloseModal} //esta la mandaré llamar cuando se mande a llamar la forma de cerrar  el modal
        style={customStyles}
        className="modal"
        overlayClassName="modal-fondo"
        closeTimeoutMS={200}
      >
        <h1> Nuevo evento </h1>
        <hr />
        <form className="container" onSubmit={onSubmit}>
          <div className="form-group mb-2">
            <label>Fecha y hora inicio</label>
            <DatePicker
              //maxDate={formValues.end}//este lo he puesto yo para probar y va bien
              selected={formValues.start}
              onChange={(event) => onDateChange(event, "start")}
              className="form-control"
              dateFormat="Pp"
              showTimeSelect
              locale="es"
              timeCaption="Hora"
            />
            {/* la clase form-control es de bootstrap y es para que se estire */}
          </div>

          <div className="form-group mb-2">
            <label>Fecha y hora fin</label>
            <DatePicker
              minDate={formValues.start}
              selected={formValues.end}
              onChange={(event) => onDateChange(event, "end")}
              className="form-control"
              dateFormat="Pp"
              showTimeSelect
              locale="es"
              timeCaption="Hora"
            />
          </div>

          <hr />
          <div className="form-group mb-2">
            <label>Titulo y notas</label>
            <input
              type="text"
              className={`form-control ${titleClass}`}
              placeholder="Título del evento"
              name="title"
              autoComplete="off"
              value={formValues.title}
              onChange={onInputChanged}
            />
            <small id="emailHelp" className="form-text text-muted">
              Una descripción corta
            </small>
          </div>

          <div className="form-group mb-2">
            <textarea
              type="text"
              className="form-control"
              placeholder="Notas"
              rows="5"
              name="notes"
              value={formValues.notes}
              onChange={onInputChanged}
            ></textarea>
            <small id="emailHelp" className="form-text text-muted">
              Información adicional
            </small>
          </div>

          <button type="submit" className="btn btn-outline-primary btn-block">
            <i className="far fa-save"></i>
            <span> Guardar</span>
          </button>
        </form>
      </Modal>
    </>
  );
};
