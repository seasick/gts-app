import './App.css';
import useStations from './hooks/useStations';
import useData from './hooks/useData';
import {useState} from 'react';
import {calculateGstForStation, calculateWeightedGstForStation} from './gst';


function App() {
  const [station, setStation] = useState(11036);
  // eslint-disable-next-line no-unused-vars
  const [useWeights, setUseWeights] = useState(false);
  const stations = useStations();
  const [data, isLoading] = useData();

  if (isLoading) {
    return <div>Loading</div>;
  }

  let gst;

  if (useWeights) {
    gst = calculateWeightedGstForStation(data, station);
  } else {
    gst = calculateGstForStation(data, station);
  }

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
        {Math.round(gst) / 100} <br />
        Gewichtete Methode: <input
          type="checkbox"
          checked={useWeights}
          onChange={(event) => setUseWeights(event.target.checked)}
        />
      </div>
    </div>
  );
}

export default App;
