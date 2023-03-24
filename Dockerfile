FROM node:18.15
USER node
WORKDIR /mukmuk

COPY --chown=node:node . .
RUN npm ci

CMD ["npm", "start"]
