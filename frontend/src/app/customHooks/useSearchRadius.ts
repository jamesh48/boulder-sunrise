import { useState } from 'react';

const useSearchRadius = (initialState: number = 5) => {
  const [searchRadius, setSearchRadius] = useState(initialState);
  const [confirmedSearchRadius, setConfirmedSearchRadius] =
    useState(initialState);

  return {
    getters: { searchRadius, confirmedSearchRadius },
    setters: { setSearchRadius, setConfirmedSearchRadius },
  };
};

export default useSearchRadius;
