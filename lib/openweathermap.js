const https = require('https');
const qs = require('querystring');


module.exports = async function(apiKey, lat, lon) {
  const exclude = ['current', 'minutely', 'hourly'];
  const url = 'https://api.openweathermap.org/data/2.5/onecall?' + qs.stringify({
    lat: lat,
    lon: lon,
    cnt: 1,
    appid: apiKey,
    exclude: exclude.join(','),
    units: 'metric',
  });

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let body = '';

      res.on('data', (data) => {
        body += data.toString();
      });

      res.on('end', () => resolve(JSON.parse(body)));
    }).on('error', reject);
  });

}
