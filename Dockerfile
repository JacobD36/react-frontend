# Etapa de compilación. VITE_GO_API_URL se incrusta en el bundle: debe ser la URL pública
# de go-api que usa el navegador, no un nombre de red interna.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
ARG VITE_GO_API_URL
RUN test -n "$VITE_GO_API_URL" || (echo "VITE_GO_API_URL es obligatoria para compilar el frontend" && exit 1)
ENV VITE_GO_API_URL=$VITE_GO_API_URL
COPY . .
RUN npm run build

# Etapa final: nginx sirve el bundle y devuelve index.html para rutas desconocidas.
# La imagen oficial de nginx genera default.conf desde templates con envsubst; el filtro
# evita que sustituya variables propias de nginx como $uri.
FROM nginx:1.27-alpine
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
# Railway inyecta PORT en tiempo de ejecución; este valor sólo aplica si no se define.
ENV PORT=80
ENV NGINX_ENVSUBST_FILTER=^PORT$
EXPOSE 80
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/" >/dev/null || exit 1
