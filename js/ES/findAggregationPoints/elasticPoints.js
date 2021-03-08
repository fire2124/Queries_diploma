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

const es_stream = new ElasticsearchScrollStream(elasticsearch_client, {
  index: "bst",
  scroll: "10m",
  size: pageSize,
  _source: ["type","geometry"],
  body: {
    query: {
      match_all: {}
    }
  }
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
  obj.name = "Coordinates";
  obj.features = finalResult;
  fs.writeFileSync(
    `./Data/Elastic_query/coordinates.json`,
    JSON.stringify(obj)
  );
  console.log(counter);
});

es_stream.on("error", function (err) {
  console.log(err);
});
