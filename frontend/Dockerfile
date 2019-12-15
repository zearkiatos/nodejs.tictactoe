FROM node:12.13.0
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
USER root
RUN apt-get update && \
apt-get upgrade -y

COPY [".","/usr/src/app"]

RUN npm install

EXPOSE 3000