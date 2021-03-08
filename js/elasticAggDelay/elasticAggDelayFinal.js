const { Client } = require("@elastic/elasticsearch");
const elasticsearch_client = new Client({ node: "http://localhost:9200" });
let date = new Date();
let lenghtOfElastic;
const fs = require("fs");
const quaryUrl = `http://127.0.0.1:9201/query/_doc/`;
const axios = require("axios");

//let squares = require("../../../Data/Elastic_query/try/filterSquares.json");
let squares = require("../../../Data/Elastic_query/geoPointsC/presov_16");

squares = squares.features
console.log(squares.length)


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

async function getResponse(lat, lon, name, distance, time, proper) {
  let response = await elasticsearch_client.search({
    index: "bst",
    scroll: "10m",
    body: {
      query: {
        bool: {
          must: [
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
  properties.push({ name: name }, response)
  obj.properties = properties
  return obj;
}


async function getAll() {
  let distance = 150
  let hours = 0;
  let minutes = 0;
  let sec = 0;
  let week = 0;
  let day = 1;
  let properties = `DELAY`
  return await Promise.all(
    squares.map(async (e) => {
      let lat = e.geometry.coordinates[1]
      let lon = e.geometry.coordinates[0]
      let name = e.id
      let obj = getResponse(lat, lon, name, distance,
        { week, day, hours, minutes, sec },
        properties)
      return obj
    })
  ).then(e => {
    let counter = 0
    e.map(x => {
      axios.post(quaryUrl, x);
      console.log(++counter)
    })
  });
}
getAll()
