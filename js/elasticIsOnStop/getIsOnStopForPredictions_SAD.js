const { Client } = require("@elastic/elasticsearch");
const ElasticsearchScrollStream = require("elasticsearch-scroll-stream");
const SadStops = require("../../Data/static/Zas_SAD.json");

const fs = require("fs");
const elasticsearch_client = new Client({ node: "http://localhost:9200" });
let date = new Date();
const _ = require("lodash");
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
        fs.writeFileSync(`./Data/Elastic_query/getIsOnStop/predictionFinalResult_${Type}${time.day}.json`, JSON.stringify(finalResult));

        //console.log(finalResult)
        console.log(finalResult.length)
        let finalAcc = []
        finalResult.map(e => { // Get Times 
            let d = new Date(e.properties.Current_Time);
            e.properties.Current_Month = d.getMonth()
            e.properties.Current_Day = d.getDate()
            e.properties.Current_Hour = d.getHours()
            e.properties.Current_Minutes = d.getMinutes()
            e.properties.Current_Seconds = d.getSeconds()
        })
        let result = finalResult

        //console.log(finalResult)
        finalResult.map(e => { //getAll indexes witch are equal in one day
            let acc = []
            let time = []
            for (let i = 0; i < result.length; i++)
                if (_.isEqual(result[i].properties.Current_Month, e.properties.Current_Month) &&
                    _.isEqual(result[i].properties.Current_Day, e.properties.Current_Day) &&
                    _.isEqual(result[i].properties.Trip, e.properties.Trip) &&
                    _.isEqual(result[i].properties.Current_Stop, e.properties.Current_Stop) &&
                    _.isEqual(result[i].properties.ROUTE_NUMBER, e.properties.ROUTE_NUMBER) &&
                    _.isEqual(result[i].properties.Dir, e.properties.Dir)) {

                    acc.push(i);
                    let minTime = Math.min(e.properties.Current_Time, result[i].properties.Current_Time)
                    time.push(minTime)
                }
            time = _.uniq(time).sort((a, b) => a - b)
            let minTime = Math.min(...time)

            let d = new Date(minTime);
            Current_Month = d.getMonth()
            Current_Day = d.getDate()
            Current_Hour = d.getHours()
            Current_Minutes = d.getMinutes()
            Current_Seconds = d.getSeconds()

            finalAcc.push({
                obj: e.properties.ROUTE_NUMBER, acc: acc, time: {
                    Current_Month: Current_Month,
                    Current_Day: Current_Day, Current_Hour: Current_Hour,
                    Current_Minutes: Current_Minutes, Current_Seconds: Current_Seconds
                }
            })
        })
        //console.log(finalAcc)


        // let print = []
        // for (let i = 0; i < 10; i++)
        //     print.push(finalAcc[i])
        //fs.writeFileSync(`./Data/Elastic_query/getIsOnStop/predictionQuery_Train.json`, JSON.stringify({print}));

        let finito = []
        finalResult.map(e => {
            finalAcc.map(x => {
                if (_.isEqual(x.time.Current_Month, e.properties.Current_Month) &&
                    _.isEqual(x.time.Current_Day, e.properties.Current_Day) &&
                    _.isEqual(x.time.Current_Hour, e.properties.Current_Hour) &&
                    _.isEqual(x.time.Current_Minutes, e.properties.Current_Minutes) &&
                    _.isEqual(x.time.Current_Minutes, e.properties.Current_Minutes) &&
                    _.isEqual(x.obj, e.properties.ROUTE_NUMBER)) {
                    finito.push(e)
                }
            })
        })
        //Filter
        let filteredResult = finito.reduce((acc, current) => {
            const x = acc.find(
                (item) =>
                    item ===
                    current
            );
            if (!x) {
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, []);
        //console.log(filteredResult)
        console.log(filteredResult.length)



        let result2 = []
        filteredResult.map(e => {
            let obj = {}
            obj.lon = e.geometry.coordinates[0]
            obj.lat = e.geometry.coordinates[1]
            obj.ROUTE_NUMBER = e.properties.ROUTE_NUMBER
            obj.Trip = e.properties.Trip
            obj.TripTime = e.properties.TripTime
            obj.vehicleID = e.properties.vehicleID
            obj.lastStopOrder = e.properties.lastStopOrder
            obj.lineID = e.properties.lineID
            obj.lineType = e.properties.lineType
            obj.DELAY = e.properties.DELAY
            obj.Current_Stop = e.properties.Current_Stop
            obj.Current_Stop_ID = e.properties.Current_Stop_ID
            // SadStops.map(x => {
            //     if (x.properties.name === e.properties.Current_Stop) {
            //         let id = x.properties.id
            //         obj.Current_Stop_ID = id
            //     }
            // })
            obj.Current_Time = e.properties.Current_Time
            obj.Current_Day = e.properties.Current_Day
            obj.Current_Hour = e.properties.Current_Hour
            obj.Current_Minutes = e.properties.Current_Minutes
            obj.Current_Seconds = e.properties.Current_Seconds
            obj.destination = e.properties.destination
            obj.Dir = e.properties.Dir
            
            if (obj.Current_Stop){
                //console.log(obj)
                result2.push(obj)
            }
           
        })

        console.log(result2.length)
        fs.writeFileSync(`./Data/Elastic_query/getIsOnStop/predictionQuery_${Type}${time.day}.json`, JSON.stringify(result2));
    })

    es_stream.on("error", function (err) {
        console.log(err);
    });
}

let hours = 0;
let minutes = 0;
let sec = 0;
let week = 0;
let day = 1;

getIsOnStop("SAD", { week, day, hours, minutes, sec })