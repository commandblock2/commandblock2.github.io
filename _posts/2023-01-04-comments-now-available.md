---
title: Comments are now available
date: 2023-01-04 15:21:04 +0800
categories: [self-hosting, blogging]
tags: [sys-admin, meta]
---

![posting comment](/assets/img/screenshots/Screenshot_20230104_191941.webp)
_不需要帐号，直接随便输入一个名字就可以评论_

***

## 如果想要使用matrix支持
直接点login会有告诉你invalid link，但是我并不知道这个锅是谁的，是`cactus appservice`的还是`matrix.to`的  
### Workaround
右键login, copy link  
你会拿到一个像这样的 `https://matrix.to/#/%23comments_commandblock2.blog_%2Fposts%2Fserver-current-state%3Amatrix.commandblock2.xyz`
把 `https://matrix.to/#/` 去掉, `%23` -> `#`, `%2F` -> `/`, `%3A` -> `:` (其实这个操作就是reverse的escape)  
最后拿到 `#comments_commandblock2.blog_/posts/server-current-state:matrix.commandblock2.xyz`
使用任意matrix客户端，加入这个群  
在群里发送的信息会被转成评论  
![example](/assets/img/screenshots/Screenshot_20230104_195614.webp)

***

## 架设相关

之前想要加的 cactus comment 终于加到这个blog上了(  
在没看文档之前，我还以为可能是个有点小麻烦的事情  
但没想到里面直接有写 `jekyll` 的集成，那可好啊  
https://cactus.chat/docs/integrations/jekyll/  
最开始试用的时候用的是他们提供的 matrix homeserver，但是我有一个，所以还是要用自己的才舒服  
这个用起来还挺简单的，往html里加个

```html
<div id="comment-section"></div>
  <script>
  initComments({
    node: document.getElementById("comment-section"),
    defaultHomeserverUrl: "https://matrix.cactus.chat:8448",
    serverName: "cactus.chat",
    siteName: "{{ site.disqus.shortname }}",
    commentSectionId: "{{ page.url }}"
  })
  </script>
  <noscript>Please enable JavaScript to view the <a href="https://cactus.chat" rel="nofollow">comments powered by matrix.org.</a></noscript>
```

**差不多**网页端就完事了，至于加到什么位置，就取决于你想要在哪显示评论了  
啊对了那个`initComments`需要先fetch他们的script，那个也是开源的，用一个我没听说过的叫elm的语言写的，编译出来的js和css在教程里也会告诉你怎么引用，他们是把这俩东西放在ipfs上的  
**如果你要换homeserver的话可能得在浏览器上清一下cache或者啥，虽然我也不知道是谁的锅，但是确实可能会代码里换了结果在浏览器里还是旧的homeserver**

## appservice架设
**ppservice是单独的一个服务器(进程)，通过http和homeserver进行通讯**  
官方给的是用`docker`服务或者是`systemd`服务，我对docker不大感冒，虽然都是隔离环境(所以理论上除了网络和一些其他的隔离需要的东西)，应该没啥性能损失，但是docker里要对镜像做点小改动在升级的时候就会很要命。  
至于不用systemd只是因为有`openrc`，不希望垄断而已  
我的服务器上没有systemd但是还是照着systemd的教程来的，clone下repo，然后用keepassxc生成的hs_token和as_token(这俩可以随意生成)，这俩算是俩密码吧。  
**坑爹玩意这个教程里的两个token在两份配置文件里的顺序不一样**

大概是官方示例

`cactus.yaml`，这个是给synapse用的appservice配置文件
```
# A unique, user-defined ID of the application service which will never change.
id: "Cactus Comments"

# Where the cactus-appservice is hosted:
url: "http://cactus:5000"

# Unique tokens used to authenticate requests between our service and the
# homeserver (and the other way). Use the sha256 hashes of something random.
# CHANGE THESE VALUES.
as_token: "a2d7789eedb3c5076af0864f4af7bef77b1f250ac4e454c373c806876e939cca"
hs_token: "b3b05236568ab46f0d98a978936c514eac93d8f90e6d5cd3895b3db5bb8d788b"

# User associated with our service. In this case "@cactusbot:example.com"
sender_localpart: "cactusbot"

namespaces:
  aliases:
    - exclusive: true
      regex: "#comments_.*"
```

这个是appservice的环境变量，老坑爹玩意，这个hs在上头
```
CACTUS_HS_TOKEN=b3b05236568ab46f0d98a978936c514eac93d8f90e6d5cd3895b3db5bb8d788b
CACTUS_AS_TOKEN=a2d7789eedb3c5076af0864f4af7bef77b1f250ac4e454c373c806876e939cca
CACTUS_HOMESERVER_URL=http://localhost:8008
CACTUS_USER_ID=@cactusbot:example.com
```

官方给的systemd配置文件
```
[Unit]
Description=Cactus Comments appservice: Matrix powered embeddable comment backend

[Service]                                                                                         
Type=simple
ExecStart=/bin/bash -c 'gunicorn -w 4 -b 127.0.0.1:5000 --timeout 500 "app:create_app_from_env()"'
Restart=always
# Adjust this!
EnvironmentFile=/srv/www/cactus-appservice/env/appservice.env
# Adjust this!
WorkingDirectory=/srv/www/cactus-appservice
```

那我就改改，改成 shell + cron 好了
`cactus.sh`
```
#!/bin/bash
cd ~/cactus-appservice/
source env/bin/activate
source env.env

SESSION="cactus"

if screen -ls | grep -q $SESSION > /dev/null
then
        echo "server already started, no need to start again, script exiting"
        exit
fi
screen -S $SESSION -dm gunicorn -w 2 -b 127.0.0.1:5000 --timeout 500 "app:create_app_from_env()"
```

`crontab`: `*/1 * * * * ~/cactus-appservice/cactus.sh`
我知道这么做不是合适就是了，但是能用就行