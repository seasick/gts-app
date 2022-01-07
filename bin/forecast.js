#!/usr/bin/env node
// This script gets forecast data from openweathermap
const {writeFile} = require('fs/promises');
const path = require('path');
const openweathermap = require('../lib/openweathermap');


(async () => {
  const openweatherApiKey = process.argv[2];
  const lat = process.argv[3];
  const lon = process.argv[4];
  const stationName = process.argv[5];
  const stationId = process.argv[6];

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
      meanTemperature: cast.temp.day,
      medianTemperature: cast.temp.day,
      stationName,
      stationId,
    };
  });

  await writeFile(
    path.resolve(__dirname, '../public/data/forecast.json'),
    JSON.stringify(forecast)
  )

})();
