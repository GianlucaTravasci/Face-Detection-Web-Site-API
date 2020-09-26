FROM node:12.18.4

WORKDIR /usr/src/face-detection-web-site-api

COPY ./ ./

RUN npm install

CMD [ "/bin/bash" ]