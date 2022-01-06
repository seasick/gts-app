import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis} from "recharts";
import {getGstValuesForStation, getWeightedGstValuesForStation} from "../gst";
import useData from "../hooks/useData";


export default function Chart({mode, station}) {
  const [data, isLoading] = useData();
  let values = [];

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (mode === 'gts') {
    values = getGstValuesForStation(data, station);
  } else if (mode === 'weighted_gts') {
    values = getWeightedGstValuesForStation(data, station);
  }

  let sum = 0;
  // Add culmative value
  values.forEach((value) => {
    value.cumulative = value.value + sum;
    sum += value.value;
  });

  return <ResponsiveContainer width="100%" height="80%">
    <LineChart
      data={values}
      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
    >
      <XAxis dataKey="label" />
      <CartesianGrid stroke="#f5f5f5" />
      <Tooltip formatter={(value, name) => {
        let suffix = '';

        if (name === 'Temperatur') {
          suffix = '° C';
        }

        return Math.round(value * 100) / 100 + suffix
      }} />
      <Line
        type="monotone"
        dataKey="cumulative"
        name="Grünlandtemperatursumme"
        stroke="#82ca9d"
        yAxisId={0}
      />
      <Line
        type="monotone"
        dataKey="temperatur"
        name="Temperatur"
        stroke="#8884d8"
        yAxisId={0}
      />
    </LineChart>
  </ResponsiveContainer>;
}
