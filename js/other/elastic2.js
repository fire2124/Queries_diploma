const { Client } = require("@elastic/elasticsearch");
const ElasticsearchScrollStream = require("elasticsearch-scroll-stream");
const fs = require("fs");
const elasticsearch_client = new Client({ node: "http://localhost:9200" });
let lenghtOfElastic;
// get lenght of elastic index
async function geLenght(){
  lenghtOfElastic= await elasticsearch_client.search({
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
}
geLenght()
// Create index and add documents here...
const pageSizeFrom = "0";
//from: pageSizeFrom,
const pageSize = "10000";
let stopCounterIndex = parseInt(pageSize) + 100;
let counter = 0;
let current_doc;
let finalResult = [];

const es_stream = new ElasticsearchScrollStream(
  elasticsearch_client,
  {
    index: "bst",
    scroll: "10m",
    
    size: pageSize,
    body: {
      _source: [
        "type",
        "geometry",
        "properties.DELAY",
      ],
      aggs: {
        per_ring: {
          geo_distance: { 
            field:    "geometry.coordinates",
           unit:    "m",
           origin: {
             lat:  49.01030346339127,
             lon:   21.251420974731445
            },
           ranges: [
              {from: 0,to: 50 }
            ]
          }
        },
       cumulative_sum_delay_aggregations:{
         extended_stats: {
           field:"properties.DELAY"
          }
        }
      }
    },
  }
  //["_id", "_score"]
);

es_stream.on("data", function (data) {
  current_doc = JSON.parse(data.toString());
  //console.log(current_doc)
  if (counter == stopCounterIndex) {
    es_stream.close();
  }
  counter++;
  finalResult.push(current_doc);
});

es_stream.on("aggregations",(data)=>{
  current_doc = JSON.parse(data);
  console.log(current_doc)

})
es_stream.on("end", function () {
  let obj = {};
  obj.type = "FeatureCollection";
  obj.name = "Meskania";
  obj.features = finalResult;
  fs.writeFileSync(`./Data/MhdPO_json/Nice.json`, JSON.stringify(obj));
  console.log(counter);


});

es_stream.on("error", function (err) {
  console.log(err);
});

