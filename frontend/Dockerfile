FROM node:18.17.0-alpine AS js-builder
WORKDIR /app
COPY . /app
RUN npm install
RUN npm run build

FROM node:18.17.0-alpine AS js-runner
WORKDIR /app
COPY --from=js-builder /app/.next /app/.next
COPY --from=js-builder /app/package.json /app
COPY --from=js-builder /app/node_modules /app/node_modules

EXPOSE 3000

CMD ["npm", "start"]
