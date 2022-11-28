---
title: Migrate to SSD (Homeserver)
date: 2022-11-27 18:14:26 +0800
categories: [self-hosting]
tags: [sys-admin]
---

## Previous
这两天玩mc的时候鞘翅老是飞着飞着地图就加载不出来了， 
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

## Chroot and recompile kernel and udpate fstab

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

肏你妈服务器起不起来了日