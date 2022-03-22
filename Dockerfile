FROM node:14

RUN mkdir /src
WORKDIR /src

COPY . /src
RUN npm install

RUN npm run build

EXPOSE 2110
ENV PORT 2110
ENTRYPOINT ["npm","run","start"]
