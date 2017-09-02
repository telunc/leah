FROM node:8.0.0-alpine
RUN apk update && apk upgrade && apk add git python alpine-sdk
RUN mkdir -p usr/src
WORKDIR /usr/src/
RUN mkdir leah
WORKDIR /usr/src/leah
COPY package.json /usr/src/leah
RUN npm install
COPY . /usr/src/leah
WORKDIR src/
ENTRYPOINT [ "npm", "start" ]