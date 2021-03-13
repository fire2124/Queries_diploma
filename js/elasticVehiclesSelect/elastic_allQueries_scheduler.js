const { query } = require("./helper")
const schedule = require('node-schedule');

function elastic15minutes() {// 15 min
    setInterval(function () {
        //week, day, hours, minutes, sec
        query(0, 0, 0, 15, 0)
    }, 900000);

}

function elastic1hour() {// 1 hod 
    schedule.scheduleJob('0 2 * * * *', function () {
        //week, day, hours, minutes, sec
        query(0, 0, 1, 0, 0)
        console.log('This job was supposed to run every hour in 02 minutes' + ', but actually ran at ' + new Date());
    });
}

function elastic3hours() {// 3 hod 
    setInterval(function () {
        //week, day, hours, minutes, sec
        query(0, 0, 3, 0, 0)
    }, 10800000);
}

function elastic5_9i() {// 5-9i
    schedule.scheduleJob('0 1 9 * * *', function () {
        //week, day, hours, minutes, sec
        query(0, 0, 4, 0, 0)
        console.log('This job was supposed to run at 9:02:00' + ', but actually ran at ' + new Date());
    });
}

function elastic14_18i() {//14-18i
    schedule.scheduleJob('0 1 18 * * *', function () {
        //week, day, hours, minutes, sec
        query(0, 0, 4, 0, 0)
        console.log('This job was supposed to run at 18:02:00' + ', but actually ran at ' + new Date());
    });
}

function elastic1day() {//1 day
    schedule.scheduleJob('0 0 2 * * *', function () {
        //week, day, hours, minutes, sec
        query(0, 1, 0, 0, 0)
        console.log('This job was supposed to run at 2:00:00' + ', but actually ran at ' + new Date());
    });
}
function elastic1week() {//1week
    schedule.scheduleJob('* 30 23 * * 7', function () {
        //week, day, hours, minutes, sec
        query(1, 0, 0, 0, 0)
        console.log('This job was supposed to run every sunday at 23:30:00' + ', but actually ran at ' + new Date());
    });
}
function elastic1month() {//4week 
    schedule.scheduleJob('* 1 2 1 * *', function () {
        //week, day, hours, minutes, sec
        query(4, 0, 0, 0, 0)
        console.log('This job was supposed to run every first day in month at 2 am' + ', but actually ran at ' + new Date());
    });
}
module.exports.elastic15minutes = elastic15minutes
module.exports.elastic1hour = elastic1hour
module.exports.elastic3hours = elastic3hours
module.exports.elastic5_9i = elastic5_9i
module.exports.elastic14_18i = elastic14_18i
module.exports.elastic1day = elastic1day
module.exports.elastic1week = elastic1week
module.exports.elastic1month = elastic1month