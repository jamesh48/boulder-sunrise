import { useState } from 'react';

const useSortBy = (initialState: string = 'relevance') => {
  const [sortBy, setSortBy] = useState(initialState);
  const [confirmedSortBy, setConfirmedSortBy] = useState(initialState);

  return {
    getters: { sortBy, confirmedSortBy },
    setters: { setSortBy, setConfirmedSortBy },
  };
};

export default useSortBy;
