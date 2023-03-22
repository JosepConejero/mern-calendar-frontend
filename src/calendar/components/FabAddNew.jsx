import { addHours } from "date-fns";
import { useCalendarStore, useUiStore } from "../../hooks";

export const FabAddNew = () => {
  const { openDateModal } = useUiStore();
  const { setActiveEvent } = useCalendarStore();

  const handleClickNew = () => {
    setActiveEvent({
      //_id: new Date().getTime(), //no tendrá id pq quiero saber cuándo estoy creando uno nuevo
      title: "",
      notes: "",
      start: new Date(),
      end: addHours(new Date(), 3),
      bgColor: "#fafafa",
      user: {
        _id: "123",
        name: "Fernando",
      },
    });
    openDateModal();
  };

  return (
    <button className="btn btn-primary fab" onClick={handleClickNew}>
      <i className="fas fa-plus"></i>
      {/* icono del font-awesome */}
    </button>
  );
};
