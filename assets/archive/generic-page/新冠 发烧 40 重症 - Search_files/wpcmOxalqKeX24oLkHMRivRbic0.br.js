var SydneySpecialAlias;(function(n){function u(){try{if(_w.localStorage){var n="CB47C15FA3044AB884F7E32B9FD32ED2";return _w.localStorage.setItem(n,"1"),_w.localStorage.removeItem(n),_w.localStorage}}catch(t){return undefined}}function f(n){var h=u(),o="",f,s,e;h&&(f=localStorage.getItem(r),s=f&&f.indexOf(";")>=0&&f.slice(f.indexOf(";")+1),s&&(e=JSON.parse(s),e.user&&e.user.userPrincipalName&&(o=e.user.userPrincipalName)));o&&n.indexOf(o)>=0?sj_cook.set(t,i,"1"):sj_cook.get(t,i)&&sj_cook.set(t,i,"0")}function e(n){if(n&&n!=""){var t=n.split(",");f(t)}}var t="SRCHHPGUSR",i="SpecSydAlias",r="MSBLS_bfbLokiToken";n.init=e})(SydneySpecialAlias||(SydneySpecialAlias={}))