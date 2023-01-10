---
title: Minecraft Server Status Weekly Update 4
date: 2023-01-10 23:01:11 +0800
categories: [gaming, minecraft]
tags: [minecraft, procrastinated, zh-cn]
---

# 6 上周咕一天，这周就敢咕两天了是吧

这周服务器里什么有用的进展都没有  
![雪人](/assets/img/minecraft/2023-01-10_23.04.22.webp)
_刷雪机+几个红树树苗放地上没管_

## cnm paper

![地狱门加载](/assets/img/minecraft/2023-01-10_23.07.23.webp)
_做梦，常规地狱门加载器他妈的别想工作_

![伪和平](/assets/img/minecraft/2023-01-10_23.07.47.webp)
_200多的silver fish就算加载了还他妈他妈他妈刷怪是吧，有人在gayhub上说早就坏了_

## 作为服主/运维的视角

![masscan](/assets/img/minecraft/2023-01-07_12.05.06.webp)
_masscan光顾服务器的第一次被我发现了，笑死我了_

随后呢

```log
[06:04:26] [Server thread/INFO]: masscan joined the game
[06:04:26] [Server thread/INFO]: masscan[/127.0.0.1:41114] logged in with entity id 35934 at ([world]25.5, 109.0, 8.5)
[06:04:27] [Server thread/WARN]: [AuthMe] Could not save LimboPlayer for 'masscan' [InaccessibleObjectException]: Unable to make private java.util.Collections$EmptyList() accessible: module java.base does not "opens java.util" to unnamed module @6c2d9fe1
[06:04:27] [Server thread/INFO]: masscan lost connection: Disconnected
[06:04:27] [Server thread/INFO]: masscan left the game
[06:35:49] [Craft Scheduler Thread - 7877 - SkinsRestorer/WARN]: [SkinsRestorer] Failed to get release info from api.github.com. 
 If this message is repeated a lot, please see http://skinsrestorer.net/firewall
[07:51:06] [User Authenticator #22/INFO]: UUID of player notmasscan is 97c60b2d-c4e6-3939-a842-cd3e23472f5f
[07:51:06] [Server thread/INFO]: notmasscan joined the game
[07:51:06] [Server thread/INFO]: notmasscan[/内网的vpn地址:56432] logged in with entity id 36836 at ([world]13.5, 101.0, -2.5)
[07:51:06] [Server thread/WARN]: [AuthMe] Could not save LimboPlayer for 'notmasscan' [InaccessibleObjectException]: Unable to make private java.util.Collections$EmptyList() accessible: module java.base does not "opens java.util" to unnamed module @6c2d9fe1
[07:51:06] [Server thread/INFO]: notmasscan issued server command: /pl
[07:51:06] [Server thread/INFO]: notmasscan lost connection: [玩家系统] 您发送命令的速度太快了，请重新加入服务器再等待一会后再使用命令[07:51:06] [Server thread/INFO]: notmasscan left the game
[07:51:25] [User Authenticator #22/INFO]: UUID of player commandblock2 is 和 usercache.json 里一样的 uuid
[07:51:25] [Server thread/INFO]: commandblock2 joined the game
[07:51:25] [Server thread/INFO]: commandblock2[/内网的vpn地址:38032] logged in with entity id 36867 at ([world]-37.53684442638035, 94.0, -57.57353362875855)
[07:51:25] [Server thread/WARN]: [AuthMe] Could not save LimboPlayer for 'commandblock2' [InaccessibleObjectException]: Unable to make private java.util.Collections$EmptyList() accessible: module java.base does not "opens java.util" to unnamed module @6c2d9fe1
[07:51:29] [Craft Scheduler Thread - 8113 - AuthMe/INFO]: [AuthMe] commandblock2 used the wrong password
[07:51:29] [Craft Scheduler Thread - 8114 - AuthMe/INFO]: [AuthMe] commandblock2 used the wrong password
[07:51:29] [Server thread/INFO]: commandblock2 lost connection: [玩家系统] 错误的密码[07:51:29] [Server thread/INFO]: commandblock2 left the game
[07:51:44] [User Authenticator #22/INFO]: UUID of player 之前玩的玩家A is 和 usercache.json 里一样的 uuid
[07:51:44] [Server thread/INFO]: 之前玩的玩家A joined the game
[07:51:44] [Server thread/INFO]: 之前玩的玩家A[/内网的vpn地址:40786] logged in with entity id 36965 at ([world]-16.169364180809982, 93.0, -72.4222633016651)
[07:51:44] [Server thread/WARN]: [AuthMe] Could not save LimboPlayer for '之前玩的玩家A' [InaccessibleObjectException]: Unable to make private java.util.Collections$EmptyList() accessible: module java.base does not "opens java.util" to unnamed module @6c2d9fe1
[07:51:47] [Craft Scheduler Thread - 8116 - AuthMe/INFO]: [AuthMe] 之前玩的玩家A used the wrong password
[07:51:47] [Craft Scheduler Thread - 8113 - AuthMe/INFO]: [AuthMe] 之前玩的玩家A used the wrong password
[07:51:47] [Server thread/INFO]: 之前玩的玩家A lost connection: [玩家系统] 错误的密码[07:51:47] [Server thread/INFO]: 之前玩的玩家A left the game
[07:52:02] [User Authenticator #22/INFO]: UUID of player 之前玩的玩家C is 和 usercache.json 里一样的 uuid
[07:52:02] [Server thread/INFO]: 之前玩的玩家C joined the game
[07:52:02] [Server thread/INFO]: 之前玩的玩家C[/内网的vpn地址:52666] logged in with entity id 37043 at ([world]233.30000001192093, 105.0, -428.2568399504792)
[07:52:02] [Server thread/WARN]: [AuthMe] Could not save LimboPlayer for '之前玩的玩家C' [InaccessibleObjectException]: Unable to make private java.util.Collections$EmptyList() accessible: module java.base does not "opens java.util" to unnamed module @6c2d9fe1
[07:52:05] [Craft Scheduler Thread - 8116 - AuthMe/INFO]: [AuthMe] 之前玩的玩家C used the wrong password
[07:52:05] [Craft Scheduler Thread - 8114 - AuthMe/INFO]: [AuthMe] 之前玩的玩家C used the wrong password
[07:52:05] [Server thread/INFO]: 之前玩的玩家C lost connection: [玩家系统] 错误的密码[07:52:05] [Server thread/INFO]: 之前玩的玩家C left the game
[07:52:21] [User Authenticator #22/INFO]: UUID of player 之前玩的玩家B is 和 usercache.json 里一样的 uuid
[07:52:21] [Server thread/INFO]: 之前玩的玩家B joined the game
[07:52:21] [Server thread/INFO]: 之前玩的玩家B[/内网的vpn地址:42184] logged in with entity id 37337 at ([world]-68.67202590892903, 92.34173598704537, -61.821717765500615)
[07:52:21] [Server thread/WARN]: [AuthMe] Could not save LimboPlayer for '之前玩的玩家B' [InaccessibleObjectException]: Unable to make private java.util.Collections$EmptyList() accessible: module java.base does not "opens java.util" to unnamed module @6c2d9fe1
[07:52:23] [Craft Scheduler Thread - 8116 - AuthMe/INFO]: [AuthMe] 之前玩的玩家B used the wrong password
[07:52:23] [Craft Scheduler Thread - 8115 - AuthMe/INFO]: [AuthMe] 之前玩的玩家B used the wrong password
[07:52:23] [Server thread/INFO]: 之前玩的玩家B lost connection: [玩家系统] 错误的密码[07:52:23] [Server thread/INFO]: 之前玩的玩家B left the game
[08:04:27] [User Authenticator #23/INFO]: UUID of player masscan is 08e0740e-db1b-3a2a-9c6f-35e403c15f12
[08:04:27] [Server thread/INFO]: masscan joined the game
[08:04:27] [Server thread/INFO]: masscan[/127.0.0.1:39262] logged in with entity id 37531 at ([world]25.5, 109.0, 8.5)
[08:04:27] [Server thread/WARN]: [AuthMe] Could not save LimboPlayer for 'masscan' [InaccessibleObjectException]: Unable to make private java.util.Collections$EmptyList() accessible: module java.base does not "opens java.util" to unnamed module @6c2d9fe1
[08:04:27] [Server thread/INFO]: masscan lost connection: Disconnected
[08:04:27] [Server thread/INFO]: masscan left the game
```

不知道是扫什么的，同时这两天snp(黑山大叔)直播间在直播的时候被 ddos 了(因为他有舰长服)，不确定这个是否有关，需要本服存档备份的请联系我，大小截止到今天 4.9G