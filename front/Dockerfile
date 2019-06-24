FROM node:8.15.1

RUN npm install -g npm@6.9.0

ENV HOME=/home/app

COPY package.json $HOME/front/

WORKDIR $HOME/front
RUN npm install

COPY . $HOME/front

CMD ["npm", "start"]
