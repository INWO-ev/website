FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/src/views ./src/views
COPY --from=build /app/src/content ./src/content
COPY --from=build /app/src/client ./src/client
COPY --from=build /app/public ./public
COPY --from=build /app/data ./data
EXPOSE 4100
CMD ["node", "dist/server/index.js"]
