# Medusa backend + admin for H&R by Raza
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/releases .yarn/releases
RUN yarn install --immutable

COPY . .
# The admin dashboard is compiled with the public backend URL baked in
ARG MEDUSA_BACKEND_URL=http://localhost:9000
ENV MEDUSA_BACKEND_URL=$MEDUSA_BACKEND_URL
RUN yarn build

FROM node:20-alpine
WORKDIR /app/.medusa/server
ENV NODE_ENV=production

COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/.medusa/server ./
RUN ln -s /app/node_modules node_modules

EXPOSE 9000
CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]
