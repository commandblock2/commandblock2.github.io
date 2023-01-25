---
title: Bricking One Plus ACE Racing
date: 2023-01-25 20:34:59 +0800
categories: [owned-device, embedded-and-mobile, android-phone]
tags: [android, flashing, major-fuckup, work-in-progress, zh-cn]
---

嘿这不这个 OnePlus ACE Racing到货了，一加这个支持bootloader unlock的名声还是挺出名的，那肯定到手第一件事情必是解了锁往里刷点啥吧，结果没想到，用这个 OnePlus 10 R 印度版的OxygenOS刷进去，诶嘿，黑砖了  
不想看碎碎念的跳到[总结](#总结)

## 详细的事发经过  
拿到的第一件事情，打开 developer，打开usb debugging，oem unlock，非常的熟练+流畅。  
> previous episode: 上次刷机还是在用A/B分区之前，所以刷的时候根本就不知道  

马上就 `adb reboot fastboot` 接着 `fastboot oem unlock`  
嘿，没想到这个client不支持，仔细一看fastboot的help，发现有个 `fastboot flashing unlock`，那我就解锁一下吧  
也不行  
然后就在XDA还有一些中文互联网上翻翻相应的资料，看到有个老哥说不要给 ACE Racing 刷 10 R 的rom，会brick的，我先记下来了  
但是在b站/知乎上看到有人声称成功的给 ACE Racing 刷了机，又听ACE Racing和ACE基本上一样，但其实是patch了已有rom的一个分区刷回去(当时我还以为有能用的rom  
当然确实基本一样但是充电功率不一样  
***
于是呢我就用 Oxygen Downloader 挂着印度的梯子下了一下午的 10 R的OxygenOS([因为常用的梯子被限速了](/posts/fuck-wordpress/))。 
刷之前读明白了[自从A/B分区有了之后]() `adb reboot fastboot` 启到的才是fastboot，`fastboot reboot bootloader`才是原来的fastboot，而且recovery用的内核好像变成了系统的内核  
在`bootloader`下解锁了刷机  
然后先看看分区的状况是啥样的吧   

[跳过巨长无比的输出](#跳过的标签)

```
(bootloader)    off-mode-charge: 1
(bootloader)    slot-retry-count:b: 7
(bootloader)    slot-retry-count:a: 7
(bootloader)    slot-successful:b: no
(bootloader)    slot-successful:a: yes
(bootloader)    slot-unbootable:b: no
(bootloader)    slot-unbootable:a: no
(bootloader)    slot-count: 2
(bootloader)    current-slot: a
(bootloader)    unlocked: yes
(bootloader)    secure: no
(bootloader)    partition-type:userdata: f2fs
(bootloader)    partition-size:userdata: 383aff8000
(bootloader)    has-slot:userdata: no
(bootloader)    partition-type:vbmeta_b: raw
(bootloader)    partition-type:vbmeta_a: raw
(bootloader)    partition-size:vbmeta_b: 800000
(bootloader)    partition-size:vbmeta_a: 800000
(bootloader)    has-slot:vbmeta: yes
(bootloader)    partition-type:super: raw
(bootloader)    partition-size:super: 2e0000000
(bootloader)    has-slot:super: no
(bootloader)    partition-type:md1img_b: raw
(bootloader)    partition-type:md1img_a: raw
(bootloader)    partition-size:md1img_b: c800000
(bootloader)    partition-size:md1img_a: c800000
(bootloader)    has-slot:md1img: yes
(bootloader)    partition-type:dtbo_b: raw
(bootloader)    partition-type:dtbo_a: raw
(bootloader)    partition-size:dtbo_b: 800000
(bootloader)    partition-size:dtbo_a: 800000
(bootloader)    has-slot:dtbo: yes
(bootloader)    partition-type:vendor_boot_b: raw
(bootloader)    partition-type:vendor_boot_a: raw
(bootloader)    partition-size:vendor_boot_b: 4000000
(bootloader)    partition-size:vendor_boot_a: 4000000
(bootloader)    has-slot:vendor_boot: yes
(bootloader)    partition-type:boot_b: raw
(bootloader)    partition-type:boot_a: raw
(bootloader)    partition-size:boot_b: 4000000
(bootloader)    partition-size:boot_a: 4000000
(bootloader)    has-slot:boot: yes
(bootloader)    partition-type:lk_b: raw
(bootloader)    partition-type:lk_a: raw
(bootloader)    partition-size:lk_b: 500000
(bootloader)    partition-size:lk_a: 500000
(bootloader)    has-slot:lk: yes
(bootloader)    is-userspace: no
(bootloader)    serialno: 没有的别看了
(bootloader)    product: k6895v1_64
(bootloader)    max-download-size: 0x4000000
(bootloader)    version-bootloader: k6895v1_64_fbb6716_202211021427
(bootloader)    version: 0.5
```

还有fastbood模式下的

```
(bootloader) cpu-abi:arm64-v8a
(bootloader) snapshot-update-status:none
(bootloader) super-partition-name:super
(bootloader) is-logical:preloader_raw_b:no
(bootloader) is-logical:preloader_raw_a:no
(bootloader) is-logical:sda:no
(bootloader) is-logical:protect1:no
(bootloader) is-logical:ccu_b:no
(bootloader) is-logical:param:no
(bootloader) is-logical:cdt_engineering_a:no
(bootloader) is-logical:oplus_custom:no
(bootloader) is-logical:sspm_b:no
(bootloader) is-logical:frp:no
(bootloader) is-logical:userdata:no
(bootloader) is-logical:ccu_a:no
(bootloader) is-logical:vendor_boot_b:no
(bootloader) is-logical:gpueb_b:no
(bootloader) is-logical:connsys_wifi_b:no
(bootloader) is-logical:pi_img_b:no
(bootloader) is-logical:nvdata:no
(bootloader) is-logical:vbmeta_vendor_b:no
(bootloader) is-logical:logo:no
(bootloader) is-logical:mvpu_algo_b:no
(bootloader) is-logical:tee_a:no
(bootloader) is-logical:spmfw_b:no
(bootloader) is-logical:protect2:no
(bootloader) is-logical:boot_b:no
(bootloader) is-logical:oplusreserve1:no
(bootloader) is-logical:otp:no
(bootloader) is-logical:sspm_a:no
(bootloader) is-logical:persist:no
(bootloader) is-logical:connsys_bt_b:no
(bootloader) is-logical:dram_para:no
(bootloader) is-logical:connsys_wifi_a:no
(bootloader) is-logical:oplusreserve3:no
(bootloader) is-logical:mcf_ota_a:no
(bootloader) is-logical:md1img_b:no
(bootloader) is-logical:scp_b:no
(bootloader) is-logical:pi_img_a:no
(bootloader) is-logical:mcf_ota_b:no
(bootloader) is-logical:nvcfg:no
(bootloader) is-logical:scp_a:no
(bootloader) is-logical:dtbo_b:no
(bootloader) is-logical:vcp_b:no
(bootloader) is-logical:expdb:no
(bootloader) is-logical:audio_dsp_b:no
(bootloader) is-logical:misc:no
(bootloader) is-logical:nvram:no
(bootloader) is-logical:spmfw_a:no
(bootloader) is-logical:oplusreserve5:no
(bootloader) is-logical:boot_para:no
(bootloader) is-logical:mcupm_b:no
(bootloader) is-logical:audio_dsp_a:no
(bootloader) is-logical:tee_b:no
(bootloader) is-logical:dpm_a:no
(bootloader) is-logical:vcp_a:no
(bootloader) is-logical:vbmeta_b:no
(bootloader) is-logical:cdt_engineering_b:no
(bootloader) is-logical:proinfo:no
(bootloader) is-logical:flashinfo:no
(bootloader) is-logical:ocdt:no
(bootloader) is-logical:apusys_a:no
(bootloader) is-logical:vbmeta_system_b:no
(bootloader) is-logical:oplusreserve6:no
(bootloader) is-logical:para:no
(bootloader) is-logical:dpm_b:no
(bootloader) is-logical:apusys_b:no
(bootloader) is-logical:gz_a:no
(bootloader) is-logical:lk_b:no
(bootloader) is-logical:md1img_a:no
(bootloader) is-logical:boot_a:no
(bootloader) is-logical:connsys_bt_a:no
(bootloader) is-logical:vendor_boot_a:no
(bootloader) is-logical:sdc:no
(bootloader) is-logical:sdb:no
(bootloader) is-logical:gz_b:no
(bootloader) is-logical:gpueb_a:no
(bootloader) is-logical:mvpu_algo_a:no
(bootloader) is-logical:lk_a:no
(bootloader) is-logical:dtbo_a:no
(bootloader) is-logical:seccfg:no
(bootloader) is-logical:sec1:no
(bootloader) is-logical:mcupm_a:no
(bootloader) is-logical:oplusreserve2:no
(bootloader) is-logical:metadata:no
(bootloader) is-logical:vbmeta_system_a:no
(bootloader) is-logical:super:no
(bootloader) is-logical:vbmeta_a:no
(bootloader) is-logical:vbmeta_vendor_a:no
(bootloader) is-logical:vendor_a:yes
(bootloader) is-logical:vendor_b:yes
(bootloader) is-logical:system_a:yes
(bootloader) is-logical:system_b:yes
(bootloader) is-logical:system_ext_a:yes
(bootloader) is-logical:system_ext_b:yes
(bootloader) is-logical:product_a:yes
(bootloader) is-logical:product_b:yes
(bootloader) is-logical:odm_a:yes
(bootloader) is-logical:odm_b:yes
(bootloader) is-logical:my_engineering_a:yes
(bootloader) is-logical:my_engineering_b:yes
(bootloader) is-logical:my_product_a:yes
(bootloader) is-logical:my_product_b:yes
(bootloader) is-logical:my_stock_a:yes
(bootloader) is-logical:my_stock_b:yes
(bootloader) is-logical:my_heytap_a:yes
(bootloader) is-logical:my_heytap_b:yes
(bootloader) is-logical:my_company_a:yes
(bootloader) is-logical:my_company_b:yes
(bootloader) is-logical:my_carrier_a:yes
(bootloader) is-logical:my_carrier_b:yes
(bootloader) is-logical:my_region_a:yes
(bootloader) is-logical:my_region_b:yes
(bootloader) is-logical:my_preload_a:yes
(bootloader) is-logical:my_preload_b:yes
(bootloader) is-logical:my_bigball_a:yes
(bootloader) is-logical:my_bigball_b:yes
(bootloader) is-logical:my_manifest_a:yes
(bootloader) is-logical:my_manifest_b:yes
(bootloader) battery-voltage:4
(bootloader) treble-enabled:true
(bootloader) is-userspace:yes
(bootloader) partition-size:preloader_raw_b:0x3FF000
(bootloader) partition-size:preloader_raw_a:0x3FF000
(bootloader) partition-size:protect1:0x800000
(bootloader) partition-size:ccu_b:0x400000
(bootloader) partition-size:param:0x100000
(bootloader) partition-size:cdt_engineering_a:0xD00000
(bootloader) partition-size:oplus_custom:0x100000
(bootloader) partition-size:sspm_b:0x100000
(bootloader) partition-size:frp:0x100000
(bootloader) partition-size:userdata:0x383AFF8000
(bootloader) partition-size:ccu_a:0x400000
(bootloader) partition-size:vendor_boot_b:0x4000000
(bootloader) partition-size:gpueb_b:0x100000
(bootloader) partition-size:connsys_wifi_b:0x800000
(bootloader) partition-size:pi_img_b:0x100000
(bootloader) partition-size:nvdata:0x4000000
(bootloader) partition-size:vbmeta_vendor_b:0x800000
(bootloader) partition-size:logo:0x2000000
(bootloader) partition-size:mvpu_algo_b:0x4000000
(bootloader) partition-size:tee_a:0x500000
(bootloader) partition-size:spmfw_b:0x100000
(bootloader) partition-size:protect2:0x800000
(bootloader) partition-size:boot_b:0x4000000
(bootloader) partition-size:oplusreserve1:0x800000
(bootloader) partition-size:otp:0x3000000
(bootloader) partition-size:sspm_a:0x100000
(bootloader) partition-size:connsys_bt_b:0x800000
(bootloader) partition-size:dram_para:0x1900000
(bootloader) partition-size:connsys_wifi_a:0x800000
(bootloader) partition-size:oplusreserve3:0x4000000
(bootloader) partition-size:mcf_ota_a:0x2000000
(bootloader) partition-size:md1img_b:0xC800000
(bootloader) partition-size:scp_b:0x600000
(bootloader) partition-size:pi_img_a:0x100000
(bootloader) partition-size:mcf_ota_b:0x2000000
(bootloader) partition-size:nvcfg:0x2000000
(bootloader) partition-size:scp_a:0x600000
(bootloader) partition-size:dtbo_b:0x800000
(bootloader) partition-size:vcp_b:0x600000
(bootloader) partition-size:expdb:0x8000000
(bootloader) partition-size:audio_dsp_b:0xC00000
(bootloader) partition-size:misc:0x80000
(bootloader) partition-size:nvram:0x4000000
(bootloader) partition-size:spmfw_a:0x100000
(bootloader) partition-size:oplusreserve5:0x2000000
(bootloader) partition-size:boot_para:0x100000
(bootloader) partition-size:mcupm_b:0x100000
(bootloader) partition-size:audio_dsp_a:0xC00000
(bootloader) partition-size:tee_b:0x500000
(bootloader) partition-size:dpm_a:0x400000
(bootloader) partition-size:vcp_a:0x600000
(bootloader) partition-size:vbmeta_b:0x800000
(bootloader) partition-size:cdt_engineering_b:0xD00000
(bootloader) partition-size:proinfo:0x300000
(bootloader) partition-size:flashinfo:0x1000000
(bootloader) partition-size:ocdt:0x800000
(bootloader) partition-size:apusys_a:0x400000
(bootloader) partition-size:vbmeta_system_b:0x800000
(bootloader) partition-size:oplusreserve6:0x4000000
(bootloader) partition-size:para:0x80000
(bootloader) partition-size:dpm_b:0x400000
(bootloader) partition-size:apusys_b:0x400000
(bootloader) partition-size:gz_a:0x2000000
(bootloader) partition-size:lk_b:0x500000
(bootloader) partition-size:md1img_a:0xC800000
(bootloader) partition-size:boot_a:0x4000000
(bootloader) partition-size:connsys_bt_a:0x800000
(bootloader) partition-size:vendor_boot_a:0x4000000
(bootloader) partition-size:gz_b:0x2000000
(bootloader) partition-size:gpueb_a:0x100000
(bootloader) partition-size:mvpu_algo_a:0x4000000
(bootloader) partition-size:lk_a:0x500000
(bootloader) partition-size:dtbo_a:0x800000
(bootloader) partition-size:seccfg:0x800000
(bootloader) partition-size:sec1:0x200000
(bootloader) partition-size:mcupm_a:0x100000
(bootloader) partition-size:metadata:0x2000000
(bootloader) partition-size:vbmeta_system_a:0x800000
(bootloader) partition-size:super:0x2E0000000
(bootloader) partition-size:vbmeta_a:0x800000
(bootloader) partition-size:vbmeta_vendor_a:0x800000
(bootloader) partition-size:vendor_a:0x43EA1000
(bootloader) partition-size:vendor_b:0x0
(bootloader) partition-size:system_a:0x2D449000
(bootloader) partition-size:system_b:0x0
(bootloader) partition-size:system_ext_a:0x37D98000
(bootloader) partition-size:system_ext_b:0x0
(bootloader) partition-size:product_a:0x25B000
(bootloader) partition-size:product_b:0x0
(bootloader) partition-size:odm_a:0x4536F000
(bootloader) partition-size:odm_b:0x0
(bootloader) partition-size:my_engineering_a:0x52000
(bootloader) partition-size:my_engineering_b:0x0
(bootloader) partition-size:my_product_a:0x12B1B000
(bootloader) partition-size:my_product_b:0x0
(bootloader) partition-size:my_stock_a:0x5EBC0000
(bootloader) partition-size:my_stock_b:0x0
(bootloader) partition-size:my_heytap_a:0x392D9000
(bootloader) partition-size:my_heytap_b:0x0
(bootloader) partition-size:my_company_a:0x52000
(bootloader) partition-size:my_company_b:0x0
(bootloader) partition-size:my_carrier_a:0x52000
(bootloader) partition-size:my_carrier_b:0x0
(bootloader) partition-size:my_region_a:0x299000
(bootloader) partition-size:my_region_b:0x0
(bootloader) partition-size:my_preload_a:0x56B2B000
(bootloader) partition-size:my_preload_b:0x0
(bootloader) partition-size:my_bigball_a:0x2B220000
(bootloader) partition-size:my_bigball_b:0x0
(bootloader) partition-size:my_manifest_a:0x66000
(bootloader) partition-size:my_manifest_b:0x0
(bootloader) version-vndk:31
(bootloader) has-slot:preloader_raw:yes
(bootloader) has-slot:sda:no
(bootloader) has-slot:protect1:no
(bootloader) has-slot:ccu:yes
(bootloader) has-slot:param:no
(bootloader) has-slot:cdt_engineering:yes
(bootloader) has-slot:oplus_custom:no
(bootloader) has-slot:sspm:yes
(bootloader) has-slot:frp:no
(bootloader) has-slot:userdata:no
(bootloader) has-slot:vendor_boot:yes
(bootloader) has-slot:gpueb:yes
(bootloader) has-slot:connsys_wifi:yes
(bootloader) has-slot:pi_img:yes
(bootloader) has-slot:nvdata:no
(bootloader) has-slot:vbmeta_vendor:yes
(bootloader) has-slot:logo:no
(bootloader) has-slot:mvpu_algo:yes
(bootloader) has-slot:tee:yes
(bootloader) has-slot:spmfw:yes
(bootloader) has-slot:protect2:no
(bootloader) has-slot:boot:yes
(bootloader) has-slot:oplusreserve1:no
(bootloader) has-slot:otp:no
(bootloader) has-slot:persist:no
(bootloader) has-slot:connsys_bt:yes
(bootloader) has-slot:dram_para:no
(bootloader) has-slot:oplusreserve3:no
(bootloader) has-slot:mcf_ota:yes
(bootloader) has-slot:md1img:yes
(bootloader) has-slot:scp:yes
(bootloader) has-slot:nvcfg:no
(bootloader) has-slot:dtbo:yes
(bootloader) has-slot:vcp:yes
(bootloader) has-slot:expdb:no
(bootloader) has-slot:audio_dsp:yes
(bootloader) has-slot:misc:no
(bootloader) has-slot:nvram:no
(bootloader) has-slot:oplusreserve5:no
(bootloader) has-slot:boot_para:no
(bootloader) has-slot:mcupm:yes
(bootloader) has-slot:dpm:yes
(bootloader) has-slot:vbmeta:yes
(bootloader) has-slot:proinfo:no
(bootloader) has-slot:flashinfo:no
(bootloader) has-slot:ocdt:no
(bootloader) has-slot:apusys:yes
(bootloader) has-slot:vbmeta_system:yes
(bootloader) has-slot:oplusreserve6:no
(bootloader) has-slot:para:no
(bootloader) has-slot:gz:yes
(bootloader) has-slot:lk:yes
(bootloader) has-slot:sdc:no
(bootloader) has-slot:sdb:no
(bootloader) has-slot:seccfg:no
(bootloader) has-slot:sec1:no
(bootloader) has-slot:oplusreserve2:no
(bootloader) has-slot:metadata:no
(bootloader) has-slot:super:no
(bootloader) has-slot:vendor:yes
(bootloader) has-slot:system:yes
(bootloader) has-slot:system_ext:yes
(bootloader) has-slot:product:yes
(bootloader) has-slot:odm:yes
(bootloader) has-slot:my_engineering:yes
(bootloader) has-slot:my_product:yes
(bootloader) has-slot:my_stock:yes
(bootloader) has-slot:my_heytap:yes
(bootloader) has-slot:my_company:yes
(bootloader) has-slot:my_carrier:yes
(bootloader) has-slot:my_region:yes
(bootloader) has-slot:my_preload:yes
(bootloader) has-slot:my_bigball:yes
(bootloader) has-slot:my_manifest:yes
(bootloader) security-patch-level:2022-09-05
(bootloader) vendor-fingerprint:oplus/ossi/ossi:12/SP1A.210812.016/1667398920921:user/release-keys
(bootloader) hw-revision:0
(bootloader) current-slot:a
(bootloader) serialno:没有的别看了
(bootloader) product:ossi
(bootloader) version-os:12
(bootloader) first-api-level:31
(bootloader) slot-count:2
(bootloader) max-download-size:0x10000000
(bootloader) version:0.4
(bootloader) version-baseband:
(bootloader) secure:yes
(bootloader) dynamic-partition:true
(bootloader) system-fingerprint:oplus/ossi/ossi:12/SP1A.210812.016/1667398920921:user/release-keys
(bootloader) version-bootloader:unknown
(bootloader) unlocked:yes
```

#### 跳过的标签

## 总结

## 各种 Reference
