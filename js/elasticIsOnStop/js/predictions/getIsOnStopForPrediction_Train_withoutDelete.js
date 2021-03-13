const _ = require("lodash");
const { Client } = require("@elastic/elasticsearch");
const { apiNodeUrl }  = require("../../../../config.json")
const fs = require("fs");
const ElasticsearchScrollStream = require("elasticsearch-scroll-stream");
const elasticsearch_client = new Client({ node: apiNodeUrl });
let TrainDirections = require("../../json/directionTrain.json");
TrainDirections = TrainDirections.array
let date = new Date();
let lenghtOfElastic;


//get lenght of elastic index
async function geLenght() {
    lenghtOfElastic = await elasticsearch_client.search({
        index: "bst",
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



function miliseconds(week, day, hrs, min, sec) {
    //from hours
    return (
        (week * 360 * 24 * 7 + day * 3600 * 24 + hrs * 60 * 60 + min * 60 + sec) *
        1000
    );
}

function getIsOnStop(Type, time) {
    const pageSize = "10000";
    let stopCounterIndex = parseInt(pageSize) + lenghtOfElastic;
    let counter = 0;
    let current_doc;
    let finalResult = [];

    const es_stream = new ElasticsearchScrollStream(elasticsearch_client, {
        index: "bst",
        scroll: "10m",
        size: pageSize,
        body: {
            query: {
                bool: {
                    must: [
                        { match: { "properties.isOnStop": "true" } },
                        {
                            range: {
                                "properties.Current_Time": {
                                    gte: `${date.getTime() - miliseconds(time.week, time.day, time.hours, time.minutes, time.sec)}`,
                                    lte: `${date.getTime()}`,
                                    format: "epoch_millis",
                                },
                            },
                        },
                    ],
                    filter: [
                        { match: { "properties.Type": `${Type}` } }
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

        finalResult.map(e => {
            let d = new Date(e.properties.Current_Time);
            e.properties.Current_Month = d.getMonth()
            e.properties.Current_Day = d.getDate()
            e.properties.Current_Hour = d.getHours()
            e.properties.Current_Minutes = d.getMinutes()
            e.properties.Current_Seconds = d.getSeconds()
        })


        let result2 = []
        finalResult.map(e => {
            let obj = {}
            obj.lon = e.geometry.coordinates[0]
            obj.lat = e.geometry.coordinates[1]
            obj.ROUTE_NUMBER = e.properties.ROUTE_NUMBER
            obj.DELAY = e.properties.DELAY
            obj.Current_Stop = e.properties.Current_Stop
            obj.From = e.properties.From
            obj.Destination = e.properties.To
            obj.Direction =  TrainDirections.indexOf(`${e.properties.From} - ${e.properties.To} `)+1
            obj.Current_Time = e.properties.Current_Time
            obj.Current_Day = e.properties.Current_Day
            obj.Current_Hour = e.properties.Current_Hour
            obj.Current_Minutes = e.properties.Current_Minutes
            obj.Current_Seconds = e.properties.Current_Seconds
            if (e.properties.Current_Stop)
                result2.push(obj)
        })

        console.log(result2.length)
        fs.writeFileSync(`./Data/Elastic_response/getIsOnStop/predictionQuery_${Type}${time.day}_withoutDelete.json`, JSON.stringify(result2));
    })

    es_stream.on("error", function (err) {
        console.log(err);
    });
}


function getIsOnStopTrain_withoutDelete(day){
    let hours = 0;
    let minutes = 0;
    let sec = 0;
    let week = 0;
    //let day = 1;

    getIsOnStop("Train", { week, day, hours, minutes, sec })
}

module.exports.getIsOnStopTrain_withoutDelete = getIsOnStopTrain_withoutDelete