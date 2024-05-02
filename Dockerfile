FROM node:20.12.2
WORKDIR /app
COPY . ./
RUN git config --system url."https://github".insteadOf "git://github"
RUN npm cache clear --force
RUN npm install
RUN npm run build

EXPOSE 2110

COPY DockerfileEntryPoint.sh /usr/local/bin/DockerfileEntryPoint.sh
RUN chmod 744 /usr/local/bin/DockerfileEntryPoint.sh
ENTRYPOINT ["DockerfileEntryPoint.sh"]