FROM node:23-alpine AS builder
WORKDIR /app
COPY chatty_backend/package.json ./
RUN npm install
COPY chatty_backend ./
RUN npm run build

