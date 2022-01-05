import useData from "./useData";


export default function useStations() {
  const [data] = useData();
  const tmp = []; // Used to store already seen station ids
  let stations = [];

  stations = data.reduce((prev, curr) => {
    if (tmp.indexOf(curr.stationId) === -1) {
      prev.push({
        value: parseInt(curr.stationId),
        label: curr.stationName,
      });

      tmp.push(curr.stationId);
    }

    return prev;
  }, []);

  stations.sort((a, b) => a.label > b.label);

  return stations;
}