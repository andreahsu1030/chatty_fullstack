FROM node:23-alpine AS builder
WORKDIR /app
COPY chatty_client/package.json ./
RUN npm i
COPY chatty_client ./
RUN npm run build


FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY chatty_client/nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
