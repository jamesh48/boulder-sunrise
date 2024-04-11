import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Close } from '@mui/icons-material';
import {
  Box,
  OutlinedInput,
  Chip,
  FormControl,
  InputLabel,
} from '@mui/material';
import BlockingTooltip from '../CustomComponents/BlockingTooltip';
import BasicSelect from '../CustomComponents/BasicSelect';
import {
  getSearchAdditionalOptionsOpen,
  setSearchAdditionalOptionsOpen,
  getUserLocation,
} from '@/app/appSlice';
import useSortOrder from '@/app/customHooks/useSortOrder';
import useSortBy from '@/app/customHooks/useSortBy';
import useSearchRadius from '@/app/customHooks/useSearchRadius';

interface SearchAdditionalOptionsProps {
  eventQuery: string;
  isInputFocused: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  debouncedEventQuery: string;
  handleEventQueryChange: (input: string) => void;
  handleInputFocus: () => void;
  handleInputBlur: () => void;
  handleSubmit: (
    searchRadius: number,
    sortBy: string,
    sortOrder: string
  ) => void;
}

const SearchAdditionalOptions = (props: SearchAdditionalOptionsProps) => {
  const dispatch = useDispatch();
  const anchorRef = useRef(null);
  const userLocation = useSelector(getUserLocation);
  const searchAdditionalOptionsOpen = useSelector(
    getSearchAdditionalOptionsOpen
  );

  const {
    getters: { searchRadius },
    setters: { setSearchRadius },
  } = useSearchRadius();

  const {
    getters: { sortOrder },
    setters: { setSortOrder },
  } = useSortOrder();

  const {
    getters: { sortBy },
    setters: { setSortBy },
  } = useSortBy();

  const handleSearchRadius = (input: string) => {
    if (!isNaN(Number(input))) {
      setSearchRadius(Number(input));
    }
  };

  const handleSortBy = (input: string) => {
    setSortBy(input);
  };

  const handleSortOrder = (input: string) => {
    setSortOrder(input);
  };

  return (
    <Box
      sx={{
        flex: 0.1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <OutlinedInput
        sx={{
          height: '2rem',
          ...(() => {
            if (searchAdditionalOptionsOpen) {
              return { pointerEvents: 'none' };
            }
            if (props.isInputFocused) {
              return { bgcolor: 'white', zIndex: 1500 };
            }
            return {};
          })(),
        }}
        name="eventQuery"
        value={props.eventQuery}
        onChange={(ev) => props.handleEventQueryChange(ev.currentTarget.value)}
        placeholder="Event Search Query"
        inputProps={{
          sx: { textAlign: 'center', zIndex: 1502 },
        }}
        onFocus={props.handleInputFocus}
        onBlur={props.handleInputBlur}
        inputRef={props.inputRef}
      />
      {props.debouncedEventQuery ? (
        <Chip
          label="Additional Search Options"
          variant="filled"
          onClick={() => dispatch(setSearchAdditionalOptionsOpen(true))}
          sx={{
            border: '.5px solid blue',
            mt: '.25rem',
            cursor: 'pointer',
          }}
          ref={anchorRef}
        />
      ) : null}
      {props.eventQuery ? (
        <BlockingTooltip
          open={searchAdditionalOptionsOpen}
          anchorRef={anchorRef}
        >
          <Box sx={{ padding: '.5rem' }}>
            <Box
              sx={{
                width: '100%',
                borderBottom: '1px solid black',
                display: 'flex',
                justifyContent: 'flex-end',
                mb: '.5rem',
              }}
            >
              <Close
                onClick={() => dispatch(setSearchAdditionalOptionsOpen(false))}
                sx={{ cursor: 'pointer' }}
              />
            </Box>
            <form
              onSubmit={(ev) => {
                ev.preventDefault();
                dispatch(setSearchAdditionalOptionsOpen(false));
                props.handleSubmit(searchRadius, sortBy, sortOrder);
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{ py: '.25rem' }}>
                  <FormControl fullWidth>
                    <InputLabel>Radius from {userLocation} (miles)</InputLabel>
                    <OutlinedInput
                      fullWidth
                      label={`Radius from ${userLocation} (miles)`}
                      value={searchRadius}
                      onChange={(ev) =>
                        handleSearchRadius(ev.currentTarget.value)
                      }
                      autoFocus
                    />
                  </FormControl>
                </Box>
                <Box sx={{ mt: '.5rem' }}>
                  <BasicSelect
                    value={sortBy}
                    label="Sort By"
                    handleChange={handleSortBy}
                    selectItems={[
                      { title: 'Relevance', value: 'relevance' },
                      { title: 'Time', value: 'datetime' },
                    ]}
                  />
                </Box>
                {sortBy === 'datetime' ? (
                  <Box sx={{ mt: '.5rem' }}>
                    <BasicSelect
                      value={sortOrder}
                      label="Sort Order"
                      handleChange={handleSortOrder}
                      selectItems={[
                        { title: 'Soonest First', value: 'ASC' },
                        { title: 'Latest First', value: 'DESC' },
                      ]}
                    />
                  </Box>
                ) : null}

                <Box sx={{ marginTop: '.5rem' }}>
                  <OutlinedInput
                    type="submit"
                    value="Ok"
                    fullWidth
                    inputProps={{ sx: { cursor: 'pointer' } }}
                  />
                </Box>
              </Box>
            </form>
          </Box>
        </BlockingTooltip>
      ) : null}
    </Box>
  );
};

export default SearchAdditionalOptions;
