import {useEffect, useState} from "react";
import isPromise from "../utils/isPromise";



const cache = {};

export default function useData(year) {
  const[data, setData] = useState({});
  const[isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (data[year]) {
      return;
    }

    // Cache[year] contains either a data object or a promise.
    if (cache[year]) {

      // If it is a promise, we are waiting for that promise to complete.
      // This way we are avoiding duplicate requests.
      if (isPromise(cache[year])) {
        cache[year].then((result) => {
          setData({
            ...data,
            [year]: result
          });
          setIsLoading(false);
        });
        return;
      }

      setData({
        ...data,
        [year]: cache[year]
      });
      return;
    }

    const fetchData = async() => {
      setIsLoading(true);

      const file = `aggregated-${year}.json`;
      const path = `/gts-app/data/${file}`;
      const response = await fetch(path);
      const json = await response.json();

      setData({
        ...data,
        [year]: json
      });
      setIsLoading(false);
      cache[year] = json;
      return json;
    };

    cache[year] = fetchData();
  }, [year, data]);

  return [data[year] || [], isLoading];
}
