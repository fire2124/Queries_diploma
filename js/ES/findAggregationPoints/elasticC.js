//let squares2 = require("../../../Data/Elastic_query/geoJSON/squares2.json");
let coordinates = require("../../../Data/Elastic_query/geoJSON/coordinates.json");
const fs = require("fs");
const geolib = require("geolib");

coordinates = coordinates.features

const Supercluster = require('supercluster');
const index = new Supercluster({
  radius: 40,
  maxZoom: 17
});
index.load(coordinates);

let zoom = [17, 16, 15, 14, 13, 12, 8, 4, 0];


let vychod = {}
vychod.name = "vychod"
vychod.westLng = 20.174808;
vychod.eastLng = 22.544190;
vychod.southLat = 48.711819;
vychod.northLat = 49.402120;

let po = {}
po.name = "Po"
po.westLng = 21.204804;
po.eastLng = 21.282224;
po.southLat = 48.972418;
po.northLat = 49.024956;

let pv = {}
pv.name = "Po-V"
pv.westLng = 21.284804;
pv.eastLng = 21.44224;
pv.southLat = 48.972418;
pv.northLat = 49.024956;

let pz = {}
pz.name = "Po-Z"
pz.westLng = 21.044804;
pz.eastLng = 21.204804;
pz.southLat = 48.972418;
pz.northLat = 49.024956;

let ps = {}
ps.name = "Po-S"
ps.westLng = 21.204804;
ps.eastLng = 21.282224;
ps.southLat = 49.024956;
ps.northLat = 49.077494;

let pj = {}
pj.name = "Po-J"
pj.westLng = 21.204804;
pj.eastLng = 21.282224;
pj.southLat = 48.892418;
pj.northLat = 48.972418;

let array2 = []
let array = []

array.push(po, vychod, pv, pj, pz, ps)

array.map(e => {
  zoom.map(x => {
    let velkost = {}
    let clusterMarkers = index.getClusters([e.westLng, e.southLat, e.eastLng, e.northLat], x);
    if (clusterMarkers.length > 1) {
      velkost.name = `${e.name}_${x}`
      velkost.lenght = clusterMarkers.length
      array2.push(velkost)
      let obj = {};
      obj.type = "FeatureCollection";
      obj.name = `Centroids_${e.name}_${x}`;
      obj.features = clusterMarkers;
      fs.writeFileSync(`./Data/Elastic_query/geoPointsC/${e.name}_${x}.json`, JSON.stringify(obj));
    }
  })
})

console.log(array2)















// let finalResult = []
// squares2.map(x=>{
//     coordinates.map(e=>{

//         if(geolib.isPointInPolygon(
//             {latitude: e.geometry.coordinates[1],
//              longitude: e.geometry.coordinates[0]}
//             ,[{ latitude: x.vrch[1], longitude: x.vrch[0] }, 
//             { latitude: x.spodok[1], longitude: x.spodok[0] },
//         ])){
//             finalResult.push(x)
//         }
//     })
// })

// fs.writeFileSync(`./Data/Elastic_query/squaresFinalWithOutFilter.json`, JSON.stringify(finalResult));