---
title: No more browser crashing because of syscall errors
date: 2023-09-24 22:09:57 +0800
categories: [open-source]
tags: [sys-admin, problem-solving, gdb, gentoo]
---
## Intro

I successfully fix my browser crashing with
```
../../../../qtwebengine-5.15.9_p20230421/src/3rdparty/chromium/sandbox/linux/seccomp-bpf-helpers/sigsys_handlers.cc:
**CRASHING**:seccomp-bpf failure in syscall 0441
```
**not by disabling sandbox**.  
This crash happens in both librewolf(firefox) and qtwebengine(chromium) based browsers, and this problem is only possible for the package maintainer/developers to come across.  
The problem happened after a certain update and it took me a long time to resolve.  
This maybe a little bit of misleading because I didn't modify a single line of code of the browsers or patch anything.

***

### A little explanation
So for those who doesn't understand what gentoo is, it basically is a linux that have you compile and configure everything. So problems like this might never happen elsewhere.  
The following condition are not met on other distributions, in my installation I have:
- self configured and compiled kernel
- many packages compiled with `-O3` (considered not so safe to do)
- a mixed system that uses stable,unstable and live packages 

live package sources are fetched on the fly and usually from some branch using version control system.  
Usually disabling aggressive optimization flags workes for me.
#### Terms & packages to know about 
- qtwebengine: a huge package to compile and takes like more than 2 hour to complete on my cpu.  
- libevent: a very important infrastructure of many network dependent packages (including chromium and firefox).
- gdb: a command-line debugger, but with optional gui-frontend
- ccache: if you use ccache and recompile some source file it will use the cached compiled binary if it can, usually based on file name, compiler version and flags. Some packages are known to not work with ccache like openjdk.

#### What is a syscall?
> A system call is just a userspace request of a kernel service. Yes, the operating system kernel provides many services. When your program wants to write to or read from a file, start to listen for connections on a socket, delete or create directory, or even to finish its work, a program uses a system call. In other words, a system call is just a C kernel space function that user space programs call to handle some request.  

