import './App.css';
import {useEffect, useState} from 'react';


function App() {
  const [data, setData] = useState(null);
  const [station, setStation] = useState(11036);
  const [useWeights, setUseWeights] = useState(false);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    fetch('/data/aggregated.json')
        .then((response) => response.json())
        .then((json) => {
          const tmp = [];
          const tmpStations = json.reduce((prev, curr) => {
            if (tmp.indexOf(curr.stationId) === -1) {
              prev.push({
                value: parseInt(curr.stationId),
                label: curr.stationName,
              });
              tmp.push(curr.stationId);
            }

            return prev;
          }, []);

          tmpStations.sort((a, b) => a.label > b.label);

          setData(json);
          setStations(tmpStations);
        });
  }, []);

  if (!data) {
    return <div>Loading</div>;
  }

  const values = [];

  // TODO Calculate the GST
  data.forEach((row) => {
    // Filter for station
    if (row.stationId !== station) {
      return;
    }

    // Should months be weighted?
    if (useWeights) {
      // TODO
    }

    // Only add positive values
    if (row.meanTemperature >= 0) {
      values.push(row.meanTemperature);
    }
  });

  return (
    <div className="App">
      <div>
        <select value={station} onChange={(event) => {
          setStation(parseInt(event.target.value, 10));
        }}>
          {stations.map((station) => {
            return <option value={station.value} key={station.value}>
              {station.label}
            </option>;
          })}
        </select>
      </div>

      <div>
        Grünlandtemperatursumme: <br />
        {Math.round(values.reduce((a, b) => a + b, 0) * 100) / 100}
      </div>
    </div>
  );
}

export default App;
