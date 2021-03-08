const { Client } = require("@elastic/elasticsearch");
const elasticsearch_client = new Client({ node: "http://localhost:9200" });
const fs = require("fs");
const geolib = require('geolib');
const _ = require('lodash');
let squares = require("../../../Data/Elastic_query/geoPointsC/presov_12");
squares = squares.features

let s = []
squares.map(e=>{
    if(e.type && e.id)
    s.push(e)
})
// fs.writeFileSync(
//     `./Data/Elastic_query/try/Points.json`,
//     JSON.stringify(s)
// );

let deleteArray = []
let arrayFinal = []
squares = s
console.log(squares.length)

squares.map(e => {
    let array = []
    let objFinal = {}

    squares.map(k => {
        let obj = {}
        if (geolib.isPointWithinRadius(
            { latitude: e.geometry.coordinates[1], longitude: e.geometry.coordinates[0] },
            { latitude: k.geometry.coordinates[1], longitude: k.geometry.coordinates[0] },
            25
        )) {
            let position = squares.indexOf(k)
            obj.position = position
           
        }
        if (!_.isEmpty(obj))
            array.push(obj)
    })
     let id = e.id
     objFinal.id = id;
    if (array.length > 1) {//musi mat iba saba
        //getIdByPosition
        let arr=[]
        array.map(e => {
            e = e.position
            if (squares[e].id !== id && id != undefined) {
                deleteArray.push({ id: id, position: e+14 }) 
            }
            arr.push({ id: id, position: e+14 })  
        })
        objFinal.array = arr
    }else{
        objFinal.array = array
    }
    arrayFinal.push(objFinal) //
})
fs.writeFileSync(
    `./Data/Elastic_query/try/filterPoints.json`,
    JSON.stringify(arrayFinal)
);

function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
        return ele != value;
    });
}


//odstranenie okruhu
let result = []
arrayFinal.map(e=>{
    if(e.array.length > 1){
        let len=e.array.length
        for(let x=1; x<len;x++){
            squares = arrayRemove(squares,squares[e.array[x].position])
            e = e.array.splice(x, 1); 
            len = len-1
        }
    }
})
//console.log(e.array[x].position)
            //console.log(squares[e.array[x].position])


fs.writeFileSync(
    `./Data/Elastic_query/try/filterPoints2.json`,
    JSON.stringify(arrayFinal)
);
let ob ={"type":"FeatureCollection","name":"Points","features":squares}
fs.writeFileSync(
    `./Data/Elastic_query/try/filterSquares.json`,
    JSON.stringify(ob)
);
console.log(squares.length)
console.log(deleteArray)
//Filter pre duplicitne
let filteredResult = result.reduce((acc, current) => {
    const x = acc.find(
        (item) => item.id === current.id
    );
    if (!x) {
        return acc.concat([current]);
    } else {
        return acc;
    }
}, []);
//console.log(filteredResult.length)
// array.map(x=>{
//     deleteArray.map(e =>{
//         delete array[x]
//    })
// })

// fs.writeFileSync(
//     `./Data/Elastic_query/try/filterPoints2.json`,
//     JSON.stringify(filteredResult)
// );
//console.log(filteredResult.length)
