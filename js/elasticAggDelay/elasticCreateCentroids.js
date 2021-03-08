const { Client } = require("@elastic/elasticsearch");
const ElasticsearchScrollStream = require("elasticsearch-scroll-stream");
const fs = require("fs");
const elasticsearch_client = new Client({ node: "http://localhost:9200" });
let date = new Date();
let lenghtOfElastic;
let coordinates = require("../../../Data/Elastic_query/coordinates.json");
coordinates = coordinates.features

const Supercluster = require('supercluster');


let zoom = [17, 12, 8, 4, 0];
//po
let presov = {}
presov.name = "presov"
presov.westLng = 21.204804;
presov.eastLng = 21.282224;
presov.southLat = 48.972418;
presov.northLat = 49.024956;

let vychod = {}
vychod.name = "vychod"
vychod.westLng = 19.664780;
vychod.eastLng = 22.544190;
vychod.southLat = 48.711819;
vychod.northLat = 49.402120;

let array2 = []
let array = []
array.push(presov, vychod)

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
let hours = 0;
let minutes = 15;
let sec = 0;
let week = 0;
let day = 0;

const es_stream = new ElasticsearchScrollStream(elasticsearch_client, {
  index: "bst",
  scroll: "10m",
  size: pageSize,
  _source: ["type","geometry", "properties.DELAY","properties.CHANGE_OF_DELAY"],
  body: {
    query: {
      bool: {
        must: [
          { match: { "properties.Type": "MHD" } },
          {
            range: {
              "properties.Current_Time": {
                gte: `${date.getTime() - miliseconds(week, day, hours, minutes, sec)
                  }`,
                lte: `${date.getTime()}`,
                format: "epoch_millis",
              },
            },
          },
        ],
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
  let obj = {};
  obj.type = "FeatureCollection";
  obj.name = "Centroids";
  obj.features = finalResult;
  console.log(counter);
  array.map(e => {
    zoom.map(x => {
      const index = new Supercluster({
        radius: 40,
        maxZoom: 17
      });
      index.load(finalResult);

      let clusterMarkers = index.getClusters([e.westLng, e.southLat, e.eastLng, e.northLat], x);
    
      let obj = {};
      obj.type = "FeatureCollection";
      obj.name = `Centroids_${e.name}_${x}`;
      obj.features = clusterMarkers;
      fs.writeFileSync(`./Data/Elastic_query/geoAggFromEsStream/${e.name}_${x}_agg.json`, JSON.stringify(obj));
    })
  })
});

es_stream.on("error", function (err) {
  console.log(err);
});
