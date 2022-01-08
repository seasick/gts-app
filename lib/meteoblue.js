const median = require('./median');
const {readdir, readFile} = require('fs/promises');


const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.substring(1);
};

module.exports = async function aggregateMeteoblue() {
  const currentYear = new Date().getFullYear();
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
        source: 'meteoblue',
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
