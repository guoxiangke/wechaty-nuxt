# nuxtChat (Typescript)

[![Powered by Wechaty](https://img.shields.io/badge/Powered%20By-Wechaty-green.svg)](https://github.com/chatie/wechaty)
[![Wechaty开源激励计划](https://img.shields.io/badge/Wechaty-开源激励计划-green.svg)](https://github.com/juzibot/Welcome/wiki/Everything-about-Wechaty)

基于 nuxt, wechaty 开发的个人微信号机器人 UI 平台 @see https://github.com/beclass/wxbot.git

> Typescript Version of UI bot

## Todo

http://localhost:3000/conversation

- [x] 消息 UnreadCount reset
- [x] 发送文件和表情
- [ ] More info => 常用客服回复 一键发送
- [ ] scrollToBottom when new message
- [ ] error page.vue 美化
- [ ] login 使用弹窗
- [ ] CURD of config
- [ ] is starting...
- [x] 消息类型展示-图片
- [ ] 消息类型展示-语音
- [ ] 消息类型展示-语音转文字
- [ ] 消息操作-快捷回复
- [ ] 消息操作-回复图片
- [ ] 消息操作-回复录音
- [x] 联系人展示-群组
- [ ] Last Reader/ Last Reader At by conversation/contact.
- [x] 给谁发消息后 last message，谁应该在 list 上面（类似于 star 星标）
- [x] Koa
- [ ] onLogout 退出
- [ ] 入群管理 begin
- [ ] 踢群
- [ ] botUser 回复内容给 群/好友 记录到数据库 bot.say(wechaty, receiver, content{type:'',data:''})

## Get Started

- 1. npm install
- 2. cp .env.example .env && vi .env
- 3. cp ./server/models/imports/\*.example cp ./server/models/imports/\*
- 4. ts-node server/models/imports/init.ts && npm run dev
- 5. curl http://127.0.0.1:3000/api/bots/1/login

## Deploy on production

- cp .env.example .env && vi .env
- docker-compose up -d
- docker-compose exec app /usr/src/app/node_modules/.bin/ts-node server/models/imports/init.ts

## Documents

- https://sequelize.org/master/manual/model-basics.html
- https://wechaty.js.org/v/zh/api/message#message-from-contact
-

https://wechaty.js.org/v/zh/api/
https://github.com/wechaty/wechaty/issues
https://github.com/wechaty/wechaty-puppet-padplus/issues

## Done

### Features

- [x] 自动转发(万群群发)

  - [x] 配置： ./server/models/imports/autoforward.json
  - [x] 某联系人的信息都转发到另外一个/多个联系人（个人到个人）
  - [x] 某联系人的信息都转发到另外一个/多个群（个人到群）
  - [x] 某群的指定群成员信息都转发到另外一个/多个群/联系人（群到群，群到个人）
  - [x] 万群群发, 某指定群名的内容，群发给 bot 的所有群
        某个群（群名：process.env.FORWOARD_ALL=万群群发）的所有成员发送的信息，都转发到 bot 的所有群
  - [x] 支持的类型：纯文本，表情（转发后变成文件了），

- [x] 关键词（正则匹配）自动回复

  - [ ] 后台 UI 配置 关键词
  - [x] 全局功能开关
        可以通过 回复 #on | #off 给 bot 开启和关闭
        配置： bot.config.autoReply = true
    - [x] 回复 群名称 拉你入群，默认开启 bot 创建的群
    - [ ] 后台 UI 配置
  - [ ] 群开关
        room.config.autoReply = false

  - [x] 回复文本 【ping】
  - [x] 回复本地 mp3
  - [x] 回复本地/远程（可 URL 链接） mp4
  - [x] 回复本地 image
  - [x] 回复本地/远程 文件 attachment
    - [x] 远程 mp3 链接 将作为附件发送
  - [x] 回复用户名片
  - [x] 回复链接 link

- [x] 已有指令提醒
      回复任意无法处理的信息，将回复 defaultReply
- [x] 保存消息记录（个人和已配置的群）
      room.config.logMsg = true
- [x] 关键词入群（按群名/配置）
- [x] 定时任务

  - 定时发送/群/联系人
  - [x] 自定义配置
    - [x] 配置文件 ./bot/config/schedule.json
    - [ ] schedule config reload!
  - [x] 定时发送本地 mp3
  - [x] 定时发送本地 mp4 需要安装 ffmpeg，见 Dockerfile
  - [x] 定时发送规则

    - [x] 按文件个数 count (如循环发送 001.mp3~150.mp3)
    - [x] 按日期 date (如循环发送 0101.mp4~1231.mp4)

- [x] bot 收到加群邀请，自动入群
- [x] bot 自动加好友请求
  - [x] 通过后，欢迎信息 bot.config.welcomeMsg = 'welcome'

### Backend

- [x] 消息存储到 DB
  - [x] room.config.logMsg = true
  - [x] files 存储到 files/msg/ 并 md5 去重
- [x] BE auth Middleware
- [x] FE auth Middleware
- [x] Login & Logout with koa-passport + session

## Build Setup (Nuxt)

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
