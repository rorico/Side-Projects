$(function () { 
    chrome.storage.sync.get('redirects', function(items) {
        redirects = items.redirects;
        //assume sorted
        if (redirects && redirects.length){
            var timezoneOffset = (new Date()).getTimezoneOffset() * 60000;
            var series = [];
            var checked = [];
            for (var j = 0 ; j < redirects.length ; j++) {
                checked.push(false);
            }
            for (var j = 0 ; j < redirects.length ; j++) {
                if (checked[j]) continue; 
                var name = redirects[j][1];
                if (!name) name = "unnamed";
                var pastTime = 0;
                var date = new Date(redirects[j][0]);
                var data = [[+new Date(date.getYear(),date.getMonth(),date.getDate(),date.getHours()) - timezoneOffset - 3600000,0]];
                for (var i = j ; i < redirects.length ; i++) {
                    var nameNow = redirects[i][1];
                    if (!nameNow) nameNow = "unnamed";
                    if (nameNow!=name || checked[i]) continue;
                    checked[i] = true;
                    var date = new Date(redirects[i][0]);
                    var dateObj = +new Date(date.getYear(),date.getMonth(),date.getDate(),date.getHours()) - timezoneOffset;
                    if (dateObj!=pastTime) {
                        if(dateObj-pastTime > 3600000){ //1 hour
                            data.push([pastTime + 3600000,0]);
                            data.push([dateObj - 3600000,0]);
                        }
                        pastTime = dateObj;
                        data.push([dateObj,1]);
                    } else {
                        data[data.length-1][1] ++;
                    }
                }
                data.push([dateObj + 3600000,0]);
                series.push({name:name,data:data});
            }
            var pastTime = 0;
            var date = new Date(redirects[0][0]);
            var all = [[+new Date(date.getYear(),date.getMonth(),date.getDate(),date.getHours()) - timezoneOffset - 3600000,0]];
            for (var i = 0 ; i < redirects.length ; i++) {
                var date = new Date(redirects[i][0]);
                var dateObj = +new Date(date.getYear(),date.getMonth(),date.getDate(),date.getHours()) - timezoneOffset;
                if (dateObj!=pastTime) {
                    if(dateObj-pastTime > 3600000){ //1 hour
                        all.push([pastTime + 3600000,0]);
                        all.push([dateObj - 3600000,0]);
                    }
                    pastTime = dateObj;
                    all.push([dateObj,1]);
                } else {
                    all[all.length-1][1] ++;
                }
            }
            all.push([dateObj + 3600000,0]);
            series.push({name:"All",data:all,visible: false});
            $('#container').highcharts({
            chart: {
                zoomType: 'x',
                type: 'spline'
            },
            title: {
                text: 'Redirects'
            },
            xAxis:{
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Number of Redirects'
                }
            },
            series: series,
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            }
        });

        }
        
    });
});