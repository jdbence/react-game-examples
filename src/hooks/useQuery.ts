import { useLocation } from "react-router-dom";

const useQuery = () => {
  const loc = useLocation();
  return new URLSearchParams(loc.search);
};

export default useQuery;
