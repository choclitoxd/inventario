# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app

# Copy package descriptors
COPY package.json package-lock.json ./

# Install dependencies using legacy-peer-deps to avoid React 19 / Tremor conflict
RUN npm install --legacy-peer-deps

# Copy all source files
COPY . .

# Set API URL build argument (defaults to local backend)
ARG VITE_API_URL=http://localhost:8080
ENV VITE_API_URL=$VITE_API_URL

# Build for production
RUN npm run build

# Stage 2: Serve the compiled static files using Nginx
FROM nginx:1.25-alpine

# Copy static assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
