export function getGstValuesForStation(data, station) {
  const values = [];

  data.forEach((row) => {
    // Filter for station
    if (row.stationId !== station) {
      return;
    }

    let value = row.meanTemperature;

    // Only add positive values
    if (row.meanTemperature < 0) {
      value = 0;
    }

    values.push({
      label: row.date,
      value: value,
      temperatur: row.meanTemperature
    });
  });

  return values;
}


export function calculateGstForStation(data, station) {
  const values = getGstValuesForStation(data, station);

  return values.reduce((prev, curr) => prev + curr.value, 0);
}

export function getWeightedGstValuesForStation(data, station) {
  const values = [];

  data.forEach((row) => {
    // Filter for station
    if (row.stationId !== station) {
      return;
    }

    const weight = getWeight(row);
    let value = row.meanTemperature;

    // Only add positive values
    if (row.meanTemperature >= 0) {
      value *= weight;
    } else {
      value = 0;
    }

    values.push({
      label: row.date,
      value: value,
      temperatur: row.meanTemperature
    });
  });

  return values;
}

export function calculateWeightedGstForStation(data, station) {
  const values = getWeightedGstValuesForStation(data, station);

  return values.reduce((prev, curr) => prev + curr.value, 0);
}


function getWeight(row) {
  let [,month] = row.date.split('-');
  let weight = 1;

  month = parseInt(month);

  // weight should be 0.5 for Janurary and 0.75 for February
  if (month === 1) {
    weight = 0.5;
  } else if (month === 2) {
    weight = 0.75;
  }

  return weight;
}
