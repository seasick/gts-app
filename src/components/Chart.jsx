import {CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {getGstValuesForStation, getWeightedGstValuesForStation} from "../gst";
import useData from "../hooks/useData";
import useForecast from "../hooks/useForecast";


export default function Chart({mode, station, year}) {
  const [data, isLoading] = useData(year);
  const [forecast] = useForecast();
  let values = [];
  let forecastValues = [];
  let valueLength;

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (mode === 'gts') {
    values = getGstValuesForStation(data, station);
    forecastValues = getGstValuesForStation(forecast, station);
  } else if (mode === 'weighted_gts') {
    values = getWeightedGstValuesForStation(data, station);
    forecastValues = getWeightedGstValuesForStation(forecast, station);
  }

  valueLength = values.length;

  let sum = 0;
  // Add culmative value
  values.forEach((value) => {
    value.cumulative = value.value + sum;
    sum += value.value;
  });

  // add prognosis
  values = values.concat(forecastValues.map((f) => {
    const obj = {
      label: f.label,
      forecastValue: f.value,
      forecastTemperatur: f.temperatur,
      forecastCumulative: f.value + sum,
    };

    sum += f.value;

    return obj;
  }));

  if (valueLength && values.length > valueLength) {
    // Add first prognosis to last real data point
    values[valueLength - 1].forecastCumulative = values[valueLength - 1].cumulative;
    values[valueLength - 1].forecastTemperatur = values[valueLength - 1].temperatur;
    values[valueLength - 1].hideForecast = true;
  }

  return <ResponsiveContainer width="100%" height="80%">
    <LineChart
      data={values}
      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
    >
      <YAxis domain={[-5, parseInt(sum * 1.2)]} />
      <XAxis dataKey="label" />
      <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" />
      <ReferenceLine y={0} stroke="grey" strokeDasharray="4" />
      <ReferenceLine y={200} stroke="green" strokeDasharray="4" />
      <Tooltip formatter={(value, name, props) => {

        if (props.payload.hideForecast && props.dataKey.indexOf('forecast') === 0) {
          return [];
        }

        let suffix = '';

        if (name === 'Temperatur') {
          suffix = '° C';
        }

        return Math.round(value * 100) / 100 + suffix;
      }} />
      <Line
        type="monotone"
        dataKey="cumulative"
        name="Grünlandtemperatursumme"
        stroke="#82ca9d"
      />
      <Line
        type="monotone"
        dataKey="temperatur"
        name="Temperatur"
        stroke="#8884d8"
      />
      <Line
        type="monotone"
        dataKey="forecastCumulative"
        name="Grünlandtemperatursumme Prognose"
        stroke="#82ca9d"
        strokeDasharray="8"
      />
      <Line
        type="monotone"
        dataKey="forecastTemperatur"
        name="Temperatur Prognose"
        stroke="#8884d8"
        strokeDasharray="8"
      />

    </LineChart>
  </ResponsiveContainer>;
}
