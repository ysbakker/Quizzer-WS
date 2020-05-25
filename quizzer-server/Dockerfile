FROM node:latest

LABEL maintainer="Yorrick Bakker"
ENV NODE_ENV=production

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

COPY package*.json ./

USER node
RUN npm install

COPY --chown=node:node . .

ENTRYPOINT [ "npm", "start" ]