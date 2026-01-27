import { useEffect, useRef } from "react";

function useFetchOnMount(fetchData) {
  const stopRemount = useRef(true);

  useEffect(() => {
    if (stopRemount.current) {
      stopRemount.current = false;
      fetchData();
    }
  }, [fetchData]);
}

export default useFetchOnMount;
