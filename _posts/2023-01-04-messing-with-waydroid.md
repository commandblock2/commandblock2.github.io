---
title: Messing With Waydroid
date: 2023-01-04 22:19:34 +0800
categories: [open-source, fixing-my-unique-problem-and-report]
tags: [linux-kernel-config, waydroid, extremely-long, en-us, mirror, problem-solving]
---

This post will only be a archive of the 2 github issues I have opened.  
[Getting waydroid to run](https://github.com/waydroid/waydroid/issues/653)  
[Fixing Internet Connection](https://github.com/waydroid/waydroid/issues/667)  

## Getting waydroid to run

**Describe the bug**
Waydroid session started but nothing shows.  
Using X11 + Weston.

**Screenshots**
![Screenshot_20221221_164359](https://user-images.githubusercontent.com/21105626/208859873-e3d7dfac-4cb6-41d0-ae52-26c9faa06b20.png)


**General information (please complete the following information):**
 - Waydroid tools Version 1.3.4
 - Waydroid Images Version
   - system: `lineage-18.1-20221217-VANILLA-waydroid_x86_64-system.zip`
   - vendor: `lineage-18.1-20221217-MAINLINE-waydroid_x86_64-vendor.zip`

**Desktop (please complete the following information):**
 - OS: Gentoo
 - GPU: Nvidia Quadro P600 Mobile / Intel UHD Graphics 630
 - Kernel version: `Linux installgentoo 6.1.0-gentoo #1 SMP PREEMPT_DYNAMIC Mon Dec 19 14:36:07 CST 2022 x86_64 Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz GenuineIntel GNU/Linux`
 - Host mesa version: `media-libs/mesa-22.2.3::gentoo  USE="X gles2 llvm opencl proprietary-codecs vaapi vulkan wayland zstd -d3d9 -debug -gles1 -lm-sensors -osmesa (-selinux) -test -unwind -valgrind -vdpau -vulkan-overlay -xa -xvmc -zink" ABI_X86="(64) -32 (-x32)" CPU_FLAGS_X86="sse2" VIDEO_CARDS="intel -d3d12 (-freedreno) (-lima) -nouveau (-panfrost) -r300 -r600 -radeon -radeonsi (-v3d) (-vc4) -virgl (-vivante) -vmware" `
 - Desktop: KDE Plasma 5.26.4 (X11 + weston)

**Additional context**
What I think might be relevant to the bug in the logcat log

```log
--------- beginning of crash
12-21 08:19:46.867    67   112 F DEBUG   : *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** ***
12-21 08:19:46.867    67   112 F DEBUG   : LineageOS Version: '18.1-20221217-VANILLA-waydroid_x86_64'
12-21 08:19:46.867    67   112 F DEBUG   : Build fingerprint: 'waydroid/lineage_waydroid_x86_64/waydroid_x86_64:11/RQ3A.211001.001/7:userdebug/test-keys'
12-21 08:19:46.867    67   112 F DEBUG   : Revision: '0'
12-21 08:19:46.867    67   112 F DEBUG   : ABI: 'x86_64'
12-21 08:19:46.867    67   112 F DEBUG   : Timestamp: 2022-12-21 08:19:46+0000
12-21 08:19:46.867    67   112 F DEBUG   : pid: 67, tid: 112, name: composer@2.1-se  >>> /vendor/bin/hw/android.hardware.graphics.composer@2.1-service <<<
12-21 08:19:46.867    67   112 F DEBUG   : uid: 1000
12-21 08:19:46.867    67   112 F DEBUG   : signal 6 (SIGABRT), code -1 (SI_QUEUE), fault addr --------
12-21 08:19:46.867    67   112 F DEBUG   :     rax 0000000000000000  rbx 0000000000000043  rcx 00007fe87aae3758  rdx 0000000000000006
12-21 08:19:46.867    67   112 F DEBUG   :     r8  0000000000000000  r9  0000000000000000  r10 00007fe7f98ce8d0  r11 0000000000000246
12-21 08:19:46.867    67   112 F DEBUG   :     r12 00007fe87a42c700  r13 00007fe87a4b2b10  r14 00007fe7f98ce8c8  r15 0000000000000070
12-21 08:19:46.867    67   112 F DEBUG   :     rdi 0000000000000043  rsi 0000000000000070
12-21 08:19:46.867    67   112 F DEBUG   :     rbp 00007fe87a444760  rsp 00007fe7f98ce8b8  rip 00007fe87aae3758
```

and

```log
12-21 08:19:46.873    67   112 F DEBUG   : 
12-21 08:19:46.873    67   112 F DEBUG   : backtrace:
12-21 08:19:46.873    67   112 F DEBUG   :       #00 pc 000000000009d758  /apex/com.android.runtime/lib64/bionic/libc.so (syscall+24) (BuildId: 082396c74061b06f8ce2a645b3a60e84)
12-21 08:19:46.873    67   112 F DEBUG   :       #01 pc 00000000000a06c2  /apex/com.android.runtime/lib64/bionic/libc.so (abort+194) (BuildId: 082396c74061b06f8ce2a645b3a60e84)
12-21 08:19:46.873    67   112 F DEBUG   :       #02 pc 0000000000020324  /vendor/lib64/hw/hwcomposer.waydroid.so (wl_abort+148) (BuildId: 02d0b2ec2135c6dbfd44df40b91943e8)
12-21 08:19:46.873    67   112 F DEBUG   :       #03 pc 000000000001b5f0  /vendor/lib64/hw/hwcomposer.waydroid.so (wl_proxy_marshal_array_constructor_versioned+480) (BuildId: 02d0b2ec2135c6dbfd44df40b91943e8)
12-21 08:19:46.873    67   112 F DEBUG   :       #04 pc 000000000001b776  /vendor/lib64/hw/hwcomposer.waydroid.so (wl_proxy_marshal+310) (BuildId: 02d0b2ec2135c6dbfd44df40b91943e8)
12-21 08:19:46.873    67   112 F DEBUG   :       #05 pc 0000000000012490  /vendor/lib64/hw/hwcomposer.waydroid.so (hwc_set(hwc_composer_device_1*, unsigned long, hwc_display_contents_1**)+17136) (BuildId: 02d0b2ec2135c6dbfd44df40b91943e8)
12-21 08:19:46.873    67   112 F DEBUG   :       #06 pc 0000000000016497  /vendor/lib64/libhwc2on1adapter.so (android::HWC2On1Adapter::setAllDisplays()+135) (BuildId: 9878f0e24aed0bb414bafd52df163c17)
12-21 08:19:46.873    67   112 F DEBUG   :       #07 pc 00000000000162ad  /vendor/lib64/libhwc2on1adapter.so (android::HWC2On1Adapter::Display::present(int*)+61) (BuildId: 9878f0e24aed0bb414bafd52df163c17)
12-21 08:19:46.873    67   112 F DEBUG   :       #08 pc 0000000000009b55  /vendor/bin/hw/android.hardware.graphics.composer@2.1-service (android::hardware::graphics::composer::V2_1::passthrough::detail::HwcHalImpl<android::hardware::graphics::composer::V2_1::hal::ComposerHal>::presentDisplay(unsigned long, int*, std::__1::vector<unsigned long, std::__1::allocator<unsigned long> >*, std::__1::vector<int, std::__1::allocator<int> >*)+53) (BuildId: a32e1de0330563f17ec4838c5c4e28dc)
12-21 08:19:46.873    67   112 F DEBUG   :       #09 pc 0000000000010938  /vendor/bin/hw/android.hardware.graphics.composer@2.1-service (android::hardware::graphics::composer::V2_1::hal::ComposerCommandEngine::executePresentDisplay(unsigned short)+104) (BuildId: a32e1de0330563f17ec4838c5c4e28dc)
12-21 08:19:46.873    67   112 F DEBUG   :       #10 pc 000000000000f919  /vendor/bin/hw/android.hardware.graphics.composer@2.1-service (android::hardware::graphics::composer::V2_1::hal::ComposerCommandEngine::executeCommand(android::hardware::graphics::composer::V2_1::IComposerClient::Command, unsigned short)+217) (BuildId: a32e1de0330563f17ec4838c5c4e28dc)
12-21 08:19:46.873    67   112 F DEBUG   :       #11 pc 000000000000ea32  /vendor/bin/hw/android.hardware.graphics.composer@2.1-service (android::hardware::graphics::composer::V2_1::hal::ComposerCommandEngine::execute(unsigned int, android::hardware::hidl_vec<android::hardware::hidl_handle> const&, bool*, unsigned int*, android::hardware::hidl_vec<android::hardware::hidl_handle>*)+146) (BuildId: a32e1de0330563f17ec4838c5c4e28dc)
12-21 08:19:46.873    67   112 F DEBUG   :       #12 pc 000000000000d297  /vendor/bin/hw/android.hardware.graphics.composer@2.1-service (android::hardware::graphics::composer::V2_1::hal::detail::ComposerClientImpl<android::hardware::graphics::composer::V2_1::IComposerClient, android::hardware::graphics::composer::V2_1::hal::ComposerHal>::executeCommands(unsigned int, android::hardware::hidl_vec<android::hardware::hidl_handle> const&, std::__1::function<void (android::hardware::graphics::composer::V2_1::Error, bool, unsigned int, android::hardware::hidl_vec<android::hardware::hidl_handle> const&)>)+103) (BuildId: a32e1de0330563f17ec4838c5c4e28dc)
12-21 08:19:46.873    67   112 F DEBUG   :       #13 pc 000000000003fb19  /system/lib64/android.hardware.graphics.composer@2.1.so (android::hardware::graphics::composer::V2_1::BnHwComposerClient::_hidl_executeCommands(android::hidl::base::V1_0::BnHwBase*, android::hardware::Parcel const&, android::hardware::Parcel*, std::__1::function<void (android::hardware::Parcel&)>)+601) (BuildId: 8b363e7ab3262d8bca00f7a86ede2e16)
12-21 08:19:46.873    67   112 F DEBUG   :       #14 pc 00000000000408c8  /system/lib64/android.hardware.graphics.composer@2.1.so (android::hardware::graphics::composer::V2_1::BnHwComposerClient::onTransact(unsigned int, android::hardware::Parcel const&, android::hardware::Parcel*, unsigned int, std::__1::function<void (android::hardware::Parcel&)>)+2952) (BuildId: 8b363e7ab3262d8bca00f7a86ede2e16)
12-21 08:19:46.873    67   112 F DEBUG   :       #15 pc 00000000000c70d4  /system/lib64/libhidlbase.so (android::hardware::BHwBinder::transact(unsigned int, android::hardware::Parcel const&, android::hardware::Parcel*, unsigned int, std::__1::function<void (android::hardware::Parcel&)>)+68) (BuildId: e119f67164acc83a3754e81b423d3ca2)
12-21 08:19:46.873    67   112 F DEBUG   :       #16 pc 00000000000cb6f7  /system/lib64/libhidlbase.so (android::hardware::IPCThreadState::getAndExecuteCommand()+1799) (BuildId: e119f67164acc83a3754e81b423d3ca2)
12-21 08:19:46.873    67   112 F DEBUG   :       #17 pc 00000000000cce2d  /system/lib64/libhidlbase.so (android::hardware::IPCThreadState::joinThreadPool(bool)+93) (BuildId: e119f67164acc83a3754e81b423d3ca2)
12-21 08:19:46.873    67   112 F DEBUG   :       #18 pc 00000000000dc5ce  /system/lib64/libhidlbase.so (android::hardware::PoolThread::threadLoop()+30) (BuildId: e119f67164acc83a3754e81b423d3ca2)
12-21 08:19:46.873    67   112 F DEBUG   :       #19 pc 00000000000160f9  /system/lib64/libutils.so (android::Thread::_threadLoop(void*)+313) (BuildId: 0c4c3cd44b8128c649dc5c494577e7e5)
12-21 08:19:46.873    67   112 F DEBUG   :       #20 pc 0000000000015980  /system/lib64/libutils.so (thread_data_t::trampoline(thread_data_t const*)+416) (BuildId: 0c4c3cd44b8128c649dc5c494577e7e5)
12-21 08:19:46.873    67   112 F DEBUG   :       #21 pc 000000000010c7ea  /apex/com.android.runtime/lib64/bionic/libc.so (__pthread_start(void*)+58) (BuildId: 082396c74061b06f8ce2a645b3a60e84)
12-21 08:19:46.873    67   112 F DEBUG   :       #22 pc 00000000000a2577  /apex/com.android.runtime/lib64/bionic/libc.so (__start_thread+55) (BuildId: 082396c74061b06f8ce2a645b3a60e84)
```

also `cat /etc/X11/xorg.conf.d/10-nvidia.conf`
``` 
Section "ServerLayout"
    Identifier "layout"
    Screen 0 "nvidia"
    Inactive "intel"
EndSection

Section "Device"
    Identifier "nvidia"
    Driver "nvidia"
    BusID "01:00:0"
    Option "RegistryDwords" "EnableBrightnessControl=1"
EndSection

Section "Screen"
    Identifier "nvidia"
    Device "nvidia"
    Option "AllowEmptyInitialConfiguration"
EndSection

Section "Device"
    Identifier "intel"
    Driver "modesetting"
EndSection

Section "Screen"
    Identifier "intel"
    Device "intel"
EndSection
```

**Logs (please upload as file)**
 - [Prop file, Possibly expired](https://privatebin.net/?a95c848c6cde1bd3#8JnuzWEVag4aWgcd6ZyYDsBtvCU4syvDLqgT6hpWZS5e)
 - [`waydroid log`, Possibly expired](https://privatebin.net/?fdf2e9026da06baf#CnJkVhd89S1FPdZYxMzuZEuf9KgVG9avcBWavo7EEaK)
 - [`waydroid logcat`, Possibly expired](https://privatebin.net/?d0ba9fdb18756cf8#5Di5Wyn8vUv2M9U4MefJTpKr4L4wzXK4AW7BsVTH3xnb)


***

### Suspecting LXC
```
LXC version 5.0.1
Kernel configuration not found at /proc/config.gz; searching...
Kernel configuration found at /lib/modules/6.1.0-gentoo/build/.config
--- Namespaces ---
Namespaces: enabled
Utsname namespace: enabled
Ipc namespace: enabled
Pid namespace: enabled
User namespace: enabled
Network namespace: enabled

--- Control groups ---
Cgroups: enabled
Cgroup namespace: enabled

Cgroup v1 mount points: 
/sys/fs/cgroup/openrc
/sys/fs/cgroup/cpuset
/sys/fs/cgroup/cpu
/sys/fs/cgroup/cpuacct
/sys/fs/cgroup/blkio
/sys/fs/cgroup/memory
/sys/fs/cgroup/devices
/sys/fs/cgroup/freezer
/sys/fs/cgroup/net_cls
/sys/fs/cgroup/perf_event
/sys/fs/cgroup/net_prio
/sys/fs/cgroup/hugetlb
/sys/fs/cgroup/pids
/sys/fs/cgroup/misc

Cgroup v2 mount points: 
/sys/fs/cgroup/unified

Cgroup v1 systemd controller: missing
Cgroup v1 clone_children flag: enabled
Cgroup device: enabled
Cgroup sched: enabled
Cgroup cpu account: enabled
Cgroup memory controller: enabled
Cgroup cpuset: enabled

--- Misc ---
Veth pair device: enabled, not loaded
Macvlan: enabled, not loaded
Vlan: enabled, not loaded
Bridges: enabled, not loaded
Advanced netfilter: enabled, not loaded
CONFIG_IP_NF_TARGET_MASQUERADE: enabled, not loaded
CONFIG_IP6_NF_TARGET_MASQUERADE: enabled, not loaded
CONFIG_NETFILTER_XT_TARGET_CHECKSUM: enabled, not loaded
CONFIG_NETFILTER_XT_MATCH_COMMENT: enabled, not loaded
FUSE (for use with lxcfs): enabled, not loaded

--- Checkpoint/Restore ---
checkpoint restore: missing
CONFIG_FHANDLE: enabled
CONFIG_EVENTFD: enabled
CONFIG_EPOLL: enabled
CONFIG_UNIX_DIAG: enabled
CONFIG_INET_DIAG: enabled
CONFIG_PACKET_DIAG: enabled
CONFIG_NETLINK_DIAG: enabled
File capabilities: 

Note : Before booting a new kernel, you can check its configuration
usage : CONFIG=/path/to/config /usr/bin/lxc-checkconfig
```

Are these two relevant?
`Cgroup v1 systemd controller: missing` and `checkpoint restore: missing`

**NO**

***

I have finally managed to run waydroid. But it was with `app-emulation/waydroid-1.3.4-r5`, for some reason the github mirror guru has yet to update to r6. And I can see that openrc support was added in the r6.

![Screenshot_20221229_165613](https://user-images.githubusercontent.com/21105626/209928110-4a97f0bd-1c32-4b68-882d-7da4198cd7c4.png)

I removed the xorg config file and it seems to use the mesa(intel) driver, and everything worked fine now (I think the layout is PRIME render offload and the previous I had was Reverse PRIME?), except that the external display from a HDIM port cannot be recognized. 
I wonder if there is a way to force weston and waydroid to use mesa driver?

***

![Screenshot_20221231_210608](https://user-images.githubusercontent.com/21105626/210137753-5e402b46-f099-4f7a-9167-0e7193c37f49.png)
Now I use kwin_wayland instead of weston in a nested session, and it finally works with `kwin_wayland --xwayland konsole`.
It gives following output but is working
```
No backend specified, automatically choosing X11 because DISPLAY is set
kwin_xkbcommon: XKB: couldn't find a Compose file for locale "C.UTF8" (mapped to "C.UTF8")
kf.globalaccel.kglobalacceld: Failed to register service org.kde.kglobalaccel
OpenGL vendor string:                   NVIDIA Corporation
OpenGL renderer string:                 Quadro P600/PCIe/SSE2
OpenGL version string:                  3.1.0 NVIDIA 525.60.13
OpenGL shading language version string: 1.40 NVIDIA via Cg compiler
Driver:                                 NVIDIA
Driver version:                         525.60.13
GPU class:                              Unknown
OpenGL version:                         3.1
GLSL version:                           1.40
Linux kernel version:                   6.1
Requires strict binding:                no
GLSL shaders:                           yes
Texture NPOT support:                   yes
Virtual Machine:                        no
kwin_scene_opengl: Creating the OpenGL rendering failed:  "query surface failed"
kwin_xkbcommon: XKB: inet:323:58: unrecognized keysym "XF86EmojiPicker"
kwin_xkbcommon: XKB: inet:324:58: unrecognized keysym "XF86Dictate"
Failed to initialize glamor, falling back to sw
The XKEYBOARD keymap compiler (xkbcomp) reports:
> Warning:          Unsupported maximum keycode 708, clipping.
>                   X11 cannot support keycodes above 255.
Errors from xkbcomp are not fatal to the X server
kf.xmlgui: Shortcut for action  "" "Show SSH Manager" set with QAction::setShortcut()! Use KActionCollection::setDefaultShortcut(s) instead.
kf.xmlgui: Shortcut for action  "" "Show Quick Commands" set with QAction::setShortcut()! Use KActionCollection::setDefaultShortcut(s) instead.
Module 'org.kde.kwin.decoration' does not contain a module identifier directive - it cannot be protected from external registrations.
```
Not sure why that worked but weston didn't.
Thanks for the previous help guys, and also the awesome ebuild.

## Fixing Internet Connection

**Describe the bug**
No internet connection.

**General information (please complete the following information):**
 - Waydroid tools Version 1.3.4
 - Waydroid Images Version
   - system: `lineage-18.1-20221217-VANILLA-waydroid_x86_64-system.zip`
   - vendor: `lineage-18.1-20221217-MAINLINE-waydroid_x86_64-vendor.zip`

**Desktop (please complete the following information):**
 - OS: Gentoo
 - GPU: Nvidia Quadro P600 Mobile / Intel UHD Graphics 630 (hybrid)
 - Kernel version: `Linux installgentoo 6.1.0-gentoo #1 SMP PREEMPT_DYNAMIC Mon Dec 19 14:36:07 CST 2022 x86_64 Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz GenuineIntel GNU/Linux`
 - Host mesa version: `media-libs/mesa-22.2.3::gentoo  USE="X gles1 gles2 llvm opencl proprietary-codecs vaapi vulkan wayland zink zstd -d3d9 -debug -lm-sensors -osmesa (-selinux) -test -unwind -valgrind -vdpau -vulkan-overlay -xa -xvmc" ABI_X86="(64) -32 (-x32)" CPU_FLAGS_X86="sse2" VIDEO_CARDS="intel -d3d12 (-freedreno) (-lima) -nouveau (-panfrost) -r300 -r600 -radeon -radeonsi (-v3d) (-vc4) -virgl (-vivante) -vmware" `
 - Desktop: KDE Plasma 5.26.4 (X11 + kwin_wayland)

**Logs (please upload as file)**
 - `/var/lib/waydroid/waydroid_base.prop`
```
sys.use_memfd=true
debug.stagefright.ccodec=0
ro.hardware.gralloc=gbm
ro.hardware.egl=mesa
ro.hardware.vulkan=intel
ro.hardware.camera=v4l2
ro.opengles.version=196609
waydroid.system_ota=https://ota.waydro.id/system/lineage/waydroid_x86_64/VANILLA.json
waydroid.vendor_ota=https://ota.waydro.id/vendor/waydroid_x86_64/MAINLINE.json
waydroid.tools_version=1.3.4
ro.vndk.lite=true
```
 - `waydroid log`
```
009587) [11:58:25] % mount /var/lib/waydroid/images/system.img /var/lib/waydroid/rootfs
(009587) [11:58:25] % mount -o remount,ro /var/lib/waydroid/images/system.img /var/lib/waydroid/rootfs
(009587) [11:58:25] % mount /var/lib/waydroid/images/vendor.img /var/lib/waydroid/rootfs/vendor
(009587) [11:58:25] % mount -o remount,ro /var/lib/waydroid/images/vendor.img /var/lib/waydroid/rootfs/vendor
(009587) [11:58:25] % mount -o bind /var/lib/waydroid/waydroid.prop /var/lib/waydroid/rootfs/vendor/waydroid.prop
(009587) [11:58:25] Save config: /var/lib/waydroid/waydroid.cfg
(009587) [11:58:25] % chmod 777 -R /dev/dri
(009587) [11:58:25] % chmod 777 -R /dev/fb0
(009587) [11:58:25] % chmod 777 -R /dev/video1
(009587) [11:58:25] % chmod 777 -R /dev/video0
(009587) [11:58:25] % lxc-start -P /var/lib/waydroid/lxc -F -n waydroid -- /init
(009587) [11:58:25] New background process: pid=9619, output=background
lxc-start: waydroid: ../lxc-5.0.1/src/lxc/utils.c: safe_mount: 1221 No such file or directory - Failed to mount "/dev/ashmem" onto "/var/lib/lxc/rootfs/dev/ashmem"
```
 - `waydroid logcat`
[logcat.txt](https://github.com/waydroid/waydroid/files/10328285/logcat.txt)

**Additional context**
No firewall, no selinux policy, no app armor.
`ip a` in host
```
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 brd 127.255.255.255 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: eno1: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc pfifo_fast state DOWN group default qlen 1000
    link/ether 84:2a:fd:94:cb:3a brd ff:ff:ff:ff:ff:ff
    altname enp0s31f6
3: sit0@NONE: <NOARP> mtu 1480 qdisc noop state DOWN group default qlen 1000
    link/sit 0.0.0.0 brd 0.0.0.0
4: wlo1: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether 6c:6a:77:28:10:e0 brd ff:ff:ff:ff:ff:ff
    altname wlp0s20f3
    inet 192.168.0.108/24 brd 192.168.0.255 scope global dynamic noprefixroute wlo1
       valid_lft 32203sec preferred_lft 32203sec
    inet6 fd6d:2165:73ab::805/128 scope global noprefixroute 
       valid_lft forever preferred_lft forever
    inet6 2408:8207:1868:9040::805/128 scope global dynamic noprefixroute 
       valid_lft 226597sec preferred_lft 140197sec
    inet6 2408:8207:1868:9040:2479:a637:68e5:ea96/64 scope global dynamic noprefixroute 
       valid_lft 226598sec preferred_lft 140198sec
    inet6 fd6d:2165:73ab:0:d9aa:7d12:a2e6:959b/64 scope global noprefixroute 
       valid_lft forever preferred_lft forever
    inet6 fe80::6b37:345d:2e30:d522/64 scope link noprefixroute 
       valid_lft forever preferred_lft forever
5: tinctun0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UNKNOWN group default qlen 1000
    link/ether 52:72:b9:52:d7:b9 brd ff:ff:ff:ff:ff:ff
    inet 192.168.255.1/24 scope global tinctun0
       valid_lft forever preferred_lft forever
    inet6 fe80::5072:b9ff:fe52:d7b9/64 scope link 
       valid_lft forever preferred_lft forever
6: tinctuncb2xyz: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UNKNOWN group default qlen 1000
    link/ether 6a:eb:5e:93:0f:88 brd ff:ff:ff:ff:ff:ff
    inet 10.0.0.3/32 scope global tinctuncb2xyz
       valid_lft forever preferred_lft forever
    inet6 fe80::68eb:5eff:fe93:f88/64 scope link 
       valid_lft forever preferred_lft forever
8: virbr0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default qlen 1000
    link/ether 52:54:00:d1:50:95 brd ff:ff:ff:ff:ff:ff
    inet 192.168.122.1/24 brd 192.168.122.255 scope global virbr0
       valid_lft forever preferred_lft forever
31: lxdbr0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default qlen 1000
    link/ether 00:16:3e:f3:65:34 brd ff:ff:ff:ff:ff:ff
    inet 10.21.71.1/24 scope global lxdbr0
       valid_lft forever preferred_lft forever
    inet6 fd42:38b9:d935:ac4c::1/64 scope global 
       valid_lft forever preferred_lft forever
36: waydroid0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether 00:16:3e:00:00:01 brd ff:ff:ff:ff:ff:ff
    inet 192.168.240.1/24 brd 192.168.240.255 scope global waydroid0
       valid_lft forever preferred_lft forever
    inet6 fe80::216:3eff:fe00:1/64 scope link 
       valid_lft forever preferred_lft forever
38: vethmg2beu@if3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master waydroid0 state UP group default qlen 1000
    link/ether fe:bd:19:c5:e1:5a brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet6 fe80::fcbd:19ff:fec5:e15a/64 scope link 
       valid_lft forever preferred_lft forever
```
`ip a` and `ip r` in waydroid container
```
/system/bin/sh: No controlling tty: open /dev/tty: No such file or directory
/system/bin/sh: warning: won't have full job control
:/ # ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: sit0@NONE: <NOARP> mtu 1480 qdisc noop state DOWN group default qlen 1000
    link/sit 0.0.0.0 brd 0.0.0.0
3: eth0@if38: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether 00:16:3e:f9:d3:03 brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet 192.168.240.112/24 brd 192.168.240.255 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 fe80::f29d:602f:26c3:b476/64 scope link stable-privacy 
       valid_lft forever preferred_lft forever
:/ # ip r
192.168.240.0/24 dev eth0 proto kernel scope link src 192.168.240.112
```
The workaround for https://github.com/waydroid/waydroid/issues/196#issue-1039736351 does not work in my situation.
Resulting this like https://github.com/waydroid/waydroid/issues/432#issue-1290145825, but won't fix after restart (both `/usr/lib/waydroid/data/scripts/waydroid-net.sh restart` and `waydroid container start`).
```
:/ # ip route add default via 192.168.240.1 dev eth0
RTNETLINK answers: Network is unreachable
:/ # ping -c1 192.168.240.1
connect: Network is unreachable
```

***

In the `waydroid logcat` I noticed
```
01-01 03:32:04.456   283   361 D ConnectivityService: NetReassign [10 : null → 100, 15 : null → 100, 12 : null → 100, 16 : null → 100, 1 : null → 100, 9 : null → 100]
01-01 03:32:04.456   283   361 D ConnectivityService: Switching to new default network: NetworkAgentInfo{ ni{[type: Ethernet[], state: CONNECTED/CONNECTED, reason: (unspecified), extra: 00:16:3e:f9:d3:03, failover: false, available: true, roaming: false]}  network{100}  nethandle{432902426637}  lp{{InterfaceName: eth0 LinkAddresses: [ 192.168.240.112/24 ] DnsAddresses: [ /192.168.240.1 ] Domains: null MTU: 0 ServerAddress: /192.168.240.1 TcpBufferSizes: 524288,1048576,3145728,524288,1048576,2097152 Routes: [ fe80::/64 -> :: eth0 mtu 0,192.168.240.0/24 -> 0.0.0.0 eth0 mtu 0,0.0.0.0/0 -> 192.168.240.1 eth0 mtu 0 ]}}  nc{[ Transports: ETHERNET Capabilities: NOT_METERED&INTERNET&NOT_RESTRICTED&TRUSTED&NOT_VPN&NOT_ROAMING&FOREGROUND&NOT_CONGESTED&NOT_SUSPENDED LinkUpBandwidth>=100000Kbps LinkDnBandwidth>=100000Kbps AdministratorUids: [] RequestorUid: -1 RequestorPackageName: null]}  Score{30}  everValidated{false}  lastValidated{false}  created{true} lingering{false} explicitlySelected{false} acceptUnvalidated{false} everCaptivePortalDetected{false} lastCaptivePortalDetected{false} partialConnectivity{false} acceptPartialConnectivity{false} clat{mBaseIface: null, mIface: null, mState: IDLE} }
01-01 03:32:04.458    59    59 E BpfUtils: create PF_KEY socket failed: Address family not supported by protocol
01-01 03:32:04.458    59    59 E TrafficController: map swap synchronize_rcu() ended with failure: Address family not supported by protocol
01-01 03:32:04.459   582   858 D NetworkMonitor/100: PROBE_DNS connectivitycheck.gstatic.com 1ms FAIL in type ADDRCONFIG android.net.DnsResolver$DnsException: android.system.ErrnoException: resNetworkQuery failed: ENONET (Machine is not on the network)
```
Not sure why it has address family not supported by protocol. Maybe it is something with the custom kernel I use.
[kernel config](https://github.com/waydroid/waydroid/files/10328314/config.txt)

Also I have captured some of the packets on `waydroid0` interface.
[waydroid-start-1.pcapng](https://dl.commandblock2.xyz/dl/waydroid-start-1.pcapng)

![Screenshot_20230101_130302](https://user-images.githubusercontent.com/21105626/210161463-fe13fca1-892d-40f6-b9e1-5935cae820b5.png)
The arp seems to be fine, not sure if the mdns one is working

***

### Replying to > waydroid log cut too short

Here is the log with all entries start with  009587, I assume that's relevant to the session mentioned previous.
```
009587) [11:58:25] % modprobe -q ashmem_linux
(009587) [11:58:25] % chmod 666 -R /dev/binder
(009587) [11:58:25] % chmod 666 -R /dev/vndbinder
(009587) [11:58:25] % chmod 666 -R /dev/hwbinder
(009587) [11:58:25] Container manager is waiting for session to load
(009587) [11:58:25] % /usr/lib/waydroid/data/scripts/waydroid-net.sh start
vnic is waydroid0
waydroid-net is already running
(009587) [11:58:25] % umount /var/lib/waydroid/rootfs/vendor/waydroid.prop
(009587) [11:58:25] % umount /var/lib/waydroid/rootfs/vendor
(009587) [11:58:25] % umount /var/lib/waydroid/rootfs
(009587) [11:58:25] % mount /var/lib/waydroid/images/system.img /var/lib/waydroid/rootfs
(009587) [11:58:25] % mount -o remount,ro /var/lib/waydroid/images/system.img /var/lib/waydroid/rootfs
(009587) [11:58:25] % mount /var/lib/waydroid/images/vendor.img /var/lib/waydroid/rootfs/vendor
(009587) [11:58:25] % mount -o remount,ro /var/lib/waydroid/images/vendor.img /var/lib/waydroid/rootfs/vendor
(009587) [11:58:25] % mount -o bind /var/lib/waydroid/waydroid.prop /var/lib/waydroid/rootfs/vendor/waydroid.prop
(009587) [11:58:25] Save config: /var/lib/waydroid/waydroid.cfg
(009587) [11:58:25] % chmod 777 -R /dev/dri
(009587) [11:58:25] % chmod 777 -R /dev/fb0
(009587) [11:58:25] % chmod 777 -R /dev/video1
(009587) [11:58:25] % chmod 777 -R /dev/video0
(009587) [11:58:25] % lxc-start -P /var/lib/waydroid/lxc -F -n waydroid -- /init
(009587) [11:58:25] New background process: pid=9619, output=background
lxc-start: waydroid: ../lxc-5.0.1/src/lxc/utils.c: safe_mount: 1221 No such file or directory - Failed to mount "/dev/ashmem" onto "/var/lib/lxc/rootfs/dev/ashmem"
(009587) [11:58:25] Save session config: /var/lib/waydroid/session.cfg
(012070) [12:00:01] WayDroid container is RUNNING
(013905) [12:05:01] WayDroid container is RUNNING
(015625) [12:10:01] WayDroid container is RUNNING
(017329) [12:15:01] WayDroid container is RUNNING
(019896) [12:20:01] WayDroid container is RUNNING
(020153) [12:20:42] % tail -n 60 -F /var/lib/waydroid/waydroid.log
(020153) [12:20:42] *** output passed to waydroid stdout, not to this log ***
(023332) [12:25:02] WayDroid container is RUNNING
(026013) [12:30:02] WayDroid container is RUNNING
(027668) [12:35:02] WayDroid container is RUNNING
(029454) [12:40:01] WayDroid container is RUNNING
(031156) [12:45:01] WayDroid container is RUNNING
(000548) [12:50:01] WayDroid container is RUNNING
(002326) [12:55:01] WayDroid container is RUNNING
(004406) [13:00:01] WayDroid container is RUNNING
(009587) [13:01:35] % lxc-stop -P /var/lib/waydroid/lxc -n waydroid -k
lxc-start: waydroid: ../lxc-5.0.1/src/lxc/conf.c: run_buffer: 321 Script exited with status 126
lxc-start: waydroid: ../lxc-5.0.1/src/lxc/start.c: lxc_end: 985 Failed to run lxc.hook.post-stop for container "waydroid"
(009587) [13:01:35] Save session config: /var/lib/waydroid/session.cfg
(009587) [13:01:35] % /usr/lib/waydroid/data/scripts/waydroid-net.sh stop
vnic is waydroid0
(009587) [13:01:35] % umount /var/lib/waydroid/rootfs/vendor/waydroid.prop
(009587) [13:01:35] % umount /var/lib/waydroid/rootfs/vendor
(009587) [13:01:35] % umount /var/lib/waydroid/rootfs
(009587) [13:01:35] % umount /var/lib/waydroid/data
```
 After that one I had a few more reboot on the host and still has the problem, here is the log of a fresh new start, obtained by `/var/lib/waydroid/waydroid.log`.
```
(006882) [00:57:46] % modprobe -q ashmem_linux
(006882) [00:57:46] % chmod 666 -R /dev/binder
(006882) [00:57:46] % chmod 666 -R /dev/vndbinder
(006882) [00:57:46] % chmod 666 -R /dev/hwbinder
(006882) [00:57:46] Container manager is waiting for session to load
(006882) [00:57:46] % /usr/lib/waydroid/data/scripts/waydroid-net.sh start
vnic is waydroid0
(006882) [00:57:46] % mount /var/lib/waydroid/images/system.img /var/lib/waydroid/rootfs
(006882) [00:57:46] % mount -o remount,ro /var/lib/waydroid/images/system.img /var/lib/waydroid/rootfs
(006882) [00:57:46] % mount /var/lib/waydroid/images/vendor.img /var/lib/waydroid/rootfs/vendor
(006882) [00:57:46] % mount -o remount,ro /var/lib/waydroid/images/vendor.img /var/lib/waydroid/rootfs/vendor
(006882) [00:57:46] % mount -o bind /var/lib/waydroid/waydroid.prop /var/lib/waydroid/rootfs/vendor/waydroid.prop
(006882) [00:57:46] Save config: /var/lib/waydroid/waydroid.cfg
(006882) [00:57:46] % mount -o bind /home/commandblock2/.local/share/waydroid/data /var/lib/waydroid/data
(006882) [00:57:46] % chmod 777 -R /dev/dri
(006882) [00:57:46] % chmod 777 -R /dev/fb0
(006882) [00:57:46] % chmod 777 -R /dev/video1
(006882) [00:57:46] % chmod 777 -R /dev/video0
(006882) [00:57:46] % lxc-start -P /var/lib/waydroid/lxc -F -n waydroid -- /init
(006882) [00:57:46] New background process: pid=6948, output=background
lxc-start: waydroid: ../lxc-5.0.1/src/lxc/utils.c: safe_mount: 1221 No such file or directory - Failed to mount "/dev/ashmem" onto "/var/lib/lxc/rootfs/dev/ashmem"
(006882) [00:57:46] Save session config: /var/lib/waydroid/session.cfg
(010407) [01:00:02] WayDroid container is RUNNING
(011100) [01:01:58] % lxc-stop -P /var/lib/waydroid/lxc -n waydroid -k
lxc-start: waydroid: ../lxc-5.0.1/src/lxc/conf.c: run_buffer: 321 Script exited with status 126
lxc-start: waydroid: ../lxc-5.0.1/src/lxc/start.c: lxc_end: 985 Failed to run lxc.hook.post-stop for container "waydroid"
(011100) [01:01:58] Save session config: /var/lib/waydroid/session.cfg
(011100) [01:01:58] % /usr/lib/waydroid/data/scripts/waydroid-net.sh stop
vnic is waydroid0
(011100) [01:01:58] % umount /var/lib/waydroid/rootfs/vendor/waydroid.prop
(011100) [01:01:58] % umount /var/lib/waydroid/rootfs/vendor
(011100) [01:01:58] % umount /var/lib/waydroid/rootfs
(011100) [01:01:58] % umount /var/lib/waydroid/data
```
I don't see much wrong with this log, nothing complaining about the network here.

`lxc-start: waydroid: ../lxc-5.0.1/src/lxc/utils.c: safe_mount: 1221 No such file or directory - Failed to mount "/dev/ashmem" onto "/var/lib/lxc/rootfs/dev/ashmem"` 
but I read that ashmem is replaced by memfd, and 
for `lxc-start: waydroid: ../lxc-5.0.1/src/lxc/start.c: lxc_end: 985 Failed to run lxc.hook.post-stop for container "waydroid"` I only see `lxc.hook.post-stop = /dev/null` in the `/var/lib/waydroid/lxc/waydroid/config`, which should be reasonable

I can still see there are 2 interfaces goes UP when waydroid starts, in the previous `ip a`
```
36: waydroid0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether 00:16:3e:00:00:01 brd ff:ff:ff:ff:ff:ff
    inet 192.168.240.1/24 brd 192.168.240.255 scope global waydroid0
       valid_lft forever preferred_lft forever
    inet6 fe80::216:3eff:fe00:1/64 scope link 
       valid_lft forever preferred_lft forever
38: vethmg2beu@if3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master waydroid0 state UP group default qlen 1000
    link/ether fe:bd:19:c5:e1:5a brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet6 fe80::fcbd:19ff:fec5:e15a/64 scope link 
       valid_lft forever preferred_lft forever
```
the `vethmg2beu` doesn't have a ipv4 address though, is that possibly related to the problem?

***

Here is the log with all entries start with  009587, I assume that's relevant to the session mentioned previous.
```
009587) [11:58:25] % modprobe -q ashmem_linux
(009587) [11:58:25] % chmod 666 -R /dev/binder
(009587) [11:58:25] % chmod 666 -R /dev/vndbinder
(009587) [11:58:25] % chmod 666 -R /dev/hwbinder
(009587) [11:58:25] Container manager is waiting for session to load
(009587) [11:58:25] % /usr/lib/waydroid/data/scripts/waydroid-net.sh start
vnic is waydroid0
waydroid-net is already running
(009587) [11:58:25] % umount /var/lib/waydroid/rootfs/vendor/waydroid.prop
(009587) [11:58:25] % umount /var/lib/waydroid/rootfs/vendor
(009587) [11:58:25] % umount /var/lib/waydroid/rootfs
(009587) [11:58:25] % mount /var/lib/waydroid/images/system.img /var/lib/waydroid/rootfs
(009587) [11:58:25] % mount -o remount,ro /var/lib/waydroid/images/system.img /var/lib/waydroid/rootfs
(009587) [11:58:25] % mount /var/lib/waydroid/images/vendor.img /var/lib/waydroid/rootfs/vendor
(009587) [11:58:25] % mount -o remount,ro /var/lib/waydroid/images/vendor.img /var/lib/waydroid/rootfs/vendor
(009587) [11:58:25] % mount -o bind /var/lib/waydroid/waydroid.prop /var/lib/waydroid/rootfs/vendor/waydroid.prop
(009587) [11:58:25] Save config: /var/lib/waydroid/waydroid.cfg
(009587) [11:58:25] % chmod 777 -R /dev/dri
(009587) [11:58:25] % chmod 777 -R /dev/fb0
(009587) [11:58:25] % chmod 777 -R /dev/video1
(009587) [11:58:25] % chmod 777 -R /dev/video0
(009587) [11:58:25] % lxc-start -P /var/lib/waydroid/lxc -F -n waydroid -- /init
(009587) [11:58:25] New background process: pid=9619, output=background
lxc-start: waydroid: ../lxc-5.0.1/src/lxc/utils.c: safe_mount: 1221 No such file or directory - Failed to mount "/dev/ashmem" onto "/var/lib/lxc/rootfs/dev/ashmem"
(009587) [11:58:25] Save session config: /var/lib/waydroid/session.cfg
(012070) [12:00:01] WayDroid container is RUNNING
(013905) [12:05:01] WayDroid container is RUNNING
(015625) [12:10:01] WayDroid container is RUNNING
(017329) [12:15:01] WayDroid container is RUNNING
(019896) [12:20:01] WayDroid container is RUNNING
(020153) [12:20:42] % tail -n 60 -F /var/lib/waydroid/waydroid.log
(020153) [12:20:42] *** output passed to waydroid stdout, not to this log ***
(023332) [12:25:02] WayDroid container is RUNNING
(026013) [12:30:02] WayDroid container is RUNNING
(027668) [12:35:02] WayDroid container is RUNNING
(029454) [12:40:01] WayDroid container is RUNNING
(031156) [12:45:01] WayDroid container is RUNNING
(000548) [12:50:01] WayDroid container is RUNNING
(002326) [12:55:01] WayDroid container is RUNNING
(004406) [13:00:01] WayDroid container is RUNNING
(009587) [13:01:35] % lxc-stop -P /var/lib/waydroid/lxc -n waydroid -k
lxc-start: waydroid: ../lxc-5.0.1/src/lxc/conf.c: run_buffer: 321 Script exited with status 126
lxc-start: waydroid: ../lxc-5.0.1/src/lxc/start.c: lxc_end: 985 Failed to run lxc.hook.post-stop for container "waydroid"
(009587) [13:01:35] Save session config: /var/lib/waydroid/session.cfg
(009587) [13:01:35] % /usr/lib/waydroid/data/scripts/waydroid-net.sh stop
vnic is waydroid0
(009587) [13:01:35] % umount /var/lib/waydroid/rootfs/vendor/waydroid.prop
(009587) [13:01:35] % umount /var/lib/waydroid/rootfs/vendor
(009587) [13:01:35] % umount /var/lib/waydroid/rootfs
(009587) [13:01:35] % umount /var/lib/waydroid/data
```
 After that one I had a few more reboot on the host and still has the problem, here is the log of a fresh new start, obtained by `/var/lib/waydroid/waydroid.log`.
```
(006882) [00:57:46] % modprobe -q ashmem_linux
(006882) [00:57:46] % chmod 666 -R /dev/binder
(006882) [00:57:46] % chmod 666 -R /dev/vndbinder
(006882) [00:57:46] % chmod 666 -R /dev/hwbinder
(006882) [00:57:46] Container manager is waiting for session to load
(006882) [00:57:46] % /usr/lib/waydroid/data/scripts/waydroid-net.sh start
vnic is waydroid0
(006882) [00:57:46] % mount /var/lib/waydroid/images/system.img /var/lib/waydroid/rootfs
(006882) [00:57:46] % mount -o remount,ro /var/lib/waydroid/images/system.img /var/lib/waydroid/rootfs
(006882) [00:57:46] % mount /var/lib/waydroid/images/vendor.img /var/lib/waydroid/rootfs/vendor
(006882) [00:57:46] % mount -o remount,ro /var/lib/waydroid/images/vendor.img /var/lib/waydroid/rootfs/vendor
(006882) [00:57:46] % mount -o bind /var/lib/waydroid/waydroid.prop /var/lib/waydroid/rootfs/vendor/waydroid.prop
(006882) [00:57:46] Save config: /var/lib/waydroid/waydroid.cfg
(006882) [00:57:46] % mount -o bind /home/commandblock2/.local/share/waydroid/data /var/lib/waydroid/data
(006882) [00:57:46] % chmod 777 -R /dev/dri
(006882) [00:57:46] % chmod 777 -R /dev/fb0
(006882) [00:57:46] % chmod 777 -R /dev/video1
(006882) [00:57:46] % chmod 777 -R /dev/video0
(006882) [00:57:46] % lxc-start -P /var/lib/waydroid/lxc -F -n waydroid -- /init
(006882) [00:57:46] New background process: pid=6948, output=background
lxc-start: waydroid: ../lxc-5.0.1/src/lxc/utils.c: safe_mount: 1221 No such file or directory - Failed to mount "/dev/ashmem" onto "/var/lib/lxc/rootfs/dev/ashmem"
(006882) [00:57:46] Save session config: /var/lib/waydroid/session.cfg
(010407) [01:00:02] WayDroid container is RUNNING
(011100) [01:01:58] % lxc-stop -P /var/lib/waydroid/lxc -n waydroid -k
lxc-start: waydroid: ../lxc-5.0.1/src/lxc/conf.c: run_buffer: 321 Script exited with status 126
lxc-start: waydroid: ../lxc-5.0.1/src/lxc/start.c: lxc_end: 985 Failed to run lxc.hook.post-stop for container "waydroid"
(011100) [01:01:58] Save session config: /var/lib/waydroid/session.cfg
(011100) [01:01:58] % /usr/lib/waydroid/data/scripts/waydroid-net.sh stop
vnic is waydroid0
(011100) [01:01:58] % umount /var/lib/waydroid/rootfs/vendor/waydroid.prop
(011100) [01:01:58] % umount /var/lib/waydroid/rootfs/vendor
(011100) [01:01:58] % umount /var/lib/waydroid/rootfs
(011100) [01:01:58] % umount /var/lib/waydroid/data
```
I don't see much wrong with this log, nothing complaining about the network here.

`lxc-start: waydroid: ../lxc-5.0.1/src/lxc/utils.c: safe_mount: 1221 No such file or directory - Failed to mount "/dev/ashmem" onto "/var/lib/lxc/rootfs/dev/ashmem"` 
but I read that ashmem is replaced by memfd, and 
for `lxc-start: waydroid: ../lxc-5.0.1/src/lxc/start.c: lxc_end: 985 Failed to run lxc.hook.post-stop for container "waydroid"` I only see `lxc.hook.post-stop = /dev/null` in the `/var/lib/waydroid/lxc/waydroid/config`, which should be reasonable

I can still see there are 2 interfaces goes UP when waydroid starts, in the previous `ip a`
```
36: waydroid0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether 00:16:3e:00:00:01 brd ff:ff:ff:ff:ff:ff
    inet 192.168.240.1/24 brd 192.168.240.255 scope global waydroid0
       valid_lft forever preferred_lft forever
    inet6 fe80::216:3eff:fe00:1/64 scope link 
       valid_lft forever preferred_lft forever
38: vethmg2beu@if3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master waydroid0 state UP group default qlen 1000
    link/ether fe:bd:19:c5:e1:5a brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet6 fe80::fcbd:19ff:fec5:e15a/64 scope link 
       valid_lft forever preferred_lft forever
```
the `vethmg2beu` doesn't have a ipv4 address though, is that possibly related to the problem?

***

Just stumbled on this article about how to do a kernel networking test, https://source.android.com/docs/core/architecture/kernel/network_tests. In the tests, it failed one and give following output.
**It turned out the custom kernel is very much likely to be the problem.**
```
##### ./pf_key_test.py (12/25)

F
======================================================================
FAIL: testAddDelSa (__main__.PfKeyTest)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "/host/home/commandblock2/git_repo/tests/net/test/./pf_key_test.py", line 108, in testAddDelSa
    self.assertFalse("missing b8a72fd7c4e9 ANDROID: net: xfrm: make PF_KEY SHA256 use RFC-compliant truncation.")
AssertionError: 'missing b8a72fd7c4e9 ANDROID: net: xfrm: make PF_KEY SHA256 use RFC-compliant truncation.' is not false

----------------------------------------------------------------------
Ran 1 test in 0.016s

FAILED (failures=1)
F
======================================================================
FAIL: testAddDelSa (__main__.PfKeyTest)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "/host/home/commandblock2/git_repo/tests/net/test/./pf_key_test.py", line 108, in testAddDelSa
    self.assertFalse("missing b8a72fd7c4e9 ANDROID: net: xfrm: make PF_KEY SHA256 use RFC-compliant truncation.")
AssertionError: 'missing b8a72fd7c4e9 ANDROID: net: xfrm: make PF_KEY SHA256 use RFC-compliant truncation.' is not false

----------------------------------------------------------------------
Ran 1 test in 0.008s

FAILED (failures=1)
'./pf_key_test.py' failed more than once, giving up
```
which unsurprisingly correspond to 
```
01-01 03:32:04.456   283   361 D ConnectivityService: NetReassign [10 : null → 100, 15 : null → 100, 12 : null → 100, 16 : null → 100, 1 : null → 100, 9 : null → 100]
01-01 03:32:04.456   283   361 D ConnectivityService: Switching to new default network: NetworkAgentInfo{ ni{[type: Ethernet[], state: CONNECTED/CONNECTED, reason: (unspecified), extra: 00:16:3e:f9:d3:03, failover: false, available: true, roaming: false]}  network{100}  nethandle{432902426637}  lp{{InterfaceName: eth0 LinkAddresses: [ 192.168.240.112/24 ] DnsAddresses: [ /192.168.240.1 ] Domains: null MTU: 0 ServerAddress: /192.168.240.1 TcpBufferSizes: 524288,1048576,3145728,524288,1048576,2097152 Routes: [ fe80::/64 -> :: eth0 mtu 0,192.168.240.0/24 -> 0.0.0.0 eth0 mtu 0,0.0.0.0/0 -> 192.168.240.1 eth0 mtu 0 ]}}  nc{[ Transports: ETHERNET Capabilities: NOT_METERED&INTERNET&NOT_RESTRICTED&TRUSTED&NOT_VPN&NOT_ROAMING&FOREGROUND&NOT_CONGESTED&NOT_SUSPENDED LinkUpBandwidth>=100000Kbps LinkDnBandwidth>=100000Kbps AdministratorUids: [] RequestorUid: -1 RequestorPackageName: null]}  Score{30}  everValidated{false}  lastValidated{false}  created{true} lingering{false} explicitlySelected{false} acceptUnvalidated{false} everCaptivePortalDetected{false} lastCaptivePortalDetected{false} partialConnectivity{false} acceptPartialConnectivity{false} clat{mBaseIface: null, mIface: null, mState: IDLE} }
01-01 03:32:04.458    59    59 E BpfUtils: create PF_KEY socket failed: Address family not supported by protocol
01-01 03:32:04.458    59    59 E TrafficController: map swap synchronize_rcu() ended with failure: Address family not supported by protocol
01-01 03:32:04.459   582   858 D NetworkMonitor/100: PROBE_DNS connectivitycheck.gstatic.com 1ms FAIL in type ADDRCONFIG android.net.DnsResolver$DnsException: android.system.ErrnoException: resNetworkQuery failed: ENONET (Machine is not on the network)
```
but I do not have a solution nor any idea at the moment, will update once I have more progress.

***

enabled `CONFIG_NET_KEY=y` but it is still not working, the `BpfUtils` stopped complaining though, it might be 
```
01-03 07:06:31.862    59   126 E Netd    : Error adding IPv6 rule: Address family not supported by protocol
01-03 07:06:31.862    59   126 E Netd    : failed to add interface eth0 to netId 100
```

***

enabled a bunch of options in kernel (mainly ipv6 related), not sure which is responsible. and everything worked
```
19d118
< CONFIG_USERMODE_DRIVER=y
980d978
< CONFIG_WANT_COMPAT_NETLINK_MESSAGES=y
995,997c993
< CONFIG_TLS=y
< CONFIG_TLS_DEVICE=y
< # CONFIG_TLS_TOE is not set
---
> # CONFIG_TLS is not set
999d994
< CONFIG_XFRM_OFFLOAD=y
1002,1006c997,1001
< CONFIG_XFRM_USER_COMPAT=y
< CONFIG_XFRM_INTERFACE=y
< CONFIG_XFRM_SUB_POLICY=y
< CONFIG_XFRM_MIGRATE=y
< CONFIG_XFRM_STATISTICS=y
---
> # CONFIG_XFRM_USER_COMPAT is not set
> # CONFIG_XFRM_INTERFACE is not set
> # CONFIG_XFRM_SUB_POLICY is not set
> # CONFIG_XFRM_MIGRATE is not set
> # CONFIG_XFRM_STATISTICS is not set
1009,1012c1004
< CONFIG_XFRM_IPCOMP=y
< CONFIG_NET_KEY=y
< CONFIG_NET_KEY_MIGRATE=y
< CONFIG_XFRM_ESPINTCP=y
---
> # CONFIG_NET_KEY is not set
1025c1017
< CONFIG_NET_IPIP=y
---
> # CONFIG_NET_IPIP is not set
1034c1026
< CONFIG_NET_IPVTI=y
---
> # CONFIG_NET_IPVTI is not set
1071c1063
< CONFIG_IPV6_OPTIMISTIC_DAD=y
---
> # CONFIG_IPV6_OPTIMISTIC_DAD is not set
1074,1076c1066,1068
< CONFIG_INET6_ESP_OFFLOAD=y
< CONFIG_INET6_ESPINTCP=y
< CONFIG_INET6_IPCOMP=y
---
> # CONFIG_INET6_ESP_OFFLOAD is not set
> # CONFIG_INET6_ESPINTCP is not set
> # CONFIG_INET6_IPCOMP is not set
1079,1081c1071
< CONFIG_INET6_XFRM_TUNNEL=y
< CONFIG_INET6_TUNNEL=y
< CONFIG_IPV6_VTI=y
---
> # CONFIG_IPV6_VTI is not set
1085,1090c1075,1077
< CONFIG_IPV6_TUNNEL=y
< CONFIG_IPV6_MULTIPLE_TABLES=y
< CONFIG_IPV6_SUBTREES=y
< CONFIG_IPV6_MROUTE=y
< # CONFIG_IPV6_MROUTE_MULTIPLE_TABLES is not set
< # CONFIG_IPV6_PIMSM_V2 is not set
---
> # CONFIG_IPV6_TUNNEL is not set
> # CONFIG_IPV6_MULTIPLE_TABLES is not set
> # CONFIG_IPV6_MROUTE is not set
1397,1398c1384
< CONFIG_BPFILTER=y
< CONFIG_BPFILTER_UMH=y
---
> # CONFIG_BPFILTER is not set
1594d1579
< CONFIG_STREAM_PARSER=y
1641d1625
< CONFIG_SOCK_VALIDATE_XMIT=y
2161d2144
< # CONFIG_NET_VRF is not set
5468c5451
< CONFIG_CRYPTO_DEFLATE=y
---
> # CONFIG_CRYPTO_DEFLATE is not set

```