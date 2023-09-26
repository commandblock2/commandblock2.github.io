---
title: No more browser crashing because of syscall errors
date: 2023-09-24 22:09:57 +0800
categories: [open-source]
tags: [sys-admin, problem-solving, gdb, gentoo]
---
## Intro

I successfully fix my browser crashing with
```
../../../../qtwebengine-5.15.9_p20230421/src/3rdparty/chromium/sandbox/linux/seccomp-bpf-helpers/sigsys_handlers.cc:**CRASHING**:seccomp-bpf failure in syscall 0441
```
This crash happens in both librewolf(firefox) and qtwebengine(chromium) based browsers, and this problem is only possible to be true for the package maintainer/developers to come across.  
The problem happened after a certain update and it took me a long time to find out.
***
### A little explanation
So for those who doesn't understand what gentoo is, it basically is a linux that have you compile and configure everything. So problems like this might never happen elsewhere.  
The following condition are not met on other distributions, in my installation I have:
- self configured and compiled kernel
- many packages compiled with `-O3` (considered not so safe to do)
- a mixed system that uses stable,unstable and live packages 

live package sources are fetched on the fly and usually from some branch using version control system. 
#### terms & packages to know about 
- qtwebengine: a huge package to compile and takes like more than 2 hour to complete on my cpu.  
- libevent: a very important infrastructure of many network dependent packages (including chromium and firefox).
- gdb: a command-line debugger, but with optional gui-frontend
- ccache: if you use ccache and recompile some source file it will use the cached compiled binary if it can, usually based on file name, compiler version and flags. Some packages are known to not work with ccache like openjdk.

#### what is a syscall?
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

#### Variable Controls and Reference Groups
