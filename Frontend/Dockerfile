# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_INVENTORY_API_URL
ARG VITE_PRODUCT_API_URL

ENV VITE_INVENTORY_API_URL=$VITE_INVENTORY_API_URL
ENV VITE_PRODUCT_API_URL=$VITE_PRODUCT_API_URL
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]