# Étape 1 : Build
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Étape 2 : Serveur NGINX
FROM nginx:alpine

# Copier les fichiers build dans nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configuration personnalisée pour React Router (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
