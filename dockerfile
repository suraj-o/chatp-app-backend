FROM node:20

WORKDIR /app

COPY package*.json .
COPY src/ src/
COPY tsconfig.json tsconfig.json

RUN npm install
RUN npm run build

CMD [ "npm","start" ]