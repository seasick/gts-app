import {FormControl, InputLabel, MenuItem, Select} from '@mui/material';
import useStations from '../hooks/useStations';


export default function Form({station, mode, onChange}) {
  const [stations, isLoading] = useStations();

  if (isLoading) {
    return <div>Loading</div>;
  }

  const handleStationChange = (event) => {
    onChange({
      mode: mode,
      station: event.target.value,
    });
  };

  const handleModeChange = (event) => {
    onChange({
      mode: event.target.value,
      station,
    });
  }

  return <div>

    <FormControl fullWidth>
      <InputLabel id="station-label">Wetter Station</InputLabel>
      <Select
        labelId="station-label"
        id="station"
        value={station}
        label="Wetter Station"
        onChange={handleStationChange}
      >
        {stations.map((station) => {
          return <MenuItem key={station.value} value={station.value}>{station.label}</MenuItem>;

        })}
      </Select>
    </FormControl>

    <FormControl fullWidth>
      <InputLabel id="mode-label">Modus</InputLabel>
      <Select
        labelId="mode-label"
        id="mode"
        value={mode}
        label="Modus"
        onChange={handleModeChange}
      >
        <MenuItem value="gts">Grünlandtemperatursumme</MenuItem>
        <MenuItem value="weighted_gts">Gewichtete Grünlandtemperatursumme</MenuItem>
      </Select>
    </FormControl>
  </div>;
}
