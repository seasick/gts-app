// This script collects and converts csv data from zamg-measurment-collector
const {readdir, readFile, writeFile} = require('fs/promises');
const Papa = require('papaparse');
const path = require('path');


const currentYear = new Date().getFullYear();
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

const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.substring(1);
};

const aggregateZAMG = async() => {
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

const aggregateMeteoblue = async() => {
  const dir = 'data/meteoblue-simulation-collector/data';
  const locations = await readdir(dir);
  let data = [];

  for (let i = 0; i < locations.length; ++i) {
    const files = await readdir(`${dir}/${locations[i]}`);

    for (let j = 0; j < files.length; ++j) {
      if (parseInt(files[j].substring(0, 4)) !== currentYear) {
        continue;
      }

      const json = JSON.parse(
        await readFile(`${dir}/${locations[i]}/${files[j]}`)
      );
      const values = json.reduce((prev, curr) => {
        prev.push(curr.value);
        return prev;
      }, []);

      const sum = values.reduce((a, b) => a + b, 0);
      const mean = (sum / values.length) || 0;
      const medianValue = median(values);

      data.push({
        date: files[j].substring(0, 10),
        stationName: capitalizeFirstLetter(locations[i]),
        stationId: `meteoblue-${locations[i]}`,
        meanTemperature: mean,
        medianTemperature: medianValue,
      });
    }
  }

  return data;
};

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
