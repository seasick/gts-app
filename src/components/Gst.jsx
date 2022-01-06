import {Alert, AlertTitle} from '@mui/material';
import useData from '../hooks/useData';
import {calculateGstForStation, calculateWeightedGstForStation} from '../gst';


export default function Gst({mode, station}) {
  const [data, isLoading] = useData();
  let value;

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (mode === 'gts') {
    value = calculateGstForStation(data, station);
  } else if (mode === 'weighted_gts') {
    value = calculateWeightedGstForStation(data, station);
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
    Aktuelle Grünlandtemperatursumme ist <b>{Math.round(value * 100) / 100}</b>
  </Alert>;
}
