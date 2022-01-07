// This script collects and converts csv data from zamg-measurment-collector
const {writeFile} = require('fs/promises');
const path = require('path');
const aggregateZAMG = require('../lib/zamg');
const aggregateMeteoblue = require('../lib/meteoblue');
const openweathermap = require('../lib/openweathermap');


(async () => {
  const openweatherApiKey = process.argv[2];
  const lat = process.argv[3];
  const lon = process.argv[4];

  // Add ZAMG data
  console.log('Aggregate ZAMG data');
  let data = await aggregateZAMG();

  // Add meteoblue data
  console.log('Aggregate Meteoblue data');
  data = data.concat(await aggregateMeteoblue());

  // Get forecast
  let forecast = await openweathermap(openweatherApiKey, lat, lon);
  forecast = forecast.daily.map((cast) => {
    const date = new Date(cast.dt * 1000);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    return {
      date: dateString,
      stationName: 'Zistersdorf',
      stationId: 'meteoblue-zistersdorf',
      meanTemperature: cast.temp.day,
      medianTemperature: cast.temp.day
    };
  });

  await writeFile(
    path.resolve(__dirname, '../public/data/aggregated.json'),
    JSON.stringify(data)
  );
  await writeFile(
    path.resolve(__dirname, '../public/data/forecast.json'),
    JSON.stringify(forecast)
  )

})();
