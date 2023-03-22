// esto se pondría si fuera vite
/* export const getEnvVariables = () => {
  import.meta.env;
  return {
    //mis variables de entorno
    ...import.meta.env,
  };
}; */

export const getEnvVariables = () => {
  return {
    //mis variables de entorno
    ...process.env,
  };
};
