const { Client } = require("@elastic/elasticsearch");
const ElasticsearchScrollStream = require("elasticsearch-scroll-stream");
const fs = require("fs");
const { apiNodeUrl }  = require("../../config.json")
const elasticsearch_client = new Client({ node: apiNodeUrl });
let date = new Date();
const _ = require("lodash");
const path = "././../Express_server/Data/queryResult"
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

function getTraffic(time, type) {
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

        let count = _.countBy(finalResult, "properties.description");
        let array = []
        Object.keys(count).forEach(function (key) {
            //console.log(key, count[key]);
            let obj = {}
            obj.description = key
            obj.count_of_obstacles = count[key]
            array.push(obj)
        });

        filteredResult.map(e => {
            array.map(x => {
                if (e.properties.title === x.title)
                    e.properties.count_of_obstacles = x.count_of_obstacles
            })
        })
        let obj = {}
        obj.type = "FeatureCollection"
        obj.name = "elastic_traffic"
        obj.features = filteredResult
        if (time.minutes == 15)

            fs.writeFileSync(`${path}/${type}_15minutes.json`, JSON.stringify(obj));
        else if (time.hours == 1)
            fs.writeFileSync(`${path}/${type}_1hour.json`, JSON.stringify(obj));
        else if (time.hours == 3)
            fs.writeFileSync(`${path}/${type}_3hours.json`, JSON.stringify(obj));
        else if (time.hours == 4 && new Date().getHours() <= 12)
            fs.writeFileSync(`${path}/${type}_5-9.json`, JSON.stringify(obj));
        else if (time.hours == 4 && new Date().getHours() > 12)
            fs.writeFileSync(`${path}/${type}_14-18.json`, JSON.stringify(obj));
        else if (time.day == 1)
            fs.writeFileSync(`${path}/${type}_1day.json`, JSON.stringify(obj));
        else if (time.week == 1)
            fs.writeFileSync(`${path}/${type}_1week.json`, JSON.stringify(obj));
        else if (time.week == 4)
            fs.writeFileSync(`${path}/${type}_1month.json`, JSON.stringify(obj));
    })

    es_stream.on("error", function (err) {
        console.log(err);
    });
}

module.exports.getTraffic = getTraffic