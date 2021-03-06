import {Alert, AlertTitle} from '@mui/material';
import useData from '../hooks/useData';
import {calculateGstForStation, calculateWeightedGstForStation} from '../gst';
import useStations from '../hooks/useStations';


export default function Gst({mode, station}) {
  const [data, isLoading] = useData();
  const [stations] = useStations();
  let stationName;
  let value;
  let label;

  if (isLoading) {
    return <div>Loading</div>;
  }

  // Determine current station name
  for (let i = 0; i < stations.length; ++i) {
    if (stations[i].value === station) {
      stationName = stations[i].label;
      break;
    }
  }

  if (mode === 'gts') {
    value = calculateGstForStation(data, station);
    label = 'Gr├╝nlandtemperatursumme';
  } else if (mode === 'weighted_gts') {
    value = calculateWeightedGstForStation(data, station);
    label = 'gewichtete Gr├╝nlandtemperatursumme';
  } else {
    value = false;
  }

  if (value === false) {
    return <Alert severity="warning">
      <AlertTitle>Warnung</AlertTitle>
      Unbekannte Methode
    </Alert>;
  }

  return <Alert severity="info">
    <AlertTitle>Info</AlertTitle>
    Aktuelle {label} in <b>{stationName}</b> ist <b>{Math.round(value * 100) / 100}</b>
  </Alert>;
}
