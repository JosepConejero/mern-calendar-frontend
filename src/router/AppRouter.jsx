/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../auth";
import { CalendarPage } from "../calendar";
import { useAuthStore } from "../hooks";
//import { getEnvVariables } from "../helpers/getEnvVariables";

export const AppRouter = () => {
  const { status, checkAuthToken } = useAuthStore();

  //const authStatus = "not-authenticated";

  useEffect(() => {
    checkAuthToken();
  }, []);

  if (status === "checking") {
    return <h3>Cargando...</h3>; //si se ejecuta este return, no se ejecutará el q hay más abajo
  }

  //console.log(process.env);//para comprobar las variables de entorno
  //console.log(getEnvVariables());

  return (
    // <Routes> //ESTA FUE UNA PRIMERA VERSIÓN QUE HACÍA QUE SIEMPRE MOSTRARA EN EL PATH /auth/login
    //   {status === "not-authenticated" ? ( //"not-authenticated", "checking"
    //     <Route path="/auth/*" element={<LoginPage />} /> /* la ruta auth/* */
    //   ) : (
    //     <Route path="/*" element={<CalendarPage />} />
    //     /* Cualquier ruta que no sea /auth/* */
    //   )}
    //   <Route path="/*" element={<Navigate to="/auth/login" />} />
    //   {/* Para una ruta que no sea conocida o que no exista (esto no se ejecutaría, pero lo dejamos por seguridad)*/}
    // </Routes>
    <Routes>
      {status === "not-authenticated" ? ( //"not-authenticated", "checking"
        <>
          <Route path="/auth/*" element={<LoginPage />} />{" "}
          {/* si no estoy autenticado, me va a regresar la ruta auth/* que nos llevará al LoginPage;
              esta ("/auth/*") es la única ruta que va a permitirme entrar a la parte del login */}
          <Route path="/*" element={<Navigate to="/auth/login" />} />
          {/* si no estoy autenticado, cualquier ruta que no sea /auth/* nos llevará a /auth/login */}
        </>
      ) : (
        <>
          <Route path="/" element={<CalendarPage />} />
          {/* si estoy autenticado, la ruta / de mi url me va a llevar directamente al CalendarPage */}
          <Route path="/*" element={<Navigate to="/" />} />
          {/* y cualquier otra ruta que no sea / me llevará al / */}
        </>
      )}
    </Routes>
  );
};
