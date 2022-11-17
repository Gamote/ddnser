FROM node:19.1.0-alpine AS development

USER node

WORKDIR /usr/src/app

COPY --chown=node:node ./package.json ./
COPY --chown=node:node ./yarn.lock ./

RUN yarn install --immutable --immutable-cache --check-cache

COPY --chown=node:node . .

FROM node:19.1.0-alpine as build

USER node

WORKDIR /usr/src/app

COPY --chown=node:node ./package.json ./
COPY --chown=node:node ./yarn.lock ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN yarn build

RUN yarn install --immutable --immutable-cache --check-cache --production && yarn cache clean

FROM node:19.1.0-alpine as production

USER node

WORKDIR /usr/src/app

COPY --chown=node:node ./package.json ./
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "yarn", "start" ]
