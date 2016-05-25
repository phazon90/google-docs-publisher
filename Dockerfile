FROM node:argon

WORKDIR /gdoc-publisher
ADD . /gdoc-publisher
RUN npm install
