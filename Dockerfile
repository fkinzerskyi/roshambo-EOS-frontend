# FROM node:10.17.0

# ENV PORT 3042

# RUN apt-get update \
# 	&& apt-get install -y nodejs npm git git-core \
#     && ln -s /usr/bin/nodejs /usr/bin/node

# ARG ENV_CONF=production 
# ENV ENV_CONF=${ENV_CONF}

# # Adding sources
# WORKDIR /home/roshambo
# COPY . /home/roshambo

# RUN cd /home/roshambo && npm install -g @angular/cli@7.1.1
# RUN cd /home/roshambo && npm install
# RUN cd /home/roshambo && ng build --configuration=${ENV_CONF}
# RUN cd /home/roshambo && mkdir server/logs

# CMD [ "node", "/home/roshambo/server/server.js" ]

# EXPOSE 3042

FROM node:10.17.0

ENV PORT 3039

# ARG ENV_CONF=production
ARG ENV_CONF=jungle
ENV ENV_CONF=${ENV_CONF}

# Adding sources
WORKDIR /home/roshambo
COPY . /home/roshambo

RUN npm install -g @angular/cli@7.1.1
RUN npm install
# RUN npm ci --only=prod
RUN ng build --configuration=${ENV_CONF}
# RUN mkdir server/logs

CMD [ "node", "./server/server.js" ]

EXPOSE 3039