import {FormControl, InputLabel, ListSubheader, MenuItem, Select} from '@mui/material';
import useStations from '../hooks/useStations';


const now = new Date();
const years = Array.from({length: parseInt(now.getFullYear()) - 2022 + 1}, (e, i) => 2022 + i);

export default function Form({station, mode, year, onChange}) {
  const [stations, isLoading] = useStations(year);

  if (isLoading) {
    return <div>Loading</div>;
  }

  const handleStationChange = (event) => {
    onChange({
      mode: mode,
      station: event.target.value,
      year,
    });
  };

  const handleModeChange = (event) => {
    onChange({
      mode: event.target.value,
      station,
      year,
    });
  };

  const handleYearChange = (event) => {
    onChange({
      mode,
      station,
      year: event.target.value,
    });
  }

  // group the stations by source
  const sources = stations.reduce((prev, curr) => {
    prev[curr.source] = prev[curr.source] || [];
    prev[curr.source].push(curr);
    return prev;
  }, {});
  const sourceKeys = Object.keys(sources);

  sourceKeys.sort();

  return <div>

    <FormControl sx={{m: 1, width: 220}}>
      <InputLabel id="station-label">Wetter Station</InputLabel>
      <Select
        labelId="station-label"
        id="station"
        value={station}
        label="Wetter Station"
        onChange={handleStationChange}
      >
        {sourceKeys.map((source) => {
          return [
            <ListSubheader>{source}</ListSubheader>,
            sources[source].map((station) => {
              return <MenuItem key={station.value} value={station.value}>{station.label}</MenuItem>;
            })
          ]
        })}
      </Select>
    </FormControl>

    <FormControl sx={{m: 1, width: 220}}>
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

    <FormControl sx={{m: 1, width: 220}}>
      <InputLabel id="year-label">Jahr</InputLabel>
      <Select
        labelId="year-label"
        id="year"
        value={year}
        label="Jahr"
        onChange={handleYearChange}
      >
        {years.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
      </Select>
    </FormControl>
  </div>;
}
