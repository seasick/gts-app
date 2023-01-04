#!/usr/bin/env node
// This script gets forecast data from openweathermap
const {writeFile} = require('fs/promises');
const path = require('path');
const openweathermapForecast = require('../lib/openweathermap/forecast');


(async () => {
  const openweatherApiKey = process.argv[2];
  const lat = process.argv[3];
  const lon = process.argv[4];
  const stationName = process.argv[5];
  const stationId = process.argv[6];

  // Get forecast
  let forecast = await openweathermapForecast(openweatherApiKey, lat, lon);

  // If we have a invalid API key, we will just add an empty forecast into the file.
  if (forecast.cod === 401) {
    console.warn(forecast.message || 'Invalid API key');
    console.warn('Empty array written to forecast.json');

    return writeFile(
      path.resolve(__dirname, '../public/data/forecast.json'),
      JSON.stringify([])
    )
  }

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
