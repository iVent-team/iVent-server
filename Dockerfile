FROM node:18.17.0
WORKDIR /app
COPY package*.json /app/
RUN npm install -g npm@10.2.2
RUN npm install
RUN npm install -g typescript
COPY ./ /app/
RUN npm run build
RUN npm run remove-src
EXPOSE 3000
CMD ["npm", "run", "start"]
