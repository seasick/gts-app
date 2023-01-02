// This script collects and converts csv data from zamg-measurment-collector
const {writeFile} = require('fs/promises');
const path = require('path');
const aggregateZAMG = require('../lib/zamg');
const aggregateMeteoblue = require('../lib/meteoblue');
const aggregateLoxone = require('../lib/loxone');
const aggregateOpenweathermap = require('../lib/openweathermap/aggregate');


(async () => {
  const today = new Date();

  for (let year = 2022; year <= today.getFullYear(); ++year) {
    // Add ZAMG data
    console.log(`Aggregate ZAMG data (${year})`);
    let data = await aggregateZAMG(year);

    // Add openweather data
    console.log(`Aggregate openweather data (${year})`);
    data = data.concat(await aggregateOpenweathermap(year));

    // Add Loxone data
    // console.log('Aggregate loxone data');
    // data = data.concat(await aggregateLoxone());

    await writeFile(
      path.resolve(__dirname, `../public/data/aggregated-${year}.json`),
      JSON.stringify(data)
    );
  }


})();
