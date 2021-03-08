const { Client } = require("@elastic/elasticsearch");
const ElasticsearchScrollStream = require("elasticsearch-scroll-stream");
const fs = require("fs");
const elasticsearch_client = new Client({ node: "http://localhost:9200" });
let date = new Date();
const _ = require("lodash");
let lenghtOfElastic;

String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};

//get lenght of elastic index
async function geLenght() {
    lenghtOfElastic = await elasticsearch_client.search({
        index: "traffic_situation",
        scroll: "10m",
        body: {
            from: 0,
            size: 1,
            query: {
                match_all: {},
            },
        },
    });
    lenghtOfElastic = lenghtOfElastic.body.hits.total.value;
    console.log(lenghtOfElastic);
}
geLenght();
// Create index and add documents here...
const pageSizeFrom = "0";
//from: pageSizeFrom,
const pageSize = "10000";
let stopCounterIndex = parseInt(pageSize) + lenghtOfElastic;
let counter = 0;
let current_doc;
let finalResult = [];

function miliseconds(week, day, hrs, min, sec) {
    //from hours
    return (
        (week * 360 * 24 * 7 + day * 3600 * 24 + hrs * 60 * 60 + min * 60 + sec) *
        1000
    );
}

function getTraffic( time) {
    const es_stream = new ElasticsearchScrollStream(elasticsearch_client, {
        index: "traffic_situation",
        scroll: "10m",
        size: pageSize,
        body: {
            query: {
                bool: {
                    must: [
                        { "match_all": {} }
                    ],
                    filter: [
                        {
                            range: {
                                "properties.Current_Time": {
                                    gte: `${date.getTime() - miliseconds(time.week, time.day, time.hours, time.minutes, time.sec)
                                        }`,
                                    lte: `${date.getTime()}`,
                                    format: "epoch_millis",
                                },
                            },
                        },
                    ]
                },
            },
        },
    });

    es_stream.on("data", function (data) {
        current_doc = JSON.parse(data.toString());
        if (counter == stopCounterIndex) {
            es_stream.close();
        }
        counter++;
        if (current_doc.geometry) finalResult.push(current_doc);
    });

    es_stream.on("end", async function () {
        //Filter
        fs.writeFileSync(`./Data/Elastic_query/traffic/finalResult.json`, JSON.stringify(finalResult));

        let filteredResult = finalResult.reduce((acc, current) => {
            let x = acc.find(
                (item) =>
                    _.isEqual(item.geometry.coordinates, current.geometry.coordinates)
            );
            if (!x) {
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, []);
        let count = _.countBy(finalResult,"properties.title");
        let array = []
        Object.keys(count).forEach(function(key) {
            //console.log(key, count[key]);
            let obj = {}
            obj.title =key
            obj.count = count[key]
            array.push(obj)
          });

        filteredResult.map(e=>{
            array.map(x=>{
                if(e.properties.title === x.title) e.properties.count = x.count          
            })  
        })
        let obj ={}
        obj.type = "FeatureCollection"
        obj.name = "elastic_traffic"
        obj.features = filteredResult
        fs.writeFileSync(`./Data/Elastic_query/traffic/filteredResult.json`, JSON.stringify(obj));
    })

    es_stream.on("error", function (err) {
        console.log(err);
    });
}

let hours = 0;
let minutes = 0;
let sec = 0;
let week = 0;
let day = 3;
const countOccurrences = arr => arr.reduce((prev, curr) => (prev[curr] = ++prev[curr] || 1, prev), {});

getTraffic({ week, day, hours, minutes, sec })