From [Introduction to systemcalls](https://0xax.gitbooks.io/linux-insides/content/SysCall/linux-syscall-1.html).

## Investigation  

Alright, now that we know everything that we needs to understand, we can proceed to this section.  
Before continue reading please make your guess.  
- custom kernel lacking some options enabled
- something got wrong during the kernel compiling process (memory fault)
- aggressive compiler options
- corrupted compilers
- something got wrong during the browser compiling process (both browser takes tons of memory to compile or ccache not working properly)
- faulty dependencies of browsers

#### Some experiments before I had a clue  

| Package Name       | Browser                        | Does it crash/hang | Is compiled on my machine |
|--------------------|--------------------------------|--------------------|----------------------------|
| librewolf-bin      | firefox                        | no                 | no                         |
| ungoogled-chromium | chromium                       | no                 | no                         |
| librewolf          | firefox                        | yes                | yes                        |
| falkon             | qtwebengine aka chromium based | yes                | yes                        |
| qute-browser       | qtwebengine aka chromium based | yes                | yes                        |

As you can see that crashed browser is compiled on my machine, consistently, using different browser technology.  So that eliminates nothing previous listed reasons lmao. So I decided to follow the gentoo's debug guide.

## Debugging browsers (demsg/gdb)

Before I do dmesg/gdb, I jumped to the source code where this error is thrown, because I was hoping to see if there is anything around that code, aka `sigsys_handlers.cc`
```cpp
void PrintSyscallError(uint32_t sysno) {
  if (sysno >= 1024)
    sysno = 0;
  // TODO(markus): replace with async-signal safe snprintf when available.
  const size_t kNumDigits = 4;
  char sysno_base10[kNumDigits];
  uint32_t rem = sysno;
  uint32_t mod = 0;
  for (int i = kNumDigits - 1; i >= 0; i--) {
    mod = rem % 10;
    rem /= 10;
    sysno_base10[i] = '0' + mod;
  }

#if defined(ARCH_CPU_MIPS_FAMILY) && defined(ARCH_CPU_32_BITS)
  static const char kSeccompErrorPrefix[] = __FILE__
      ":**CRASHING**:" SECCOMP_MESSAGE_COMMON_CONTENT " in syscall 4000 + ";
#else
  static const char kSeccompErrorPrefix[] =
      __FILE__":**CRASHING**:" SECCOMP_MESSAGE_COMMON_CONTENT " in syscall ";
#endif
  static const char kSeccompErrorPostfix[] = "\n";
  WriteToStdErr(kSeccompErrorPrefix, sizeof(kSeccompErrorPrefix) - 1);
  WriteToStdErr(sysno_base10, sizeof(sysno_base10));
  WriteToStdErr(kSeccompErrorPostfix, sizeof(kSeccompErrorPostfix) - 1);
}
```
This snippet is responsible for printing the error, nothing too valuable is found in this piece of code. But you can still see that
> gpt: The error message you're seeing indicates that there is a problem with a seccomp-bpf syscall (system call number 441) in `sigsys_handlers.cc` file. Seccomp-bpf is a security mechanism in the Linux kernel that restricts the system call usage of a process in order to reduce its attack surface. 


btw everything that gpt spits should be taken with a grin of salt, given that it has been known to give misleading or just plainly wrong results.


but then gpt seems to give a few decent suggestion about this.

1. Check the browser logs: Look for any error messages or warnings that could help identify the source of the problem. These could be in the browser console or in log files in the browser's installation directory.

2. Check system logs: Use `dmesg` to look for any kernel messages related to the crashed process or to the seccomp-bpf mechanism.

3. Look for any known issues: Google the error message and see if others have reported similar issues with the specific version of the browser or operating system you're using. 

4. Rebuild the browser: Try rebuilding the browser from source and see if the issue persists. This could help identify any issues with the compilation process.

5. Disable seccomp-bpf: If all else fails, you could try disabling seccomp-bpf for the browser to see if it resolves the problem. However, it's not recommended to run a browser without seccomp-bpf enabled.

For which I already performed 1/3/4. The problem persists through rebuilds and no other know issues can be founded with search engines.

However, I found that [disabling sandbox](https://wiki.mozilla.org/Security/Sandbox) works for firefox, I don't recall for chromium browsers.

### dmesg
Since its system-call, dmesg is kernel message, which should be working very well.  
By using `dmesg -w` while launching browser, I see such errors.

```
[ 1965.710322] Code: e7 e8 c6 fc ff ff 41 8b 44 24 10 49 8b 54 24 18 bf 01 00 00 00 c1 e0 0c c1 e2 14 25 00 f0 0f 00 81 e2 00 00 f0 0f 09 d0 09 d8 <67> c6 00 00 25 ff 0f 00 00 67 c6 00 00 e8 70 68 05 fd 55 be 91 00
[ 1965.710322] Code: e7 e8 c6 fc ff ff 41 8b 44 24 10 49 8b 54 24 18 bf 01 00 00 00 c1 e0 0c c1 e2 14 25 00 f0 0f 00 81 e2 00 00 f0 0f 09 d0 09 d8 <67> c6 00 00 25 ff 0f 00 00 67 c6 00 00 e8 70 68 05 fd 55 be 91 00
[ 1965.734374] Chrome_ChildIOT[25991]: segfault at 500a1b9 ip 00007f7f3d4cad1e sp 00007f7f330052b0 error 6
[ 1965.734375] ThreadPoolServi[25989]: segfault at 50031b9 ip 00007f7f3d4cad1e sp 00007f7f340072b0 error 6
[ 1965.734380]  in libQt5WebEngineCore.so.5.15.9[7f7f3a51d000+651c000]
[ 1965.734380]  in libQt5WebEngineCore.so.5.15.9[7f7f3a51d000+651c000] likely on CPU 6 (core 0, socket 0)
[ 1965.734382]  likely on CPU 2 (core 2, socket 0)

[ 1965.734384] Code: e7 e8 c6 fc ff ff 41 8b 44 24 10 49 8b 54 24 18 bf 01 00 00 00 c1 e0 0c c1 e2 14 25 00 f0 0f 00 81 e2 00 00 f0 0f 09 d0 09 d8 <67> c6 00 00 25 ff 0f 00 00 67 c6 00 00 e8 70 68 05 fd 55 be 91 00
[ 1965.734385] Code: e7 e8 c6 fc ff ff 41 8b 44 24 10 49 8b 54 24 18 bf 01 00 00 00 c1 e0 0c c1 e2 14 25 00 f0 0f 00 81 e2 00 00 f0 0f 09 d0 09 d8 <67> c6 00 00 25 ff 0f 00 00 67 c6 00 00 e8 70 68 05 fd 55 be 91 00
```

And now that I have learnt how system-calls work, my guess is that these are the arguments of that system-call aka the registers dump probably. But I have yet to verify that point or to see what is actually wr0ng in the registers.

Not knowing what to do I then continued to ask GPT what could I do to debug a browser crash, then it mentioned gdb, and then I recalled that there a dedicated wiki page for users to debug a package installed on system on gentoo wiki.

### Debugging with gdb

With gentoo's package manager `portage`, you can set different compile option for each packages. Not only can you set which option in make/Cmake ... if you want a feature, you are also capable of changing the compiler flags as you wish.  
According to the wiki, to enable debug information for a package you simply need to create 2 files describing what flag/use/portage feature you want to enable. Then 1 more files to specify which package(s) to use that setting.

These lines will enable some useful information for debugging using gdb.  
`/etc/portage/env/debugsyms`
```bash
CFLAGS="${CFLAGS} -ggdb3"
CXXFLAGS="${CXXFLAGS} -ggdb3"
# nostrip is disabled here because it negates splitdebug
FEATURES="${FEATURES} splitdebug compressdebug -nostrip"
```

This will install the source code when you are installing the compiled binary.  
`/etc/portage/env/installsources`
```bash
FEATURES="${FEATURES} installsources"
```

To enable these features I simply add a file  
`/etc/portage/package.env/librewolf`
```bash
www-client/librewolf noccache j8 installsources debugsyms
```

***

To set a breakpoint in gdb to catch system-call you simply do 
```
(gdb) catch syscall 441
Catchpoint 1 (syscall 'epoll_pwait2' [441])
```
The two self compiled browsers gives their stacktrace on syscall 441 respectively, and surprisingly that all of them are in `libevent`(not surprising that epoll_pwait2 is implemented in libc lmao).
```
#0  0x00007ffff7c37f6d in epoll_pwait2 () at /lib64/libc.so.6
#1  0x00007fffeb7a15bf in  () at /usr/lib64/libevent_core-2.2.so.1
#2  0x00007fffeb7967b2 in event_base_loop () at /usr/lib64/libevent_core-2.2.so.1
#3  0x00007ffff0980328 in  () at /usr/lib64/librewolf/libxul.so
#4  0x00007fffefffefcd in  () at /usr/lib64/librewolf/libxul.so
#5  0x00007ffff065f6c4 in  () at /usr/lib64/librewolf/libxul.so
#6  0x00007ffff110a83a in  () at /usr/lib64/librewolf/libxul.so
#7  0x00007ffff7bb804c in  () at /lib64/libc.so.6
#8  0x00007ffff7c37c0c in  () at /lib64/libc.so.6
```
```

Thread 24 "Chrome_IOThread" hit Catchpoint 1 (call to syscall 441), 0x00007ffff6b5df6d in epoll_pwait2 () from /lib64/libc.so.6
(gdb) bt
#0  0x00007ffff6b5df6d in epoll_pwait2 () from /lib64/libc.so.6
#1  0x00007fffec855e8f in ?? () from /usr/lib64/libevent-2.2.so.1
#2  0x00007fffec84b082 in event_base_loop () from /usr/lib64/libevent-2.2.so.1
#3  0x00007ffff149f2d8 in ?? () from /usr/lib64/libQt5WebEngineCore.so.5
#4  0x00017fff88000030 in ?? ()
#5  0x00007fff937fdba8 in ?? ()
#6  0x00007ffff64fcda0 in ?? () from /usr/lib64/libQt5WebEngineCore.so.5
#7  0x00007fff937fdbf0 in ?? ()
#8  0x0000000000000000 in ?? ()
```

From now I started to think it might be `libevent` but there has yet to be any solid proof for that.

```c
(gdb) frame 1
#1  0x00007fffeb7a1480 in epoll_dispatch (base=0x7ffff78b2b00, tv=<optimized out>) at /usr/src/debug/dev-libs/libevent-9999/libevent-9999/epoll.c:517
517             res = epoll_pwait2(epollop->epfd, events, epollop->nevents, tv ? &ts : NULL, NULL);
(gdb) list
507                     }
508     #endif /* EVENT__HAVE_EPOLL_PWAIT2 */
509             }
510
511             epoll_apply_changes(base);
512             event_changelist_remove_all_(&base->changelist, base);
513
514             EVBASE_RELEASE_LOCK(base, th_base_lock);
515
516     #if defined(EVENT__HAVE_EPOLL_PWAIT2)
517             res = epoll_pwait2(epollop->epfd, events, epollop->nevents, tv ? &ts : NULL, NULL);
518     #else /* no epoll_pwait2() */
519             res = epoll_wait(epollop->epfd, events, epollop->nevents, timeout);
520     #endif /* EVENT__HAVE_EPOLL_PWAIT2 */
521
522             EVBASE_ACQUIRE_LOCK(base, th_base_lock);
523
524             if (res == -1) {
525                     if (errno != EINTR) {
526                             event_warn("epoll_wait");
```

Actually by comparing the parameter of epoll_pwait2 when using `librewolf` and `librewolf-bin` I found that there are some difference, but I don't recall which is different. I stopped investigating here and used the binary package for a while.

### Asking for help in gentoo community

I was then [asking if any have seen this error in the gentoo matrix room](https://matrix.to/#/!aZUzMIEZvEwnDquxLf:neko.dev/$HhWfqHoljo1lwsOhqVHh-YYn8Ai4drLs708CVPb_ZtY?via=matrix.org&via=tchncs.de&via=envs.net). And after posting relavent information, some said that `epoll_wait2` is a relatively common system-call, which should be implemented in most cases. And no one seems to have any idea about my problem specificly.


### Eventually
After somedays later I got some freetime and decided to follow the compliation guide of librewolf, to compile it manually without the help of portage, after a while setting up the compiling environment and 1 hour of compiling, it magically starts without a problem.  
That means the only possible error is because I built librewolf with `portage`, gcc/clang is fine, kernel is fine, everything is fine, except for using portage is not fine.  
And with the previous suspection for `libevent`, I looked into the `USE` flags of librewolf.
```emerge
[ebuild   R   ~] www-client/librewolf-117.0_p1:0/117::librewolf  USE="X clang dbus geckodriver gmp-autoupdate 
hardened jumbo-build lto pgo pulseaudio screencast system-av1 system-harfbuzz system-icu system-jpeg 
system-libevent system-libvpx system-webp wayland -debug -eme-free -hwaccel -jack -libproxy -openh264 (-selinux) 
-sndio -system-png (-system-python-libs) -telemetry -valgrind -wifi" L10N="-ach -af -an -ar -ast -az -be -bg -bn 
-br -bs -ca -ca-valencia -cak -cs -cy -da -de -dsb -el -en-CA -en-GB -eo -es-AR -es-CL -es-ES -es-MX -et -eu -fa 
-ff -fi -fr -fur -fy -ga -gd -gl -gn -gu -he -hi -hr -hsb -hu -hy -ia -id -is -it -ja -ka -kab -kk -km -kn -ko 
-lij -lt -lv -mk -mr -ms -my -nb -ne -nl -nn -oc -pa -pl -pt-BR -pt-PT -rm -ro -ru -sc -sco -si -sk -sl -son -sq 
-sr -sv -szl -ta -te -th -tl -tr -trs -uk -ur -uz -vi -xh -zh-CN -zh-TW" 0 KiB
```
Ah what about disabling `system-libevnet`? It works like a charm. And librewolf started working again.  
[After reporting the partial solution](https://matrix.to/#/!aZUzMIEZvEwnDquxLf:neko.dev/$3YpZvoYEhRGomVDbOOy0p31orX_eMyBAu_agKiSVOpo?via=matrix.org&via=tchncs.de&via=envs.net), someone told me that using a `-9999` live package is something that I should be aware of. And switching back to the unstable package(which is a bit more stable than the live version) and re-enabling `system-libevent` finally fixes all browser crashing on my system.

## Further

It's like that there are some problems that I could go dig deeper which I didn't because it is not considered as very interesting or exteremly important.

- Do a diff of the source of the current unstable `libevent` and live package to see what happend.
- To thoughly read the documentation(probably linux system-calls) of `epoll_wait2` and examine if the corresponding registers are correctly set.

Although at the moment I still don't have the idea of why this problem happens, I somehow fixed it and learnt a lot of skill and idk some knowledge.

What I have learnt:
- debugging a package installed by portage
- some basic gdb skills
- where to look if system-call error happens (strace can also be helpful but not mentioned in this post)