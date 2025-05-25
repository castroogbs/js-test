# Etapa de build
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npx prisma generate
# RUN npx swagger-jsdoc -d src/swagger.ts -o dist/swagger.json
RUN npm run build

# Etapa de deploy
FROM node:20
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/src ./src
EXPOSE $PORT
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
