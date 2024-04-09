import { useState } from 'react';

const useSearchRadius = (initialState: number) => {
  const [searchRadius, setSearchRadius] = useState(initialState);
  const [confirmedSearchRadius, setConfirmedSearchRadius] =
    useState(initialState);

  return {
    getters: { searchRadius, confirmedSearchRadius },
    setters: { setSearchRadius, setConfirmedSearchRadius },
  };
};

export default useSearchRadius;
