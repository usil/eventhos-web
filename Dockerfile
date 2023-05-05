FROM node:14
WORKDIR /app
COPY . ./
RUN git config --system url."https://github".insteadOf "git://github"
RUN npm cache clear --force
RUN npm install
RUN npm run build

EXPOSE 2110

ENTRYPOINT ["npm","run","start"]