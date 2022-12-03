---
title: Migrating to SSD (Homeserver)
date: 2022-11-27 18:14:26 +0800
categories: [self-hosting]
tags: [sys-admin]
---

## Previous
这两天玩mc的时候鞘翅老是飞着飞着地图就加载不出来了，matrix有的时候消息同步的也慢 
![nomap](/assets/img/minecraft/2022-11-27_16.19.28.webp)
_用了Distant Horizons的客户端_  
但原本服务器的地图都是提前生成的  
那我猜大概是磁盘io的速度跟不上了，测了测
![screen](/assets/img/minecraft/Screenshot_20221127_161647.webp)
_yakuake真好用以后再也不用konsole了(虽然都是一个(控件?)，左边iostat右边iotop_  
看来是猜中了，一个minecraft java服一个postgres(matrix reference服务端synapse)算是io大户了  
这个机器上面本来有个ssd是之前用的windows，但是
1. 那个ssd原本不是给这台机器用的
2. 我已经好久不用windows了
3. 那个ssd上应该没有啥有意义的数据了
```
server /mnt # lsblk
NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
sda           8:0    0 931.5G  0 disk 
├─sda1        8:1    0   256M  0 part /boot
└─sda2        8:2    0 931.3G  0 part /
sdb           8:16   0   1.8T  0 disk 
├─sdb1        8:17   0   128M  0 part 
├─sdb2        8:18   0 800.7G  0 part /mnt/other_btrfs_mount
├─sdb3        8:19   0 500.8G  0 part 
└─sdb4        8:20   0 561.4G  0 part 
nvme0n1     259:0    0 238.5G  0 disk 
├─nvme0n1p1 259:1    0   500M  0 part 
├─nvme0n1p2 259:2    0   128M  0 part 
├─nvme0n1p3 259:3    0   222G  0 part 
├─nvme0n1p4 259:4    0   919M  0 part 
├─nvme0n1p5 259:5    0  13.6G  0 part 
└─nvme0n1p6 259:6    0   1.1G  0 part 
```
_`/dev/sdb`是用来备份用的一张盘，备份完ssd上原有的数据就可以拔了，nvme0对应的是ssd_

***

#### 技术上的解释
这次要进行的操作是把95%(figuratively)的操作系统全部从一个磁盘上迁移到另外一块磁盘上  
操作其实非常简单，只要cp过去，然后重写一下fstab，设置一下内核参数，然后设置一下EFI启动顺序就直接完美了  
这台机器的软件上的配置非常特殊，**没有grub引导，没有initramfs，根目录用的btrfs，rootfs的内核参数是编译在内核里的(笑**  
相关配置参见 [EFI Stub (Gentoo wiki)](https://wiki.gentoo.org/wiki/EFI_stub)  
(有用到`snapshot`做自动化快照)虽然快照只给mc服务器用，但是累计的快照数据量大概可以到1T了，迁移起来就是大概会很麻烦  

```  
server / # df -h /home/paper119/backups/
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda2       932G  152G  780G  17% /

server / # du -sh /home/paper119/backups/
1.5T    /home/paper119/backups/
```

虽然可以直接把ssd上的数据全都清掉然后用 `mount`把需要io的路径挂上，但是大部分系统还是需要的，后面的话大概只有`/var/tmp/portage`之类的不大适合放在ssd上了

***

## Migration process
#### Format disk and making filesystems
[操作指南 from Gentoo Installation Handbook](https://wiki.gentoo.org/wiki/Handbook:AMD64/Full/Installation#Introduction_to_block_devices)  

```
server /mnt # fdisk /dev/nvme0n1

Welcome to fdisk (util-linux 2.37.4).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.


Command (m for help): p
Disk /dev/nvme0n1: 238.47 GiB, 256060514304 bytes, 500118192 sectors
Disk model: THNSN5256GPUK NVMe TOSHIBA 256GB        
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier:

Device             Start       End   Sectors  Size Type
/dev/nvme0n1p1      2048   1026047   1024000  500M EFI System
/dev/nvme0n1p2   1026048   1288191    262144  128M Microsoft reserved
/dev/nvme0n1p3   1288192 466956133 465667942  222G Microsoft basic data
/dev/nvme0n1p4 467220480 469102591   1882112  919M Windows recovery environment
/dev/nvme0n1p5 469102592 497715199  28612608 13.6G Windows recovery environment
/dev/nvme0n1p6 497717248 500117503   2400256  1.1G Windows recovery environment


```

一串操作之后

```

Command (m for help): p
Disk /dev/nvme0n1: 238.47 GiB, 256060514304 bytes, 500118192 sectors
Disk model: THNSN5256GPUK NVMe TOSHIBA 256GB        
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier:

Device          Start       End   Sectors   Size Type
/dev/nvme0n1p1   2048    526335    524288   256M Linux filesystem
/dev/nvme0n1p2 526336 500118158 499591823 238.2G EFI System

Filesystem/RAID signature on partition 1 will be wiped.

Command (m for help): w
The partition table has been altered.
Calling ioctl() to re-read partition table.
Syncing disks.
```

**这我是傻逼贴反了，应该p1是EFI分区的，后来改回来了**

```
server /mnt # mkfs -t vfat -F 32 /dev/nvme0n1p1 
mkfs: failed to execute mkfs.vfat: No such file or directory
```

???怎么还能这样的

```
server /mnt # emerge -a dosfstools

These are the packages that would be merged, in order:

Calculating dependencies... done!
[ebuild  N     ] sys-fs/dosfstools-4.2  USE="iconv -compat -test" 

Would you like to merge these packages? [Yes/No] y
...
```

安好mkfs.vat了之后

```
server / # mkfs -t vfat -F 32 /dev/nvme0n1p1 
mkfs.fat 4.2 (2021-01-31)
server / # mkfs -t btrfs /dev/nvme0n1p2 
btrfs-progs v5.15.1 
See http://btrfs.wiki.kernel.org for more information.

Performing full device TRIM /dev/nvme0n1p2 (238.22GiB) ...
NOTE: several default settings have changed in version 5.15, please make sure
      this does not affect your deployments:
      - DUP for metadata (-m dup)
      - enabled no-holes (-O no-holes)
      - enabled free-space-tree (-R free-space-tree)

Label:              (null)
UUID:               159a4e92-1c84-4978-8f91-ea7b577d0fae
Node size:          16384
Sector size:        4096
Filesystem size:    238.22GiB
Block group profiles:
  Data:             single            8.00MiB
  Metadata:         DUP               1.00GiB
  System:           DUP               8.00MiB
SSD detected:       yes
Zoned device:       no
Incompat features:  extref, skinny-metadata, no-holes
Runtime features:   free-space-tree
Checksum:           crc32c
Number of devices:  1
Devices:
   ID        SIZE  PATH
    1   238.22GiB  /dev/nvme0n1p2
```

***

#### Copy root filesystem

查来查去本来想用cp做这个的，结果到处都在说`rsync`怎么怎么好，那就rsync吧

```
server / # mount /dev/nvme0n1p2 /mnt/ssd-root/
server / # rsync -aH --exclude=/dev/ --exclude=/home/ --exclude=/mnt/ --exclude=/proc/ --exclude=/sys/ --exclude=/tmp/ / /mnt/ssd-root/
...
```

因为 `/home` 里的情况有点复杂，所有后面再处理，/mnt要是copy了那就寄了，剩下的几个exclude都是运行时才有的  
趁着现在服务器的io被占满了我啥都干不了，那我就去做个核酸吧  
顺便再备份一下我的matrix的聊天数据，不知道服务器停一会会有啥影响  
写blog好费时间啊  
那还是去b站看看屎尿屁煮波吧(

***

#### Chroot and recompile kernel and udpate fstab

```
server ~ # mount --rbind /dev/ /mnt/ssd-root/dev/
server ~ # mount --rbind /sys/ /mnt/ssd-root/sys
server ~ # mount -t proc /proc/ /mnt/ssd-root/proc

server ~ # chroot /mnt/ssd-root/ /bin/bash
server / # . /etc/profile
server / # export PS1="(ssd-root) ${PS1}"

(ssd-root) server / # cd /usr/src/linux
(ssd-root) server /usr/src/linux # blkid 
/dev/nvme0n1p1: UUID="D429-75E4" BLOCK_SIZE="512" TYPE="vfat" PARTUUID="962aa5a4-2a03-1140-84f1-c4ce5813ddde"
/dev/nvme0n1p2: UUID="159a4e92-1c84-4978-8f91-ea7b577d0fae" UUID_SUB="41a43cdc-b138-4392-9675-ea63884c4304" BLOCK_SIZE="4096" TYPE="btrfs" PARTUUID="14f27e23-cc22-0f41-b6d5-c44996b9cc54"
/dev/sda2: UUID="832bdede-de76-4e7c-ace3-3a7ce11c577d" UUID_SUB="323ab054-418d-40bb-9d84-67c8442f4083" BLOCK_SIZE="4096" TYPE="btrfs" PARTUUID="c596a9d3-1335-834e-ba5a-02b3afe9b80f"
/dev/sda1: UUID="B232-E248" BLOCK_SIZE="512" TYPE="vfat" PARTUUID="1f1766d8-33a9-5d44-b5f4-f4bf60c70c85"

```

这里我们获取一下`PARTUUID=14f27e23-cc22-0f41-b6d5-c44996b9cc54`

```
(ssd-root) server /usr/src/linux # make menuconfig
```
![kernel config](/assets/img/Screenshot_20221128_231627.webp)
_Kernel menuconfig_
去 `Processor type and features` 下找到着一条  
更新使这个参数对应上面获取的
![kernel config](/assets/img/Screenshot_20221128_231954.webp)

```
(ssd-root) server /usr/src/linux # mount /dev/nvme0n1p1 /boot/
(ssd-root) server /usr/src/linux # make -j13 && make modules_install && make install

(ssd-root) server /usr/src/linux # mkdir /boot/EFI/boot/ -p
(ssd-root) server /usr/src/linux # cp /mnt/vmlinuz-6.0.7-gentoo /mnt/EFI/boot/bootx64.efi
```

到了这一步，内核就算是装好了，马上就改改fstab了

(突然发现我就这一个根目录需要挂上，fstab空的都没问题，那就不写了)

***

#### Update UEFI booting

不管efivars是什么状态，先挂成`rw`再说就行

```
(ssd-root) server /usr/src/linux # mount /sys/firmware/efi/efivars -o rw,remount
```

然后用`efibootmgr`加一条放在第一位就可以重启了

```
# 现有的
(ssd-root) server /usr/src/linux # efibootmgr 
BootCurrent: 0004
Timeout: 0 seconds
BootOrder: 0004,0001,0002,0003
Boot0001* UEFI:CD/DVD Drive     BBS(129,,0x0)
Boot0002* UEFI:Removable Device BBS(130,,0x0)
Boot0003* UEFI:Network Device   BBS(131,,0x0)
Boot0004* Gentoo        HD(1,GPT,1f1766d8-33a9-5d44-b5f4-f4bf60c70c85,0x800,0x80000)/File(EFI\BOOT\BOOTX64.EFI)
Boot0005* UEFI OS       HD(1,GPT,1f1766d8-33a9-5d44-b5f4-f4bf60c70c85,0x800,0x80000)/File(\EFI\BOOT\BOOTX64.EFI)


(ssd-root) server /usr/src/linux # efibootmgr -c --part 1 --disk /dev/nvme0n1 -L "Gentoo on SSD" -l '\EFI\boot\bootx64.efi'
BootCurrent: 0004
Timeout: 0 seconds
BootOrder: 0000,0004,0001,0002,0003
Boot0001* UEFI:CD/DVD Drive     BBS(129,,0x0)
Boot0002* UEFI:Removable Device BBS(130,,0x0)
Boot0003* UEFI:Network Device   BBS(131,,0x0)
Boot0004* Gentoo        HD(1,GPT,1f1766d8-33a9-5d44-b5f4-f4bf60c70c85,0x800,0x80000)/File(EFI\BOOT\BOOTX64.EFI)
Boot0005* UEFI OS       HD(1,GPT,1f1766d8-33a9-5d44-b5f4-f4bf60c70c85,0x800,0x80000)/File(\EFI\BOOT\BOOTX64.EFI)
Boot0000* Gentoo on SSD HD(1,GPT,962aa5a4-2a03-1140-84f1-c4ce5813ddde,0x800,0x80000)/File(\EFI\boot\bootx64.efi)


```

这个应该就好了

```
(ssd-root) server /usr/src/linux # mount /sys/firmware/efi/efivars -o ro,remount
(ssd-root) server /usr/src/linux # exit
server ~ # reboot 
```

过了一会发现所有网络服务都没有上线，过去跑到机器旁边按了电源键要重启  
肏你妈服务器起不起来了日  

***

## Debug  

这个服务器运维过程中GG是个毫不稀奇的事情 /笑  
经过几次重启发现都起不起来，这个时候呢我就想连上一个屏来看看kernel panic到底是啥  
结果发现几周前把显卡拆了，板子上也没有hdmi/vga/dp的接口，人直接傻在那了  

没有显示器，那要把旧系统启起来看看是咋回事，那就得把ssd撤掉，那就拆机吧


![拆](/assets/img/torn-apart.webp)
_拆完了_

拔掉ssd之后呢，旧的系统启动，接上网线连到电脑上，开个cable tether，发现一切正常  
比较了一下内核的 `.config` 文件发现唯一的差别就是`PARTUUID`不一样，看起来好像也没啥问题  
再重写一遍吧，确认不是这个的锅，`make clean && make -j6 && make install`，还是启不起来  
上述过程有重复了一遍，浪费了好一阵才把旧系统重启过来

突然想起来之前这样的活干过两次，网线插上不亮，那多半是完全没起来，应该就是kernel panic了，去瞅了眼  
`/var/log/dmesg`发现ssd上的还是旧系统上次启动时候的dmesg，那就可以确定不是fstab写空的问题

后来把 `nvmen1p1` 里的内核换成旧内核，发现旧系统可以成功启动，那么可以确定问题不在ssd读不了的问题上

如果我的ssd能在旧系统上成功mount，也可以写，那么肯定驱动都是没问题的，bios又能读ssd加载内核

> 那么，***问题肯定就出在 `btrfs` 的驱动是module没有buitlin!!!***  


进menuconfig一看，btrfs全是 `<*>`，人又傻了  
(其实我这个时候已经傻逼了，btrfs如果是`<m>`不是`<*>`旧系统也启不起来的)  

最后实在没辙了，只好想之前出过的问题去搜一搜，诶 `Gentoo btrfs root kernel panic`  
一搜都是熟悉帖子，乱翻什么都没有，再一看，有人说这个NVME是module也不行，  
我想ssd里的ESP分区能读，那肯定NVME是没问题的，但是为了保险还是去看看吧，  
一看，诶嘿真他妈的是`<m>`，这才想起来加载内核的时候BIOS又不需要内核上的NVME支持，草  

最后锁定是了他妈的NVME支持用的是module而不是builtin，要是有个initramfs可能就没事了，但是可能其他地方有坑233

```
< CONFIG_NVME_COMMON=m
< CONFIG_NVME_CORE=m
< CONFIG_BLK_DEV_NVME=m
---
> CONFIG_NVME_COMMON=y
> CONFIG_NVME_CORE=y
> CONFIG_BLK_DEV_NVME=y
```

***

## 收尾
迁移到ssd之后还是有点小问题，比如用户login相关的一些验证会寄

```
paper119@localhost ~ $ crontab -l
You (paper119) are not allowed to access to (crontab) because of pam configuration.
```

这次真好，直接就跟我说pam configuration有问题我直接就重新编译然后重启

```

localhost ~ # emerge -a1v pam
These are the packages that would be merged, in order:

Calculating dependencies... done!
[ebuild   R    ] sys-libs/pam-1.5.2-r2::gentoo  USE="filecaps (split-usr) -audit -berkdb -debug -nis (-selinux)" ABI_X86="(64) -32 (-x32)" 0 KiB
```

mc服正常

然后把`postgresql`的数据重新同步过来一遍，终于synapse也正常了，虽然中间还是丢了些federated的服的消息

## Conclusion & Future plans

启动mc，拿着鞘翅随便乱飞，也不会有什么后果了，50m/s的占用最高才10%  
![good](/assets/img/minecraft/good.webp)

这次还是花了比预计更多的时间和精力迁移，问题出在了哪呢
- 不知道，
- Gentoo大坑发行版算一个(当然Gentoo也有很舒服的地方尤其是当桌面(逃，
- 没好好调查?
- 不知道，我觉得这个好像不太容易避免
- 就是自架服务器的不好的点吧

另外这个ssd我不大清楚寿命还有多久，可以看到写了1-几个T了，可能有点小危了，后面得赶紧上备份，这次还稍微看了看 btrfs 可以有 `send | recv`，而且有人说send多个snapshot还挺efficient，以后就可以开起多个盘的备份了，以后异地备份也得整上，

```
server ~ # smartctl -x /dev/nvme0n1p2
smartctl 7.3 2022-02-28 r5338 [x86_64-linux-6.0.7-gentoo] (local build)
Copyright (C) 2002-22, Bruce Allen, Christian Franke, www.smartmontools.org

=== START OF INFORMATION SECTION ===
Model Number:                       THNSN5256GPUK NVMe TOSHIBA 256GB
Serial Number:                      
Firmware Version:                   5KDA4103
PCI Vendor/Subsystem ID:            0x1179
IEEE OUI Identifier:                0x00080d
Controller ID:                      0
NVMe Version:                       <1.2
Number of Namespaces:               1
Namespace 1 Size/Capacity:          256,060,514,304 [256 GB]
Namespace 1 Formatted LBA Size:     512
Namespace 1 IEEE EUI-64:            00080d 030011d5dc
Local Time is:                      Tue Nov 29 03:46:31 2022 CST
Firmware Updates (0x02):            1 Slot
Optional Admin Commands (0x0017):   Security Format Frmw_DL Self_Test
Optional NVM Commands (0x001e):     Wr_Unc DS_Mngmt Wr_Zero Sav/Sel_Feat
Log Page Attributes (0x02):         Cmd_Eff_Lg
Warning  Comp. Temp. Threshold:     78 Celsius
Critical Comp. Temp. Threshold:     82 Celsius

Supported Power States
St Op     Max   Active     Idle   RL RT WL WT  Ent_Lat  Ex_Lat
 0 +     6.00W       -        -    0  0  0  0        0       0
 1 +     2.40W       -        -    1  1  1  1        0       0
 2 +     1.90W       -        -    2  2  2  2        0       0
 3 -   0.0120W       -        -    3  3  3  3     5000   25000
 4 -   0.0060W       -        -    4  4  4  4   100000   70000

Supported LBA Sizes (NSID 0x1)
Id Fmt  Data  Metadt  Rel_Perf
 0 +     512       0         2
 1 -    4096       0         1

=== START OF SMART DATA SECTION ===
SMART overall-health self-assessment test result: PASSED

SMART/Health Information (NVMe Log 0x02)
Critical Warning:                   0x00
Temperature:                        48 Celsius
Available Spare:                    100%
Available Spare Threshold:          50%
Percentage Used:                    15%
Data Units Read:                    27,119,540 [13.8 TB]
Data Units Written:                 33,775,349 [17.2 TB]
Host Read Commands:                 578,530,139
Host Write Commands:                600,174,740
Controller Busy Time:               4,311
Power Cycles:                       1,209
Power On Hours:                     29,088
Unsafe Shutdowns:                   857
Media and Data Integrity Errors:    0
Error Information Log Entries:      0
Warning  Comp. Temperature Time:    0
Critical Comp. Temperature Time:    0
Temperature Sensor 1:               48 Celsius

Error Information (NVMe Log 0x01, 16 of 128 entries)
No Errors Logged

```