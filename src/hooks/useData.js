import {useEffect, useState} from "react";


export default function useData() {
  const[data, setData] = useState([]);
  const[isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async() => {
      setIsLoading(true);

      const response = await fetch('/gts-app/data/aggregated.json');
      const json = await response.json();

      setData(json);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return [data, isLoading];
}
