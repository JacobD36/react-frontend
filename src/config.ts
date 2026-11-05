// Única variable de entorno del frontend. Vite la incrusta en el bundle durante el build,
// por lo que debe ser la URL pública de go-api que consulta el navegador.
export const goApiUrl: string = import.meta.env.VITE_GO_API_URL || "http://localhost:8080";
