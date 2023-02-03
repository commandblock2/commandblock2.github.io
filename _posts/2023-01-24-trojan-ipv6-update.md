---
title: net-proxy/trojan-gfw Got Speed Limited and Recovered after changing ip
date: 2023-01-25 20:34:59 +0800
categories: [report, problem-possibly-not-reproducible]
tags: [proxy, sys-admin, work-in-progress, en-us/zh-cn]
---

## For End users
这次是把梯子换到了ipv6，如果你突然用不了，[而且家里没有ipv6的支持](http://pingipv6.com/)，请到你的路由器登陆界面(通常是用浏览器去`192.168.0.1`)或者去找默认网关的ip，找到ipv6选项并且打开，前缀相关的选项改成关闭，然后各种重启/重连之后再试试

如果这个操作对你来说有难度或者做不到的话，请联系我
## Report

The limit of the bandwidth goes higher linearly by time, by the time of migration, the average download speed measured by download manjaro iso goes to less than 100KB/s, which is unusable by most standard.  

I then proceed to try `ssh -D`, finding that it has the exact same speed limit. However, later with a v2ray/tcp setup, the bandwidth limit is no longer there and it can reach at least 5MB/s.

Taking a while for me to realize that ssh also uses ssl, which should be the reason it got speed limited. The most reasonable assumption I can think of is that the GFW fucks all ssl/tls connection when there is an large amount of data going through the same address.

## Resolution

I later went on changing the trojan listening ip address to ipv6 and changed the DNS `A` record to a `AAAA` which points to the exact same server. While in the same time I fixed the ipv6 settings in the router with OpenWRT, everything works and the speed limit is no longer there.  
Which proves the current restriction are applied to certain ip instead of domain name, however, for the more future restriction it might go differently.  