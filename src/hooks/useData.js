import {useEffect, useState} from "react";


export default function useData(year) {
  const[data, setData] = useState([]);
  const[isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async() => {
      setIsLoading(true);

      const file = `aggregated-${year}.json`;
      const path = `/gts-app/data/${file}`;
      const response = await fetch(path);
      const json = await response.json();

      setData(json);
      setIsLoading(false);
    };

    fetchData();
  }, [year]);

  return [data, isLoading];
}
