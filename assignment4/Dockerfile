FROM node:8

ENV APP_HOME /usr/src/app

# Create app directory
WORKDIR ${APP_HOME}

# Copy built folder where only include js file to container app directory
COPY ./built ./

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Upload necessary dependencies, please ensure you run npm --production which avoid to include unnecessary package after build
COPY ./node_modules ./node_modules

RUN chmod +x $APP_HOME/*.js

EXPOSE 3000

CMD [ "npm", "start" ]
