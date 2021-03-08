let squares2 = require("../../../Data/Elastic_query/squares2.json");
let coordinates = require("../../../Data/Elastic_query/coordinates.json");
const fs = require("fs");
const geolib = require("geolib");

coordinates = coordinates.features

let finalResult = []
squares2.map(x=>{
    coordinates.map(e=>{
    
        if(geolib.isPointInPolygon(
            {latitude: e.geometry.coordinates[1],
             longitude: e.geometry.coordinates[0]}
            ,[{ latitude: x.vrch[1], longitude: x.vrch[0] }, 
            { latitude: x.spodok[1], longitude: x.spodok[0] },
        ])){
            finalResult.push(x)
        }
    })
})
let finalResult2 = [...new Set(finalResult)];

fs.writeFileSync(`./Data/Elastic_query/squaresFinal.json`, JSON.stringify(finalResult2));




// var myArray = [];
// for(var i = 0, len = squares.length; i < len; i++){
//     for(var q = 0, len = squares[i].length; q < len; q++){
//         //console.log(squares[i][q])
//         myArray.push(squares[i][q]);
//       }
// }
// fs.writeFileSync(`./Data/Elastic_query/squares2.json`, JSON.stringify(myArray));
