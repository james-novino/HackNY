/*
//'use strict';

//var AMQPClient = require('amqp10').Client;
//var Policy = require('amqp10').Policy;
//var translator = require('amqp10').translator;
//var Promise = require('bluebird');

//var protocol = 'amqps';
//var eventHubHost = 'iothub-ns-hackny-iot-27277-fe85c13e22.servicebus.windows.net/';
//var sasName = 'iothubowner';
//var sasKey = 'VJ6co9OuPpzDRRCEbzq8fkEglOsKPo7NhtdELWurtds=';
//var eventHubName = 'HackNY-IoT';
//var numPartitions = 4;

//var data = [];
//var time = [];
//var id = [];

//var filterOffset = new Date().getTime();
//var filterOption;
//if (filterOffset) {
//    filterOption = {
//        attach: {
//            source: {
//                filter: {
//                    'apache.org:selector-filter:string': translator(
//                      ['described', ['symbol', 'apache.org:selector-filter:string'], ['string', "amqp.annotation.x-opt-enqueuedtimeutc > " + filterOffset + ""]])
//                }
//            }
//        }
//    };
//}

//var uri = protocol + '://' + encodeURIComponent(sasName) + ':' + encodeURIComponent(sasKey) + '@' + eventHubHost;
//var recvAddr = eventHubName + '/ConsumerGroups/analyticsconsumergroup/Partitions/';
//var client = new AMQPClient(Policy.EventHub);

//var messageHandler = function (partitionId, message) {
//    time.push(data.length);
//    data.push(message.body.windSpeed);
//    id.push(message.body.deviceId);
//};

//var errorHandler = function (partitionId, err) {
//    console.warn('** Receive error: ', err);
//};

//var createPartitionReceiver = function (partitionId, receiveAddress, filterOption) {
//    return client.createReceiver(receiveAddress, filterOption)
//      .then(function (receiver) {
//          console.log('Listening on partition: ' + partitionId);
//          receiver.on('message', messageHandler.bind(null, partitionId));
//          receiver.on('errorReceived', errorHandler.bind(null, partitionId));
//      });
//};

//client.connect(uri)
//  .then(function () {
//      var partitions = [];
//      for (var i = 0; i < numPartitions; ++i) {
//          partitions.push(createPartitionReceiver(i, recvAddr + i, filterOption));
//      }
//      return Promise.all(partitions);
//  })
//.error(function (e) {
//    console.warn('Connection error: ', e);
//});
*/
var user = 'tuf13673';
var api = 'gjvr7urjr6';
var tokens = ['mzj0b1jj8s', 'r89lfxysbt', 'u9a7q9cmj6', 'dfyzgx85yx'];
var plotly = require('plotly')(user, api);

function initData(i) {
    return {
        x: [],
        y: [],
        mode: 'lines',
        stream: {
            token: tokens[i],
            maxpoints: 100
        }
    };
}

var data = [0, 1, 2, 3].map(initData);

var layout = {
    filename: 'DemoStream',
    fileopt: 'overwrite',
    layout: {
        title: 'Temperatures'
    },
    world_readable: true
};

plotly.plot(data,layout,function(err, msg) {
    if (err) return console.log(err);
    console.log(msg);

    [0, 1, 2, 3].forEach(function(i) {
        var plotlyStream = plotly.stream(tokens[i], function(err, res) {
            if (err) return console.log(err);
            console.log(res);
            clearInterval(loop);
        });

        var j = 0;
        var loop = setInterval(function() {
            var d = {x: j, y: calcTemp(17, 17.5) };
            var streamObj = JSON.stringify(d);
            plotlyStream.write(streamObj + '\n');
            j++;
        }, 1000)
    })
});

function calcTemp(min, max) {
    var r;
    var range = max - min;
    var buckets = 17.5 / range;
    var limit = buckets * range;
    do {
        r = Math.random() * 17.5;
    } while (r >= limit);

    return min + (r / buckets);
}