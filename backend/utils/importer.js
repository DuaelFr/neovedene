const csv = require('csv-parser');
const JSONStream = require('JSONStream');
const fs = require('fs');

const cities = require('../db/cities');

function prepare() {
  console.log("Cleaning database.");
  return cities.reset();
}

function parseCSV(file, dataCallback, csvOpts = {}) {
  return new Promise((resolve) => {
    var promises = [];

    console.log("Starting to parse " + file);
    fs.createReadStream(file)
      .pipe(csv(csvOpts))
      .on('data', (data) => {
        const city = dataCallback(data);
        const promise = cities.createOrUpdate(city);
        promise.then(() => {
          console.log("[" + file + "] Imported inseeCode=" + city.inseeCode);
        });
        promises.push(promise);
      })
      .on('end', () => {
        console.log("Finished to parse " + file);
        Promise.all(promises)
          .then(() => {
            console.log("Finished to import " + file);
          })
          .then(resolve);
      });
  });
}

function parseJSON(file, dataCallback, parseOpts = {}) {
  return new Promise((resolve) => {
    var promises = [];

    console.log("Starting to parse " + file);
    fs.createReadStream(file)
      .pipe(JSONStream.parse(parseOpts))
      .on('data', (data) => {
        const city = dataCallback(data);
        const promise = cities.createOrUpdate(city);
        promise.then(() => {
          console.log("[" + file + "] Imported inseeCode=" + city.inseeCode);
        });
        promises.push(promise);
      })
      .on('end', () => {
        console.log("Finished to parse " + file);
        Promise.all(promises)
          .then(() => {
            console.log("Finished to import " + file);
          })
          .then(resolve);
      });
  });
}

module.exports = {
  parseCSV,
  parseJSON,
  prepare
};
