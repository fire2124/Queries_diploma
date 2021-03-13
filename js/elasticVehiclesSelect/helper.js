const { Client } = require("@elastic/elasticsearch");
const { getTraffic } = require("../elasticTraffic/elasticTraffic")
const { apiNodeUrl }  = require("../../config.json")
console.log(apiNodeUrl)
const elasticsearch_client = new Client({ node: apiNodeUrl });
const fs = require("fs");
const _ = require('lodash');
//let squares = require("../../../Data/Elastic_query/try/filterSquares.json");
let squares = require("../../Data/Elastic_response/geoPointsC/Po_16");
squares = squares.features
const path = "././../Express_server/Data/queryResult"

function miliseconds(week, day, hrs, min, sec) {
    //from hours
    return (
        (week * 3600 * 24 * 7
            + day * 3600 * 24
            + hrs * 60 * 60
            + min * 60 + sec
        ) *
        1000
    );
}

async function getResponse(lat, lon, name, distance, time, proper, Type) {
    let date = new Date();
    try {

        let response = await elasticsearch_client.search({
            index: "bst",
            scroll: "10m",
            _source: [
                "type",
                "geometry",
                `properties.${proper}`,
            ],
            body: {
                query: {
                    bool: {
                        must: [
                            { match: { "properties.Type": `${Type}` } },
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
                        ],
                        filter: {
                            geo_distance: {
                                distance: `${distance}m`,
                                "geometry.coordinates": {
                                    lat: lat,
                                    lon: lon
                                }
                            }
                        }
                    },

                },
                aggs: {
                    per_ring: {
                        geo_distance: {
                            field: "geometry.coordinates",
                            unit: "m",
                            origin: {
                                lat: lat,
                                lon: lon
                            },
                            ranges: [
                                { from: 0, to: distance }
                            ]
                        }
                    },
                    cumulative_sum_delay_aggregations: {
                        extended_stats: {
                            field: `properties.${proper}`
                        }
                    }
                }
            },
        });
        response = response.body.aggregations
        let obj = {}
        let geometry = {}
        let coordinates = []

        obj.name = "Feature"
        geometry.type = "Point"
        coordinates.push(lon, lat)
        geometry.coordinates = coordinates
        obj.geometry = geometry

        let properties = []
        let count = response.cumulative_sum_delay_aggregations.count
        let min = response.cumulative_sum_delay_aggregations.min
        let max = response.cumulative_sum_delay_aggregations.max
        let avg = response.cumulative_sum_delay_aggregations.avg
        let sum = response.cumulative_sum_delay_aggregations.sum

        let stats = {}
        stats.count = count
        stats.min = min
        stats.max = max
        stats.avg = avg
        stats.sum = sum
        stats.id = name

        properties.push(stats)
        obj.properties = properties
        return obj;
    } catch (err) { console.log(err) }
}


async function getAll(properties, time, Type) {
    let distance = 20
    return await Promise.all(
        squares.map(async (e) => {
            let lat = e.geometry.coordinates[1]
            let lon = e.geometry.coordinates[0]
            let name = e.id
            let obj = getResponse(lat, lon, name, distance,
                time, properties, Type)
            return obj
        })
    ).then(async result => {
        console.log(result)
        let finalResult = []
        result.map(e => {
            if (e.properties[0].count != 0)
                console.log(e.properties[0])
                finalResult.push(e)
        })
        //console.log(finalResult)
        let obj = {}
        obj.type = "FeatureCollection"
        obj.name = `${properties}_${Type}_Aggregation`
        obj.features = finalResult

        if (time.minutes == 15)
            fs.writeFileSync(`${path}/${properties}_${Type}_15minutes.json`, JSON.stringify(obj));
        else if (time.hours == 1)
            fs.writeFileSync(`${path}/${properties}_${Type}_1hour.json`, JSON.stringify(obj));
        else if (time.hours == 3)
            fs.writeFileSync(`${path}/${properties}_${Type}_3hours.json`, JSON.stringify(obj));
        else if (time.hours == 4 && new Date().getHours() <= 12)
            fs.writeFileSync(`${path}/${properties}_${Type}_5-9.json`, JSON.stringify(obj));
        else if (time.hours == 4 && new Date().getHours() > 12)
            fs.writeFileSync(`${path}/${properties}_${Type}_14-18.json`, JSON.stringify(obj));
        else if (time.day == 1)
            fs.writeFileSync(`${path}/${properties}_${Type}_1day.json`, JSON.stringify(obj));
        else if (time.week == 1)
            fs.writeFileSync(`${path}/${properties}_${Type}_1week.json`, JSON.stringify(obj));
        else if (time.week == 4)
            fs.writeFileSync(`${path}/${properties}_${Type}_1month.json`, JSON.stringify(obj));

    });
}

function query(week, day, hours, minutes, sec) {
    let properties1 = `DELAY`
    let properties2 = `CHANGE_OF_DELAY`

    const promise1 = new Promise(function (resolve, reject) {
        let typeOfVehicles = "MHD"
        resolve(getAll(`${properties1}`, { week, day, hours, minutes, sec }, typeOfVehicles))
        reject()
    });

    const promise2 = new Promise(function (resolve, reject) {
        let typeOfVehicles = "SAD"
        resolve(getAll(`${properties1}`, { week, day, hours, minutes, sec }, typeOfVehicles))
        reject()
    });

    const promise3 = new Promise(function (resolve, reject) {
        let typeOfVehicles = "Train"
        resolve(getAll(`${properties1}`, { week, day, hours, minutes, sec }, typeOfVehicles))
        reject()
    });

    const promise4 = new Promise(function (resolve, reject) {
        let typeOfVehicles = "MHD"
        resolve(getAll(`${properties2}`, { week, day, hours, minutes, sec }, typeOfVehicles))
        reject()
    });

    const promise5 = new Promise(function (resolve, reject) {
        let typeOfVehicles = "SAD"
        resolve(getAll(`${properties2}`, { week, day, hours, minutes, sec }, typeOfVehicles))
        reject()
    });

    const promise6 = new Promise(function (resolve, reject) {
        let typeOfVehicles = "Train"
        resolve(getAll(`${properties2}`, { week, day, hours, minutes, sec }, typeOfVehicles))
        reject()
    });
    const promise7 = new Promise(function (resolve, reject) {
        let type = "Traffic"
        resolve(getTraffic({ week, day, hours, minutes, sec }, type))
        reject()
    });

    Promise.all([promise1, promise2, promise3, promise4,
        promise5, promise6, promise7]).then((value) => {
            console.log(value);
        });

}

module.exports.query = query

// let properties1 = `DELAY`

// let typeOfVehicles = "SAD"

// let week = 1
// let day = 0
// let hours = 0
// let minutes = 0
// let sec = 0
// getAll(`${properties1}`, { week, day, hours, minutes, sec }, typeOfVehicles)