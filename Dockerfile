FROM node:18 as base
# create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
#install dependencies
COPY package.json /usr/src/app
RUN npm install -g nodemon
RUN npm install dotenv --save
RUN npm install -g mocha
RUN npm install --save-dev chai
RUN npm install
RUN npm ci
RUN mkdir -p /dist/node_modules
RUN cp -r node_modules/* /dist/node_modules/
ENV NODE_PATH /dist/node_modules
# bundle source
COPY . /usr/src/app
EXPOSE 4000

CMD npm test ; npm start