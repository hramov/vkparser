FROM node:17

WORKDIR /usr/src/app
RUN apt-get update && apt-get install --no-install-recommends -y
COPY package*.json ./
RUN npm i
COPY ./src/ ./
COPY ./data ./data
RUN ls

EXPOSE 5000
CMD [ "node", "main.js" ]
