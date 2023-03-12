FROM node:18
WORKDIR /source

# copy package.json into working dir
COPY package.json .
RUN npm install

# copy source documents into working dir
COPY . .

# start our app
EXPOSE 80
EXPOSE 443
CMD ["node", "service.js"]



