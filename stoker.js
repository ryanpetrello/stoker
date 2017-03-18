var STOKER_IP = '192.168.1.1';

function getcolor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

$(function(){
    var datasetMap = {},
        datasets = [],
        chart = null,
        ctx = document.getElementById("stoker"),
        chart = new Chart(ctx, {
            type: 'line',
            data: {datasets: datasets},
            options: {
                animation: false,
                scales: {
                    xAxes: [{
                        type: 'time',
                        position: 'bottom'
                    }]
                }
            }
        });
    var fetch = function() {
        $.get('http://' + STOKER_IP + '/stoker.json').success(function(resp){
            $.each(resp.stoker.sensors, function(i, sensor){
                if (!datasetMap[sensor.name]) {
                    datasetMap[sensor.name] = {label: sensor.name, data: [], borderColor: getcolor()};
                    datasets.push(datasetMap[sensor.name]);
                }
                var now = (new Date).getTime();
                datasetMap[sensor.name].data.push({y: sensor.tc, x: now});
            });
            chart.update()
        });
    };
    fetch();
    window.setInterval(fetch, 60 * 1000);
});
