// cuando tenga muchos eventos, nos puede interesar memorizar este componente con Memo

// export const CalendarEvent = (props) => {
export const CalendarEvent = ({ event }) => {
  //   console.log(props);
  const { title, user } = event;
  return (
    <>
      <strong>{title}</strong>
      <span> - {user.name}</span>
    </>
  );
};
