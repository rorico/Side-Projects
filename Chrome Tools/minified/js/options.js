chrome.runtime.getBackgroundPage(function(t){function e(t){s=t.maxLevel;for(var e="",r=0;r<=s;r++){var n=s===r?" selected":"";e+="<option value='"+r+"'"+n+">"+r+"</option>"}$("#nameLevel").html(e).off("change").change(function(){s=parseInt(this.value),a(t)}),t.data?a(t):l(t.name,function(e){var r=[];Object.keys(e).sort().forEach(function(t){r=r.concat(e[t])}),t.data=r,a(t)})}function a(t){var e=t.processData(t.data,s);r(e.series,e.zoom,e.options)}function r(t,e,a){if(t){var r={chart:{renderTo:"highcharts",zoomType:"x",type:"column"},xAxis:{type:"datetime"},series:t,plotOptions:{area:{fillColor:{linearGradient:{x1:0,y1:0,x2:0,y2:1},stops:[[0,Highcharts.getOptions().colors[0]],[1,Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get("rgba")]]},marker:{radius:2},lineWidth:1,states:{hover:{lineWidth:1}},threshold:null},column:{stacking:"normal",pointPadding:0,borderWidth:0}}};for(var n in a)r[n]=a[n];var i=new Highcharts.Chart(r);e&&(i.xAxis[0].setExtremes(e[0],e[1]),i.showResetZoom())}}function n(t){var e=Math.floor(t/1e3);return Math.floor(e/60)+":"+("0"+Math.floor(e%60)).slice(-2)}var i,o;!function(){function t(t,e){var a=t[t.length-1][0];e===a?t[t.length-1][1]++:(e-a>l&&(t.push([a+l,0]),t.push([e-l,0])),a=e,t.push([e,1]))}function e(t,e,a){do{var r,n=s(e),i=n+l;r=e+a>i?i-e:a;var o=t[t.length-1][0];n===o?t[t.length-1][1]+=r:(n-o>l&&(t.push([o+l,0]),t.push([n-l,0])),o=n,t.push([n,r])),a-=r}while(a)}function a(t,e){t="string"==typeof t?t:"unnamed";var a=t;switch(e){case 2:a=r(t);break;case 1:var n=r(t),i="reddit.com/r/",o=t.indexOf(i);if(o!==-1){var s=t.substring(o+i.length),l=s.indexOf("/"),h=s.substring(0,l===-1?s.length:l);a=n+" -> "+h}else a=n;break;case 0:a=t}return a}function r(t){var e=t.split("/");if(e[2]){var a=e[2].split(".");return a[a.length-2]?a[a.length-2]:e[2]}return t}function s(t){var e=new Date(t);return e.setMinutes(0),e.setSeconds(0),e.setMilliseconds(0),+e}var l=36e5,h=6048e5;i=function(e,r){var n=[],i=[],o={title:{text:"Redirects"},yAxis:{title:{text:"Number of Redirects"}}};if(e&&e.length){for(var c={},f=0,u=0;u<e.length;u++){var v=a(e[u][1],r),g=s(e[u][0]),m=c[v];if(void 0===m){m=f++,c[v]=m;var p=[[g-l,0]];n.push({name:v,data:p})}var d=n[m].data;t(d,g)}for(var x=-(1/0),b=0;b<n.length;b++){var d=n[b].data,y=d[d.length-1][0];d.push([y+l,0]),y>x&&(x=y)}i=[x-h,x]}return{series:n,zoom:i,options:o}},o=function(t,r){var i=[],o=[],c={title:{text:"TimeLine Wasting Time"},yAxis:{title:{text:"Time Spent"},labels:{formatter:function(){return n(this.value)}}},tooltip:{pointFormatter:function(){return"<span style='color:"+this.color+"'>\u25cf</span> "+this.series.name+": <b>"+n(this.y)+"</b><br/>"}}};if(t&&t.length){for(var f={},u=0,v=0;v<t.length;v++){var g=t[v][4];if(g){var m=3===r?"Wasting Level "+t[v][1]:a(t[v][2],r),p=f[m];if(void 0===p){p=u++,f[m]=p;var d=[[s(g)-l,0]];i.push({name:m,data:d})}var x=i[p].data;e(x,g,t[v][0])}}for(var b=-(1/0),y=0;y<i.length;y++){var x=i[y].data,O=x[x.length-1][0];x.push([O+l,0]),O>b&&(b=O)}o=[b-h,b]}return{series:i,zoom:o,options:c}}}();var s,l=t.getData,h=[{name:"timeLine",maxLevel:3,processData:o},{name:"redirect",maxLevel:2,processData:i}];if(Highcharts.setOptions({global:{timezoneOffset:(new Date).getTimezoneOffset()}}),h.length){for(var c,f=0;f<h.length;f++){var u=h[f].name;c+="<option value='"+f+"'>"+u+"</option>"}$("#dataType").html(c).change(function(){e(h[this.value])}),e(h[0])}var v=t.iframeUrls||[];$("#iframe").val(v.join("\n")),$("#iframeSubmit").click(function(){chrome.storage.sync.set({iframeUrls:$("#iframe").val().split("\n")}),t.setIframeUrls()})});