---
title: net-proxy/trojan-gfw Got Speed Limited and Recovered after changing ip
date: 8000-01-25 20:34:59 +0800
categories: [report, problem-possibly-not-reproducible]
tags: [proxy, sys-admin, work-in-progress, en-us]
---
## Report

The limit of the bandwidth goes higher linearly by time, by the time of migration, the average download speed measured by download manjaro iso goes to less than 100KB/s, which is unusable by most standard.  

I then proceed to try `ssh -D`, finding that it has the exact same speed limit. However, later with a v2ray/tcp setup, the bandwidth limit is no longer there and it can reach at least 5MB/s.

Taking a while for me to realize that ssh also uses ssl, which should be the reason it got speed limited. The most reasonable assumption I can think of is that the GFW fucks all ssl/tls connection when there is an large amount of data going through the same address.

## Resolution

I later went on changing the trojan listening ip address to ipv6 and changed the DNS `A` record to a `AAAA` which points to the exact same server. While in the same time I fixed the ipv6 settings in the router with OpenWRT, everything works and the speed limit is no longer there.  
Which proves the current restriction are applied to certain ip instead of domain name, however, for the more future restriction it might go differently.  

## Later on

That ipv6 address quickly got banned within a few days, and switching back to ipv4 fixed the problem and it is still usable up-to-today(Tuesday, 3 October 2023).