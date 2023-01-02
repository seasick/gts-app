const {readdir, readFile} = require('fs/promises');
const Papa = require('papaparse');
const path = require('path');
const median = require('./median');


module.exports = async function aggregateZAMG(year) {
  const dir = 'data/zamg-measurment-collector/data';
  const files = await readdir(dir);
  let data = [];

  for (let i = 0; i < files.length; ++i) {
    if (!files[i]) {
      continue;
    }

    // TODO Do not work on data of the current day
    const csv = await readFile(path.join(dir, files[i]));
    const parsed = Papa.parse(csv.toString().trim(), {
      header: true
    });
    const grouped = {};
    const date = files[i].substring(0, files[i].length - 4);
    const currentYear = parseInt(date.substring(0, 4), 10);

    if (currentYear !== year) {
      continue;
    }

    parsed.data.forEach((row) => {
      grouped[row.Station] = grouped[row.Station] || {
        source: 'zamg',
        date,
        stationName: row.Name,
        stationId: `zamg-${row.Station}`,
        temperature: []
      };

      grouped[row.Station].temperature.push(parseFloat(row['T °C']));
    });

    data = data.concat(Object.values(grouped).map((row) => {
      const sum = row.temperature.reduce((a, b) => a + b, 0);
      const mean = (sum / row.temperature.length) || 0;
      const medianValue = median(row.temperature);

      delete row.temperature;

      return {
        ...row,
        meanTemperature: mean,
        medianTemperature: medianValue
      };
    }));
  }

  return data;
};
