FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html ./
COPY src ./src
RUN npm run build

FROM node:24-bookworm-slim AS runtime
ENV NODE_ENV=production PORT=3000 HOST=0.0.0.0
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY server.js server-production.js ./
USER node
EXPOSE 3000
CMD ["npm", "start"]
