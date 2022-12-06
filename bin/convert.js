// This script collects and converts csv data from zamg-measurment-collector
const {writeFile} = require('fs/promises');
const path = require('path');
const aggregateZAMG = require('../lib/zamg');
const aggregateMeteoblue = require('../lib/meteoblue');
const aggregateLoxone = require('../lib/loxone');


(async () => {

  // Add ZAMG data
  console.log('Aggregate ZAMG data');
  let data = await aggregateZAMG();

  // Add meteoblue data
  console.log('Aggregate Meteoblue data');
  data = data.concat(await aggregateMeteoblue());

  // Add Loxone data
  // console.log('Aggregate loxone data');
  // data = data.concat(await aggregateLoxone());

  await writeFile(
    path.resolve(__dirname, '../public/data/aggregated.json'),
    JSON.stringify(data)
  );

})();
