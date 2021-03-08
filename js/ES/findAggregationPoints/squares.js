const geolib = require("geolib");
const fs = require("fs");
// pre vychod
// const latSever = 49.461345;
// const lonSever = 21.270789;
// const latJuh = 48.591889;
// const lonJuh = 21.286344;
// const latZapad = 49.110464;
// const lonZapad = 19.66478;
// const latVychod = 49.046675;
// const lonVychod = 22.515337;
// pre Presov
const latSever = 49.057656;
const lonSever = 21.270789;
const latJuh = 48.947357;
const lonJuh = 21.255656;
const latZapad = 49.007730;
const lonZapad = 21.141023;
const latVychod = 49.044166;
const lonVychod = 21.351349;

const latArray = [latSever, latJuh, latZapad, latVychod];
const lonArray = [lonSever, lonJuh, lonZapad, lonVychod];
let minLatArray = Math.min(...latArray);
let maxLatArray = Math.max(...latArray);
let minLonArray = Math.min(...lonArray);
let maxLonArray = Math.max(...lonArray);
// console.log(minLatArray + " " + maxLatArray);
// console.log(minLonArray + " " + maxLonArray);
const R = 6378137
let lat = minLatArray;
   let lon = maxLonArray;
   //offsets in meters
   let firstdn = -50
   let firstde = 50
   //Coordinate offsets in radians
   let firstdLat = firstdn/R
   let firstdLon = firstde / (R * Math.cos((Math.PI * lat) / 180));
   //OffsetPosition, decimal degrees
   let spodokLat = lat + firstdLat * 180/Math.PI
   let spodokLon = lon + firstdLon * 180/Math.PI 
   console.log(spodokLat)
   console.log(spodokLon)

function getSquares() {
  let result = [];
  let result2 = []
  //Position, decimal degrees
  // let lat = minLatArray;
  // let lon = maxLonArray;
  console.log(lat)
  console.log(lon)
  //Earth’s radius, sphere
  //const R = 6378137
  // let spodokLat = 48.59143984235794
  // let spodokLon = 22.516016082834202
  //offsets in meters
  let dn = -100;
  let de = 100;
  let latO = lat;
  let lonO = lon;
  //   } while (latO < maxLatArray);  
  // } while (lonO < minLonArray);
  
  for (let x = 0; x < 2000; x++) {
     for (let y=0; y < 3400; y++) {
     
      //Coordinate offsets in radians
      let dLat = dn / R;
      let dLon = de / (R * Math.cos((Math.PI * lat) / 180));
      //Coordinate offsets in radians for spodok
      let dspodokLat = dn / R;
      let dspodokLon = de / (R * Math.cos((Math.PI * spodokLat) / 180));
      //OffsetPosition, decimal degrees
      latO = lat + (dLat * 180) / Math.PI;
      lonO = lon + (dLon * 180) / Math.PI;
      //OffsetPosition, decimal degrees for spodok
      let dspodokLatO = spodokLat + (dspodokLat * 180) / Math.PI;
      let dspodokLonO = spodokLon + (dspodokLon * 180) / Math.PI;
      //Check if first point is higher then second point
      let spodok = []
      let vrch = []
      if(lonO<dspodokLonO && latO > dspodokLonO){
        vrch.push(lonO, latO)
        //console.log(vrch);
        spodok.push(dspodokLonO, dspodokLatO)
        //console.log(spodok);
        let part = {};
        part.vrch = vrch
        part.spodok = spodok
        //console.log(part);
        result.push(part);
      }
      
      dn = dn - 50;
      if (lonO >= minLonArray) break;
    }
    result2.push(result);
    de = de + 50;
    if (latO >= maxLatArray) break;
  }
  console.log(result);
  console.log(result2)
  console.log(result.length);

  //fs.writeFileSync(`./Data/Elastic_query/squares.json`, JSON.stringify(result2));
  let myArray = [];
for(let i = 0, len = result2.length; i < len; i++){
    for(let q = 0, len = result2[i].length; q < len; q++){
        //console.log(result2[i][q])
        myArray.push(result2[i][q]);
      }
}
fs.writeFileSync(`./Data/Elastic_query/squares2.json`, JSON.stringify(myArray));
 }
 
 getSquares()

  //  //offsets in meters
  //  let firstdn = -50
  //  let firstde = 50
  //  //Coordinate offsets in radians
  //  let firstdLat = firstdn/R
  //  let firstdLon = firstde / (R * Math.cos((Math.PI * lat) / 180));
  //  //OffsetPosition, decimal degrees
  //  let spodokLat = lat + firstdLat * 180/Math.PI
  //  let spodokLon = lon + firstdLon * 180/Math.PI 
  //  console.log(spodokLat)
  //  console.log(spodokLon)

//   let bounding = geolib.getDistance(
//     { latitude: 49.45112756926032, longitude: 22.515337 },
//     { latitude: 49.45157672690238, longitude: 22.516016082834202 }
// );
// console.log(bounding)
  // do {

  //   de = de + 50;
  //   do {

  //     dn = dn - 50;
  //     //Coordinate offsets in radians
  //     let dLat = dn / R;
  //     let dLon = de / (R * Math.cos((Math.PI * lat) / 180));
  //     //Coordinate offsets in radians for spodok
  //     let dspodokLat = dn / R;
  //     let dspodokLon = de / (R * Math.cos((Math.PI * spodokLat) / 180));
  //     //OffsetPosition, decimal degrees
  //     latO = lat + (dLat * 180) / Math.PI;
  //     lonO = lon + (dLon * 180) / Math.PI;
  //     //OffsetPosition, decimal degrees for spodok
  //     let dspodokLatO = spodokLat + (dspodokLat * 180) / Math.PI;
  //     let dspodokLonO = spodokLon + (dspodokLon * 180) / Math.PI;
  //     //Check if first point is higher then second point
  //     let spodok = []
  //     let vrch = []
  //       vrch.push(lonO,latO)
  //       spodok.push(dspodokLonO,dspodokLatO)
  //       let part = {};
  //       part.vrch  = vrch
  //       part.spodok = spodok
  //       //console.log(part);
  //       result.push(part); 
  //   } while (latO < maxLatArray);  
  // } while (lonO < minLonArray);

  //console.log(result);