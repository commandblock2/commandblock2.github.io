---
title: FUCK wordpress
date: 2022-11-26 16:58:58 +0800
categories: [self-hosting, blogging]
tags: [sys-admin, meta, en-us/zh-cn]
---

## 新博客开张


啊哈哈哈哈哈哈，新博客来咯  

新的博客用的是`jekyll`，支持`markdown`，右下角有更多介绍，随便找了个主题就开始用了  
~~看着还不错，就是评论服务看起来我都不太喜欢，希望哪天可以有时间整个 [cactus comment](https://cactus.chat)，正巧我手里有个matrix服务器~~
已经完成

#### 新博客和网站的结构
这个博客有两份地址，[commandblock2.xyz/blog](https://commandblock2.xyz/blog)(这个地址可能会比较灵车，因为是国内端口映射过去的)，和 [commandblock2.github.io](https://commandblock2.github.io) (分享请用这个地址)  
`.github.io`的就很容易理解了嘛，commandblock2.xyz 解析到的vps在国外，因为国内不给开放80/443的端口，而且香港的话被当成梯子封起来就很难受了  

为了
- 迁移成本归零(准备每年双11换vps)
- 数据安全?(不被vps提供商删文件)
- 廉价
- 方便维护  
- ...  

所有我需要稳定依赖的服务全部都放在了家里的一台空闲的桌面机(曾经是桌面)上，  
经过调查，我家确实有ipv6而且有ipv6的公网ip，但是问题在光猫的port forwarding不工作    

那怎么办呢，那就只好买vps当公网ip/流量转发了，下面这个表就是整个站的拓卜结构了

| 物理机编号 | 费率                            | Domain                   | Function                  | Distribution | Softwares                            | Detailed Description                                                               |
|------------|---------------------------------|--------------------------|---------------------------|--------------|--------------------------------------|------------------------------------------------------------------------------------|
| #0         | 3.5$ / Mon                      | commandblock2.xyz        | website hosting           | Debian       | nginx                                | 外网vultr租的一台机器，minimal spec                                                 |
| #0         |                                 | dl.commandblock2.xyz     | 下载站                    |              | nginx                                | 跟上面是同一个服务器，多一个sni，外网带宽真他妈便宜，文件用scp/sftp上传，用nginx serve |
| #1         | 24￥ + .8￥ * outbound / GB / Mon | mc.commandblock2.xyz     | mc服地址 / 回家用的穿透服 | Debian       | tinc/socat/sshd                      | tinc组建软件局域网，socat转发mc流量，这个是阿里云的ecs，minimal spec按流量计费，不幸的是没人陪我玩mc,我就把这个服关掉了        |
| #2         | 35￥/ Year (明年就换)            | lbw.mc.commandblock2.xyz | 低带宽mc服地址            | Debian       | sshd                                 | ssh远程端口转发流量                                                                |
| #2         |                                 | lbw.commandblock2.xyz    |                           |              | sshd                                 | 上面的alias                                                                        |
| #2         |                                 | matrix.commandblock2.xyz | matrix服务器地址          |              | sshd                                 | 联邦用端口8848/本服流量443                                                        |
| #3         | ???                             | 没有公网ip               | 所有的服务                | Gentoo       | synapse, minecraft, tinc, nginx, ... | 内网主机                                                                           |


目前的计划是每次更新完blog，push到github上用它的ci服务，直接做成github pagees，~~然后在内网主机(#3)上wget定时爬下来这个页面~~，[但是wget不好使](../mirror-site)，然后用`ssh` port-forward(over trojan)到commandblock2.xyz上面  

##### Why not frp
sshd永远是预装的，tinc/socat一般包管理器里都有，tinc功能比frp强，socat可以不用配置文件直接定时ssh过去就可以，另外frp是go写的听说有内存泄漏还没修 /笑

## Why not wordpress anymore
- uses php, 
- installed by `portage` but need frequent update.  
- "official" markdown support as in plugin.  
- not responsive when having a bad connection, especially for writing a blog post, absolutely garbage experience.

## 旧博客怎么了
自从wordpress开始麻烦之后，我就用`wget`爬下了旧的站，做成静态的放在这个地址，搜索功能应该不太能使，但是就一页  
old blog: [https://commandblock2.xyz/blog-legacy/index.html](https://commandblock2.xyz/blog-legacy/index.html)