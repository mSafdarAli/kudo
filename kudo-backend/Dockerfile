# Add "AS build" for later use
FROM node:latest as build-step

# This is exactly what you had before
RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY package.*json /usr/app/
RUN npm install

# Now build the actual image, starting over.
FROM node:latest

COPY . /usr/app/
RUN npm i -g pm2
# but not its node_modules tree or anything else
CMD ["pm2-runtime", "/usr/app/index.js"]