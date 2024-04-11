import { useState } from 'react';

const useSortOrder = (initialState: string = 'ASC') => {
  const [sortOrder, setSortOrder] = useState(initialState);
  const [confirmedSortOrder, setConfirmedSortOrder] = useState(initialState);

  return {
    getters: { sortOrder, confirmedSortOrder },
    setters: { setSortOrder, setConfirmedSortOrder },
  };
};

export default useSortOrder;
