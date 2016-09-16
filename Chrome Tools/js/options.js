chrome.storage.sync.get("redirects", function(items) {
    var redirects = items.redirects;
    var timezoneOffset = (new Date()).getTimezoneOffset() * 60000;
    var hourAmount = 3600000; //num of millisec
    //assume sorted
    if (redirects && redirects.length) {
        var series = [];
        var indexes = {};
        var index = 0;

        //set all
        var allStart = nearestHour(redirects[0][0]) - hourAmount;
        var all = [[allStart,0]];
        for (var j = 0 ; j < redirects.length ; j++) {
            var name = getWebsiteName(redirects[j][1]);
            var hour = nearestHour(redirects[j][0]);
            var curIndex = indexes[name];
            if (curIndex === undefined) {
                curIndex = index++;
                indexes[name] = curIndex;
                //add a 0 before start of data
                var newData = [[hour - hourAmount,0]];
                series.push({name:name,data:newData});
            }
            var data = series[curIndex].data;
            addEntry(data,hour);
            addEntry(all,hour);
        }
        series.push({name:"all",data:all,visible:false});
        //add a 0 aftet end of data
        for (var i = 0 ; i < series.length ; i++) {
            var data = series[i].data;
            data.push([data[data.length-1][0] + hourAmount, 0]);
        }
        $("#redirects").highcharts({
            chart: {
                zoomType: "x",
                type: "spline"
            },
            title: {
                text: "Redirects"
            },
            xAxis:{
                type: "datetime"
            },
            yAxis: {
                title: {
                    text: "Number of Redirects"
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
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get("rgba")]
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
    //depending on how specific we want to categorize websites, may want to improve this logic
    function getWebsiteName(name) {
        return (name ? name : "unnamed");
    }

    function nearestHour(utc) {
        var date = new Date(utc);
        return +new Date(date.getYear(),date.getMonth(),date.getDate(),date.getHours()) - timezoneOffset;
    }

    function addEntry(data,hour) {
        var pastTime = data[data.length-1][0];
        if (hour === pastTime) {
            data[data.length-1][1]++;
        } else {
            if (hour-pastTime > hourAmount) {
                data.push([pastTime + hourAmount,0]);
                data.push([hour - hourAmount,0]);
            }
            pastTime = hour;
            data.push([hour,1]);
        }
    }
});