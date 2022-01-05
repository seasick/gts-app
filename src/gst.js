export function calculateGstForStation(data, station) {
  const values = [];

  data.forEach((row) => {
    // Filter for station
    if (row.stationId !== station) {
      return;
    }

    // Only add positive values
    if (row.meanTemperature >= 0) {
      values.push(row.meanTemperature);
    }
  });

  return values.reduce((a, b) => a + b, 0) * 100;
}

export function calculateWeightedGstForStation(data, station) {
  const values = [];

  data.forEach((row) => {
    // Filter for station
    if (row.stationId !== station) {
      return;
    }

    let [,month] = row.date.split('-');
    let weight = 1;

    month = parseInt(month);

    // weight should be 0.5 for Janurary and 0.75 for February
    if (month === 1) {
      weight *= 0.5;
    } else if (month === 1) {
      weight *= 0.75;
    }

    // Only add positive values
    if (row.meanTemperature >= 0) {
      values.push(row.meanTemperature * weight);
    }
  });

  return values.reduce((a, b) => a + b, 0) * 100;

}
