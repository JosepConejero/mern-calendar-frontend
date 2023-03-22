//crearé este hook personalizado para evitar trabajar con thunks (aq no solo se puede hacer con thunks, sino que es hasta preferible)
//pero lo hacemos así por probar otras formas de hacer las cosas;
//useAuthStore tiene como objetivo realizar cualquier interacc c la parte del Auth en nuestro store.
import { useDispatch, useSelector } from "react-redux";
import calendarApi from "../api/calendarApi";
import {
  clearErrorMessage,
  onChecking,
  onLogin,
  onLogout,
} from "../store/auth/authSlice";
import { onLogoutCalendar } from "../store/calendar/calendarSlice";

export const useAuthStore = () => {
  const { status, user, errorMessage } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  //aquí empezará el proceso de login
  //como es un proceso que llega al backend, no puede ser síncrono
  //no es una acción q suceda instantáneamente
  const startLogin = async ({ email, password }) => {
    //como argumento estaré esperando un objeto, del cual desestructurará email y password
    //console.log({ email, password });
    dispatch(onChecking());
    //como voy a acceder a mi backend, lo haré a través de un try-catch
    try {
      //solo envío "/auth" porque ya tengo el baseURL de axios en el calendarApi.js
      //const resp = await calendarApi.post("/auth", { email, password });
      //console.log({ resp });
      //solo me interesa data pq es donde viene el name, ok, token, uid
      const { data } = await calendarApi.post("/auth", { email, password }); //después de la ruta va el body q le mando, es un objeto en el que dentro va el email y el password
      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime()); //la representación en un entero de la fecha actual
      dispatch(onLogin({ name: data.name, uid: data.uid }));
    } catch (error) {
      //console.log(error);
      dispatch(onLogout("Credenciales incorrectas"));
      //limpio el error después de mostrarlo, lo hago cuando acabe el setTimeout siguiente
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  };

  const startRegister = async ({ name, email, password }) => {
    dispatch(onChecking());
    try {
      const { data } = await calendarApi.post("/auth/new", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime());
      dispatch(onLogin({ name: data.name, uid: data.uid }));
    } catch (error) {
      //console.log(error); //con esto veré la estructura del objeto del dato que necesito
      //dispatch(onLogout("Credenciales incorrectas"));
      dispatch(
        onLogout(error.response.data?.msg || "Mensaje de error personalizado")
      ); //si viene la data (?), mostraré el msg del error (el q viene del backend), y si no, un mensaje de error personalizado
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  };

  const checkAuthToken = async () => {
    //no utilizaré un useEffect aquí porque haría que se disparara/implementara muchas veces (en todos los lugares donde fuera a obtener algo del store, en todos los lugares donde use este custom hook)
    //solo lo voy a mandar a llamar en lugares específicos
    const token = localStorage.getItem("token");
    if (!token) return dispatch(onLogout()); //en onLogout podría poner un mensaje de error
    //si tenemos un token, entonces:
    try {
      const { data } = await calendarApi.get("/auth/renew");
      localStorage.setItem("token", data.token); //si todo sale bien, en el localStorage tendré un nuevo token
      localStorage.setItem("token-init-date", new Date().getTime());
      dispatch(onLogin({ name: data.name, uid: data.uid }));
    } catch (error) {
      //si algo sale mal, limpiamos el localStorage y salimos
      localStorage.clear();
      dispatch(onLogout());
    }
  };

  const startLogout = () => {
    localStorage.clear();
    dispatch(onLogoutCalendar());
    dispatch(onLogout());
  };

  return {
    //* Properties
    status,
    user,
    errorMessage,
    //* Methods (acciones q vamos a poder llamar pa interactuar c nto store)
    startLogin,
    startRegister,
    checkAuthToken,
    startLogout,
  };
};
