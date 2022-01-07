// This script collects and converts csv data from zamg-measurment-collector
const {writeFile} = require('fs/promises');
const path = require('path');
const aggregateZAMG = require('../lib/zamg');
const aggregateMeteoblue = require('../lib/meteoblue');


(async () => {
  // Add ZAMG data
  console.log('Aggregate ZAMG data');
  let data = await aggregateZAMG();

  // Add meteoblue data
  console.log('Aggregate Meteoblue data');
  data = data.concat(await aggregateMeteoblue());

  await writeFile(
    path.resolve(__dirname, '../public/data/aggregated.json'),
    JSON.stringify(data)
  );

})();
