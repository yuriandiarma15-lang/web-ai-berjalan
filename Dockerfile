
# ==========================================
# STAGE 1: BUILD WEBSITE DAN DATABASE MODULE
# ==========================================
FROM node:20-alpine AS build

WORKDIR /app

# Perangkat untuk mengompilasi better-sqlite3
RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# ==========================================
# STAGE 2: PRODUCTION SERVER
# ==========================================
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Salin dependencies yang sudah terkompilasi
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules

# Salin hasil website React
COPY --from=build /app/dist ./dist

# Salin backend API
COPY --from=build /app/server.js ./server.js

EXPOSE 4173

CMD ["npm", "start"]
