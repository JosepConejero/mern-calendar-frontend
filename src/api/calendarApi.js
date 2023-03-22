import axios from "axios";
import { getEnvVariables } from "../helpers/getEnvVariables";

const { REACT_APP_URL } = getEnvVariables();

const calendarApi = axios.create({
  baseURL: REACT_APP_URL,
});

//todo: configurar interceptores
// antes de se haga la request, usaré este interceptor
// internamente el use se dispara con la configuración de la petición
// y tengo q regresa esa configuración de nuevo (config) o la configuración modificada
calendarApi.interceptors.request.use((config) => {
  //aquí dentro puedo añadir headers o modificar headers de la request
  //añadiré mi header personalizado
  config.headers = {
    ...config.headers, //quiero mantener los headers q ya había
    "x-token": localStorage.getItem("token"),
    //"x-token-prueba": "PRUEBA ABC CASUNDENA",
  };
  return config; //todas las peticiones mandarán ese token
});
// en definitiva, a cualq petición q haga con ese calendarApi, le colocará ese header
// si no tenemos token, valdrá undefined, y devolverá q el usuario no está autenticado

export default calendarApi;
