// This script collects and converts csv data from zamg-measurment-collector
const {readdir, readFile, writeFile} = require('fs/promises');
const Papa = require('papaparse');
const path = require('path');


const median = (values) => {
  if(values.length ===0) {
    throw new Error("No inputs");
  }

  values.sort(function(a,b){
    return a-b;
  });

  var half = Math.floor(values.length / 2);

  if (values.length % 2) {
    return values[half];
  }

  return (values[half - 1] + values[half]) / 2.0;
}

(async () => {
  const dir = 'data/zamg-measurment-collector/data';
  const files = await readdir(dir);
  let data = [];

  for (let i = 0; i < files.length; ++i) {
    // TODO Do not work on data of the current day
    const csv = await readFile(path.join(dir, files[i]));
    const parsed = Papa.parse(csv.toString().trim(), {
      header: true
    });
    const grouped = {};

    parsed.data.forEach((row) => {
      grouped[row.Station] = grouped[row.Station] || {
        date: files[i].substring(0, files[i].length - 4),
        stationName: row.Name,
        stationId: parseInt(row.Station, 10),
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

  await writeFile(
    path.resolve(__dirname, '../public/data/aggregated.json'),
    JSON.stringify(data)
  );

})();
