# Stage 1: Build stage
FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

# Run build to compile static assets to /usr/src/app/dist
RUN npm run build

# Stage 2: Production web server stage
FROM nginx:1.25-alpine

# Copy built static assets from Stage 1 to Nginx default public directory
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Copy custom Nginx configuration to support SPA routing (Vite/React Router fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
