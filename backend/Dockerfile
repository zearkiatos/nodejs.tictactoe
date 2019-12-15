FROM node:12.13.0
RUN mkdir /usr/src/app
USER root
WORKDIR /usr/src/app
RUN apt-get update && \
apt-get upgrade -y

COPY [".","/usr/src/app"]

RUN npm install && \
node .

EXPOSE 3001

CMD ["npx","nodemon","."]