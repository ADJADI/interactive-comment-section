# --- Étape 1 : build de l'application Vite/React ---
FROM node:22-alpine AS build
WORKDIR /app

# Cache des dépendances : copie des manifestes avant le code source
COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Variable d'environnement injectée au build (URL du GraphQL en prod)
ARG VITE_GRAPHQL_URI=/graphql
ENV VITE_GRAPHQL_URI=$VITE_GRAPHQL_URI

RUN npm run build

# --- Étape 2 : image finale, nginx sert les fichiers statiques ---
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
