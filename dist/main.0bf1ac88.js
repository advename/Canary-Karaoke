parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"/DKR":[function(require,module,exports) {
var t=document.querySelector("body");function r(){e()}function e(){fetch("songs/Backstreet%20Boys%20-%20Want%20it%20that%20way/Backstreet%20Boys%20-%20Want%20it%20that%20way.txt").then(function(t){return t.text()}).then(function(t){o(t)})}document.addEventListener("DOMContentLoaded",r);var n={groups:[]};function o(t){var r=t.split("\n"),e={};r.filter(function(t){return 0==t.indexOf("#")}).forEach(function(t){var r=t.substr(1,t.indexOf(":")-1).toLowerCase(),n=t.substr(t.indexOf(":")+1,t.length-t.indexOf(":")).trim();"bpm"==r&&(n=parseInt(n.replace(",","."))),e[r]=n});var o=r.filter(function(t){return 0!=t.indexOf("#")}),u=[];o.forEach(function(t){lineArrayData=t.split(/\s/),filteredLineArrayData=lineArrayData.filter(function(t){return/\S/.test(t)});var r={};"-"!=filteredLineArrayData[0]?(r={type:filteredLineArrayData[0],time:l(e.bpm,filteredLineArrayData[1]),length:l(e.bpm,filteredLineArrayData[2]),tone:parseInt(filteredLineArrayData[3]),word:filteredLineArrayData[4]},u.push(r)):(n.groups.push({group_duration:0,group:u,group_start:0,group_end:0,group_gap_start:0,group_gap_end:0}),u=[])}),(n=Object.assign({},n,e)).groups.forEach(function(t,r){var e=t.group,o=e[e.length-1];if(0==r){var a=n.groups[r+1].group,u=o.time-0,i=(a[0].time-(o.time+o.length))/2,g=u+i+(o.time+o.length-e[0].time),p=o.time+o.length+i;n.groups[r].group_gap_start=u,n.groups[r].group_gap_end=i,n.groups[r].group_duration=g,n.groups[r].group_end=p,n.groups[r].group_start=0}else if(r==n.groups.length-1){var l=n.groups[r-1].group,s=(e[0].time-(l[l.length-1].time+l[l.length-1].length))/2,c=t.group_end-o.time+o.length,f=s+c+(o.time+o.length-e[0].time),d=o.time+o.length+c,h=e[0].time-s;n.groups[r].group_gap_start=s,n.groups[r].group_gap_end=c,n.groups[r].group_duration=f,n.groups[r].group_end=d,n.groups[r].group_start=h}else{var m=n.groups[r-1].group,_=n.groups[r+1].group,v=(e[0].time-(m[m.length-1].time+m[m.length-1].length))/2,y=(_[0].time-(o.time+o.length))/2,b=v+y+(o.time+o.length-e[0].time),x=o.time+o.length+y,D=e[0].time-v;n.groups[r].group_gap_start=v,n.groups[r].group_gap_end=y,n.groups[r].group_duration=b,n.groups[r].group_end=x,n.groups[r].group_start=D}}),console.log(n.groups),a()}function a(){document.createDocumentFragment(),Math.max.apply(Math,n.groups.map(function(t){return t.group_duration}));n.groups.forEach(function(t,r){var e=u(t.group_duration,30,10);p(e,t.group_duration,30,10);var n=t.group_start;t.group.forEach(function(t){if(0==r){var o=t.time,a=t.length,u=300-10*t.tone;i(e,o,a,u)}else{var g=t.time-n,p=t.length,l=300-10*t.tone;i(e,g,p,l)}}),g(e,t.group_duration,t.group)})}function u(t,r,e){var n=document.querySelector("#pitch-track .canvas-container"),o=document.createElement("canvas"),a=o.getContext("2d");return o.className="pitch-group",o.width=t,o.height=r*e,n.appendChild(o),a}function i(t,r,e,n){t.fillStyle="red",t.fillRect(r,n-5,e,10)}function g(t,r,e){var n=[];e.forEach(function(t){n.push(t.word)});var o=n.join(" ");t.fillStyle="blue",t.font="bold 60px Arial",t.fillText(o,r/2-20,70)}function p(t,r,e,n){for(var o=e*n/10,a=0,u=0;u<=10;u++)t.beginPath(),t.moveTo(0,a),t.lineTo(r,a),t.lineWidth=1,t.strokeStyle="#3B4839",t.stroke(),a+=o}function l(t,r){return Math.floor(r/(4*t)*60*1e3)}var s=400,c=1/(s/60),f=60;function d(t){var r=t/c;return Math.floor(r+c/2)}var h=document.querySelector(".right-button"),m=0;function _(){var t=document.querySelector("#pitch-track .canvas-container");m-=100,t.style.left=m+"vw",console.log("Go")}h.addEventListener("click",_);
},{}]},{},["/DKR"], null)
//# sourceMappingURL=main.0bf1ac88.map