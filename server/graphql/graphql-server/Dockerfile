FROM node:22-alpine

WORKDIR /app

# Installe uniquement les dépendances de production (cache Docker sur package*.json)
COPY package.json package-lock.json ./
RUN npm install --omit=dev

COPY . .

# Utilisateur non-root (bonne pratique sécurité)
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs
USER nodejs

EXPOSE 4000

CMD ["node", "src/index.js"]
