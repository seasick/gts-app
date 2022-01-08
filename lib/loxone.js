const https = require('https');
const median = require('./median');


module.exports = async function() {
  return new Promise((resolve, reject) => {
    const url = 'https://collect-temperature-measurment.herokuapp.com/measurements';

    https.get(url, (res) => {
      let body = '';

      res.on('data', (d) => {
        body += d.toString();
      });

      res.on('end', () => {
        const parsed = JSON.parse(body);
        const aggregation = {};

        // `parsed` should contain hourly measurement data.
        // We need to aggregate it into daily data
        parsed.forEach((row) => {
          const day = row.created.substring(0, 10);

          aggregation[day] = aggregation[day] || {
            values: [],
            date: day,
            stationName: day.station,
            stationId: day.station,
          };
          aggregation[day].values.push(row.value);
        });

        resolve(Object.keys(aggregation).map((day) => {
          const agg = aggregation[day];
          const sum = agg.values.reduce((a, b) => a + b, 0);
          const mean = (sum / agg.values.length) || 0;
          const medianValue = median(agg.values);

          return {
            date: day,
            stationName: agg.stationName,
            stationId: agg.stationId,
            meanTemperature:mean,
            medianTemperature: medianValue,
          };
        }));
      });
    }).on('error', reject);

  });
};
