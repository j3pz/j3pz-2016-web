(function(){var b=(function(){var i={};var j=[];i.inc=function(l,k){return true};i.register=function(n,l){var p=n.split(".");var o=i;var m=null;while(m=p.shift()){if(p.length){if(o[m]===undefined){o[m]={}}o=o[m]}else{if(o[m]===undefined){try{o[m]=l(i)}catch(q){}}}}};i.regShort=function(k,l){if(i[k]!==undefined){throw"["+k+"] : short : has been register"}i[k]=l};i.IE=/msie/i.test(navigator.userAgent);i.E=function(k){if(typeof k==="string"){return document.getElementById(k)}else{return k}};i.C=function(k){var l;k=k.toUpperCase();if(k=="TEXT"){l=document.createTextNode("")}else{if(k=="BUFFER"){l=document.createDocumentFragment()}else{l=document.createElement(k)}}return l};i.log=function(k){j.push("["+((new Date()).getTime()%100000)+"]: "+k)};i.getErrorLogInformationList=function(k){return j.splice(0,k||j.length)};return i})();$Import=b.inc;b.register("core.evt.addEvent",function(i){return function(j,m,l){var k=i.E(j);if(k==null){return false}m=m||"click";if((typeof l).toLowerCase()!="function"){return}if(k.attachEvent){k.attachEvent("on"+m,l)}else{if(k.addEventListener){k.addEventListener(m,l,false)}else{k["on"+m]=l}}return true}});b.register("core.util.browser",function(p){var i=navigator.userAgent.toLowerCase();var s=window.external||"";var k,l,n,t,o;var j=function(m){var v=0;return parseFloat(m.replace(/\./g,function(){return(v++==1)?"":"."}))};try{if((/windows|win32/i).test(i)){o="windows"}else{if((/macintosh/i).test(i)){o="macintosh"}else{if((/rhino/i).test(i)){o="rhino"}}}if((l=i.match(/applewebkit\/([^\s]*)/))&&l[1]){k="webkit";t=j(l[1])}else{if((l=i.match(/presto\/([\d.]*)/))&&l[1]){k="presto";t=j(l[1])}else{if(l=i.match(/msie\s([^;]*)/)){k="trident";t=1;if((l=i.match(/trident\/([\d.]*)/))&&l[1]){t=j(l[1])}}else{if(/gecko/.test(i)){k="gecko";t=1;if((l=i.match(/rv:([\d.]*)/))&&l[1]){t=j(l[1])}}}}}if(/world/.test(i)){n="world"}else{if(/360se/.test(i)){n="360"}else{if((/maxthon/.test(i))||typeof s.max_version=="number"){n="maxthon"}else{if(/tencenttraveler\s([\d.]*)/.test(i)){n="tt"}else{if(/se\s([\d.]*)/.test(i)){n="sogou"}}}}}}catch(r){}var u=i.indexOf("trident/7.0")!=-1&&(i.indexOf("rv 11.0")!=-1||i.indexOf("rv:11.0")!=-1);var q={OS:o,CORE:k,Version:t,EXTRA:(n?n:false),IE:/msie/.test(i)||u,OPERA:/opera/.test(i),MOZ:/gecko/.test(i)&&!/(compatible|webkit)/.test(i),IE5:/msie 5 /.test(i),IE55:/msie 5.5/.test(i),IE6:/msie 6/.test(i),IE7:/msie 7/.test(i),IE8:/msie 8/.test(i),IE9:/msie 9/.test(i),IE11:u,SAFARI:!/chrome\/([\d.]*)/.test(i)&&/\/([\d.]*) safari/.test(i),CHROME:/chrome\/([\d.]*)/.test(i),IPAD:/\(ipad/i.test(i),IPHONE:/\(iphone/i.test(i),ITOUCH:/\(itouch/i.test(i),MOBILE:/mobile/i.test(i)};return q});function e(j){var i=WB2._config.version,k=WB2.anyWhere._instances;if(document.body){k[i]=c(function(){h(this,j)})}else{setTimeout(function(){e(j)},20)}}function h(m,j){var k,l=m.contentWindow;f(l,j);var i=l.document.createElement("script");i.type="text/javascript";i.src="/js/libs/weibo/client.js?version="+WB2._config.cdn_version;k=l.document.getElementsByTagName("head")[0];if(!k){k=document.createElement("head");l.document.documentElement.appendChild(k)}k.appendChild(i);return i}function a(j,i){return function(){return i.apply(j,arguments)}}function c(i){var j;j=b.C("iframe");j.style.display="none";j.id="sina_anywhere_iframe";var m=a(j,i);b.core.evt.addEvent(j,"load",function(){m()});document.body.insertBefore(j,document.body.firstChild);try{var l=j.contentWindow.document}catch(k){if(b.core.util.browser.IE){j.src="javascript:void((function(){document.open();document.domain='"+document.domain+"';document.close()})())"}}return j}function f(j,i){if(!j._initCallbacks){j._initCallbacks=[]}j._initCallbacks.push(i)}function d(){var k=WB2.Cookie.load();var j=k.expires_in||"";var i=k.secret||WB2._config.secret||"";if(i==""||j==""){return}if(WB2._refreshTimer){clearTimeout(WB2._refreshTimer);delete WB2._refreshTimer}var l=j-10*60;l=l>0?l:0;WB2._refreshTimer=window.setTimeout(function(){g()},l)}function g(l){if(WB2.checkLogin()){l=l||WB2.Cookie.load();var k=l.refresh_token||"";var j=l.secret||WB2._config.secret||"";if(k==""||j==""){return}var m=function(n){WB2.Cookie.save(n);d()};var i={requestType:"refreshtoken",client_id:WB2._config.appkey,client_secret:j,grant_type:"refresh_token",refresh_token:k,callback:m};WB2.regIframeRequest(i)}}setTimeout(function(){d()},100);WB2.delayCall=e;WB2.addToCallbacks=f})();