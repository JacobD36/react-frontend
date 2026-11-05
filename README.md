# react-frontend

Interfaz en **React 18**, **TypeScript**, **Tailwind CSS** y **Vite** que permite ingresar una matriz rectangular, la envía a `go-api` y muestra la matriz original, la rotada, las matrices Q y R de la factorización QR, y el panel de estadísticas. Se sirve como sitio estático con **nginx**.

Desarrollado por **Jaime Pérez Frias**, Fullstack Developer, como parte del Desafío Técnico de Interseguro (División TI).

## Requisitos del desafío cubiertos

- Frontend opcional que consume la API y muestra la rotación de la matriz y las estadísticas adicionales.
- Inicio de sesión contra `go-api` para obtener el JWT con el que se consultan las APIs.
- Estados de carga (skeletons) y alertas de error de red.
- Contenerización con Docker y despliegue en la nube (Railway).

## Funcionamiento

1. El usuario inicia sesión con las credenciales de `go-api` y obtiene un JWT.
2. Define el tamaño de la matriz (1 a 10 filas y columnas) y completa sus valores. Al cambiar el tamaño se conservan los valores existentes.
3. Al procesar, la app envía la matriz a `go-api` y muestra los resultados: estadísticas, matriz original, rotada, Q y R.

El frontend sólo habla con `go-api`, que a su vez consulta a `node-api`. No conoce la red interna.

## Cómo se desarrolló

- **Componentes pequeños y sin lógica de red**: `LoginForm`, `MatrixInput`, `MatrixViewer` y `StatsDashboard` reciben datos y callbacks.
- **Capa de servicio única** (`src/services/apiService.ts`): centraliza las llamadas HTTP, convierte los errores de red en mensajes en español y tipa las respuestas.
- **Estado en `App.tsx`**: orquesta el flujo y mantiene el token en memoria, no en `localStorage`.
- **Configuración en un solo punto** (`src/config.ts`): la única variable de entorno del frontend.
- **Rutas desconocidas** redirigidas a `index.html` en nginx, para que el SPA funcione con cualquier ruta.

## Tecnologías

React 18 · TypeScript · Tailwind CSS 4 · Vite · nginx (imagen Alpine) · Docker · Railway.

## Variables de entorno

Consulta [`env.template`](env.template). La única variable es `VITE_GO_API_URL`, que se incrusta en el bundle al compilar. Debe ser la URL pública de `go-api`.

## Ejecución

```bash
npm ci
cp env.template .env
npm run dev                  # http://localhost:5173
```

Build de producción y verificación de tipos:

```bash
npm run build
```

Con Docker (la URL se pasa en build):

```bash
docker build --build-arg VITE_GO_API_URL=http://localhost:8080 -t react-frontend .
docker run -p 8000:80 react-frontend
```

## Pruebas

Este repositorio no incluye una suite de pruebas automatizadas. La verificación consiste en el chequeo de tipos de TypeScript (`npm run build` ejecuta `tsc --noEmit` antes de compilar con Vite). Las pruebas de la lógica de negocio están en `go-api` y `node-api`.

## Estructura

```
src/components/      componentes de presentación
src/services/        cliente HTTP hacia go-api
src/config.ts        variable de entorno del frontend
src/App.tsx          flujo principal y estado
nginx/               plantilla de nginx que usa PORT
```

## Despliegue en Railway

1. Crea un servicio desde este repositorio; Railway usa el `Dockerfile` de la raíz.
2. Define `VITE_GO_API_URL` con la URL pública de `go-api`. Debe estar disponible durante el build.
3. Esa URL del frontend debe figurar en `CORS_ORIGINS` de `go-api`.
