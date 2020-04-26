FROM node:latest

LABEL maintainer="Yorrick Bakker"
ENV NODE_ENV=production

COPY . /usr/src/app
WORKDIR /usr/src/app
RUN npm install

ENTRYPOINT [ "npm", "start" ]