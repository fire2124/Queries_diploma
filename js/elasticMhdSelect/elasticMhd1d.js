const { Client } = require("@elastic/elasticsearch");
const ElasticsearchScrollStream = require("elasticsearch-scroll-stream");
const fs = require("fs");
const elasticsearch_client = new Client({ node: "http://localhost:9200" });
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
    (week * 3600 * 24 * 7 
      + day * 3600 * 24 
      + hrs * 60 * 60 
      + min * 60 + sec
      ) *
    1000
  );
}
let hours = 0;
let minutes = 0;
let sec = 0;
let week = 0;
let day = 1;

const es_stream = new ElasticsearchScrollStream(elasticsearch_client, {
  index: "bst",
  scroll: "10m",
  size: pageSize,
  body: {
    query: {
      bool: {
        must: [
          { match: { "properties.Type": "MHD" } },
          {
            range: {
              "properties.Current_Time": {
                gte: `${
                  date.getTime() - miliseconds(week, day, hours, minutes, sec)
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
  obj.name = "Traffic";
  obj.features = finalResult;
  fs.writeFileSync(`./Data/Elastic_query/Mhd1d.json`, JSON.stringify(obj));
  console.log(counter);
});

es_stream.on("error", function (err) {
  console.log(err);
});
