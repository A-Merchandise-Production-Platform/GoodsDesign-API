FROM node:18 as build
WORKDIR /usr/src/app
COPY package.json .
COPY package-lock.json .
RUN npm install --legacy-peer-deps
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-slim
RUN apt update && apt install libssl-dev dumb-init -y --no-install-recommends
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/package.json .
COPY --chown=node:node --from=build /usr/src/app/package-lock.json .
RUN npm install --omit=dev --legacy-peer-deps
COPY --chown=node:node --from=build /usr/src/app/node_modules/.prisma/client ./node_modules/.prisma/client
# copy schema graphql
COPY --chown=node:node --from=build /usr/src/app/src/schema.gql ./src/schema.gql

ENV NODE_ENV=production
EXPOSE 5000
CMD ["dumb-init", "node", "dist/src/main"]