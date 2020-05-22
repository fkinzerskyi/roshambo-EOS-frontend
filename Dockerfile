FROM node:10.17.0

ENV PORT 3039


# Adding sources
WORKDIR /home/roshambo
COPY . /home/roshambo

RUN npm install -g @angular/cli@7.1.1
RUN npm install
RUN node patch.js
RUN ng build --configuration=${ENV_CONF}
RUN mkdir server/logs

CMD [ "node", "./server/server.js" ]

EXPOSE 3039