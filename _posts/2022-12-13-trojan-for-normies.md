---
title: Trojan for Normies
date: 2022-12-13 11:34:52 +0800
categories: [tutorial]
tags: [for-normies]
---

# 本篇面向Windows用户  

## 废话

这篇会教你怎么使用 `trojan`，这是一个代理程序  
~~说人话就是怎么用某一款梯子~~  
trojan的名字来源于
> Trojan is not a fixed program or protocol. It's an idea, an idea that imitating the most common service, to an extent that it behaves identically, could help you get across the Great FireWall permanently, without being identified ever. We are the GreatER Fire; we ship Trojan Horses.  

有些杀毒可能会把它默认成病毒，因为他的名字里有trojan /笑  
这个东西是开源的，而且我还看过一部分代码，所以请放心使用
源码: https://github.com/trojan-gfw/trojan

## 教程
如果你日常在国内用Edge的话，你又恰好有  
`Firefox` x1   
那么做完下面的操作之后，你就可以用Firefox看看墙外的世界了，但是墙内的还是建议回到Edge上看  
注: Firefox 建议下国际版/开发者版，不过国内版照样能用，就是可能有点中国特色了


去这个链接下载  
    https://github.com/trojan-gfw/trojan/releases/download/v1.16.0/trojan-1.16.0-win.zip  
**大概率**或者如果你下载不了，请去下面的镜像链接下载  
    http://dl.commandblock2.xyz/dl/trojan-1.16.0-win.zip

下载后解压zip，里面的文件大概是这样的  
![img](/assets/img/Screenshot_20221213_114738.jpg)  
右键config.json，拿记事本打开都行，什么文档编辑器都可以    
![img](/assets/img/Screenshot_20221213_115207.webp)  
_注意密码写对了就行，粘贴都可以的_  
把密码填上就行，
如果你直接拿到了这篇博客，你手里应该有个我给你发的密码
(游客别想白嫖(逃

**保存**  
保存完成后，双击`trojan.exe`，如果有缺失dll的请运行一下`VC_redist.x64.exe`  
然后你应该能看到这样的界面  
![img](/assets/img/Screenshot_20221213_120926.webp)  
_对不起我没找个windows的机器，只好在本机上拿一个好看一点的界面糊弄了(逃_   
打开你的 Firefox，右上角菜单，设置，搜索`proxy`  
![img](/assets/img/Screenshot_20221213_120150.webp)
填写成这个样子，点ok就好
![img](/assets/img/Screenshot_20221213_120351.png)

然后去 `google.com` 试试就好了.

注:每次要看墙外的东西的时候跑`trojan.exe`就可以了，然后在你就可以在 Firefox 里翻出去了  
其他的程序不受影响，不会默认翻墙，除非你手动设置，只有这个 Firefox 可以翻  
但是介个并不是匿名滴，想要高匿名性非常麻烦
## 后续
**有的时候也会连不上的情况，可能要等一小会**，而且国外的东西用起来还是慢一些的，可能有点小麻烦qwq  
如果这篇有说的不够清楚的地方一定要跟我说说(    
在敏感时段可能可用性会降低，会出现连上很困难的情况，使用 `vpn.commandblock2.xyz` 域名的人或者不知道自己用的什么的联系一下我