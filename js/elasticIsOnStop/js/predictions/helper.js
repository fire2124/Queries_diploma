const { getIsOnStopTrain } = require("./getIsOnStopForPredictions_Train");
const { getIsOnStopSad } = require("./getIsOnStopForPredictions_SAD");
const { getIsOnStopMhd } = require("./getIsOnStopForPredictions_Mhd");
const { getIsOnStopTrain_withoutDelete } = require("./getIsOnStopForPredictions_Train_withoutDelete");
const { getIsOnStopSad_withoutDelete } = require("./getIsOnStopForPredictions_SAD_withoutDelete");
const { getIsOnStopMhd_withoutDelete } = require("./getIsOnStopForPredictions_Mhd_withoutDelete");


function query() {
    const promise1 = new Promise(function (resolve, reject) {
        getIsOnStopTrain(1)
        resolve()
        reject()
    });
    const promise2 = new Promise(function (resolve, reject) {
        resolve(getIsOnStopTrain(2))
        reject()
    });
    const promise3 = new Promise(function (resolve, reject) {
        resolve(getIsOnStopSad(1))
        reject()
    });
    const promise4 = new Promise(function (resolve, reject) {
        resolve(getIsOnStopSad(2))
        reject()
    });
    const promise5 = new Promise(function (resolve, reject) {
        resolve(getIsOnStopMhd(1))
        reject()
    });
    const promise6 = new Promise(function (resolve, reject) {
        resolve(getIsOnStopMhd(2))
        reject()
    });

    const promise7 = new Promise(function (resolve, reject) {
        resolve(getIsOnStopTrain_withoutDelete(1))
        reject()
    });
    const promise8 = new Promise(function (resolve, reject) {
        resolve(getIsOnStopTrain_withoutDelete(2))
        reject()
    });
    const promise9 = new Promise(function (resolve, reject) {
        resolve(getIsOnStopSad_withoutDelete(1))
        reject()
    });
    const promise10 = new Promise(function (resolve, reject) {
        resolve(getIsOnStopSad_withoutDelete(2))
        reject()
    });
    const promise11 = new Promise(function (resolve, reject) {
        resolve(getIsOnStopMhd_withoutDelete(1))
        reject()
    });
    const promise12 = new Promise(function (resolve, reject) {
        resolve(getIsOnStopMhd_withoutDelete(2))
        reject()
    });


    Promise.all([promise1, promise2, promise3, promise4,
        promise5, promise6, promise7, promise8, promise9,
        promise10, promise11, promise12]).then((value) => {
            console.log(value);
        });
}
query()
