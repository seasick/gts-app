const {readdir, readFile, stat} = require('fs/promises');
const path = require('path');
const median = require('../median');


module.exports = async function aggregateZAMG(year) {
  const dir = path.resolve(__dirname, '../../data/openweathermap-collector/data');
  const stations = await readdir(dir);
  let data = [];

  for (const station of stations) {

    const files = await readdir(dir + `/${station}`);

    for (let i = 0; i < files.length; ++i) {
      if (!files[i]) {
        continue;
      }

      // TODO Do not work on data of the current day
      const jsonlPath = path.join(dir, station, files[i]);
      const jsonlContent = (await readFile(jsonlPath)).toString();
      const jsonl = jsonlContent.split('\n').filter((line) => !!line)
      const grouped = {};
      const date = files[i].substring(0, files[i].length - 6);
      const currentYear = parseInt(date.substring(0, 4), 10);

      if (currentYear !== year) {
        continue;
      }

      jsonl.forEach((row) => {
        row = JSON.parse(row);
        grouped[station] = grouped[station] || {
          source: 'openweathermap',
          date,
          stationName: station,
          stationId: `openweathermap-${station}`,
          temperature: []
        };

        grouped[station].temperature.push(row.main.temp);
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
  }

  return data;
};
