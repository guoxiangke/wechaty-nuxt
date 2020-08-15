FROM node:10
# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
# 把./server排除在外，这样，每次修改代码，不用重复构建镜像，直接使用cache
COPY . /usr/src/app

# we need ffmpeg send mp4
# RUN apt-get -y update && apt-get install -y ffmpeg
# 精简镜像
RUN set -ex; \
  apt-get update; \
  apt-get install -y --no-install-recommends \
  ffmpeg \
  ; \
  \
  apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false; \
  rm -rf /var/lib/apt/lists/*

# Install app dependencies
# RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN npm install --no-optional

# nuxt build for production
RUN npm run build

EXPOSE 3000
CMD [ "npm", "start" ]