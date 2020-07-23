FROM node:12.16.3-stretch-slim
MAINTAINER Ted Cheng

ENV APP_DIR=/app

COPY package.json $APP_DIR/package.json

COPY yarn.lock $APP_DIR/yarn.lock

RUN cd $APP_DIR \
    && apt-get update \
    && npm install -g nodemon \
    && yarn install

COPY . $APP_DIR

WORKDIR $APP_DIR

EXPOSE 3000

CMD ["nodemon server.js"]
