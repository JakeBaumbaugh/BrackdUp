FROM node:18

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . .

CMD ["node", "app.js"]
# port 3000
# expecting server on 3001