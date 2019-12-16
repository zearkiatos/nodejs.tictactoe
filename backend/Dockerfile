FROM node:latest
WORKDIR /usr/app
RUN apt-get update && \
apt-get upgrade -y
COPY package.json ./
RUN npm install
COPY . ./
RUN npm run start-backend
EXPOSE 3001

CMD ["npx","nodemon","."]