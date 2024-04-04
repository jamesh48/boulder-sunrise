import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ExpandLessTwoTone, ExpandMoreTwoTone } from '@mui/icons-material';
import {
  Box,
  Collapse,
  Typography,
  IconButton,
  OutlinedInput,
  TextField,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import states from 'us-state-codes';
import { Formik, Form } from 'formik';
import {
  getUserLocation,
  getUserView,
  setUserLocation,
  toggleWeatherView,
  toggleUserView,
  toggleStateSwitch,
} from '@/app/appSlice';

interface UserPreferencesProps {}

const UserPreferences = (_props: UserPreferencesProps) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [validState, setValidState] = useState('');
  const userView = useSelector(getUserView);
  const [defaultCity, defaultState] = useSelector(getUserLocation).split(',');

  return (
    <Box
      sx={{
        display: 'flex',
        flex: userView ? 0.25 : 0,
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Box
        sx={{
          borderRight: `3px solid ${theme.palette.primary.main}`,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <IconButton
          sx={{
            padding: '.5rem',
            color: theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={() => {
            dispatch(toggleUserView());
          }}
        >
          {userView ? (
            <ExpandMoreTwoTone sx={{ transform: 'rotate(-90deg)' }} />
          ) : (
            <ExpandLessTwoTone sx={{ transform: 'rotate(-90deg)' }} />
          )}
        </IconButton>
      </Box>
      <Collapse
        onExited={() => dispatch(toggleStateSwitch())}
        in={userView}
        orientation="horizontal"
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '90%',
          paddingX: userView ? '.5rem' : 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              borderBottom: `3px solid ${theme.palette.primary.main}`,
              marginBottom: '1rem',
              textAlign: 'center',
            }}
          >
            User Preferences
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Formik
            onSubmit={(values) => {
              const stateToSubmit = (() => {
                if (values.state.length === 2) {
                  return values.state.toUpperCase();
                }
                return states.getStateCodeByStateName(values.state);
              })();
              dispatch(setUserLocation(`${values.city},${stateToSubmit},USA`));
              // Opening Data View closes user view- two birds one stone
              dispatch(toggleWeatherView());
            }}
            initialValues={{ city: defaultCity, state: defaultState }}
            validate={async (values) => {
              const errors = {} as {
                state: string;
                city: string;
              };

              if (!values.city) {
                errors.city = 'Required';
              }

              const sanitizedStateCode = states.sanitizeStateCode(values.state);

              const sanitizedStateName = states.sanitizeStateName(values.state);

              if (values.state?.length > 0) {
                if (
                  sanitizedStateCode === null &&
                  sanitizedStateName === null
                ) {
                  errors.state = 'Invalid';
                }
              } else {
                errors.state = 'Required';
              }

              if (Object.keys(errors).length) return errors;

              if (sanitizedStateCode || sanitizedStateName) {
                const validStateCode = states.getStateNameByStateCode(
                  sanitizedStateCode || ''
                );
                const validStateName = states.getStateCodeByStateName(
                  sanitizedStateName || ''
                );

                if (validStateCode) setValidState(validStateCode);
                if (validStateName) setValidState(validStateName);
              }

              return {};
            }}
          >
            {({ values, handleChange, errors }) => (
              <Form>
                <TextField
                  type="text"
                  value={values.city}
                  placeholder="City"
                  fullWidth
                  name="city"
                  sx={{ marginY: '.25rem' }}
                  inputProps={{
                    sx: {
                      textAlign: 'center',
                    },
                  }}
                  onChange={handleChange}
                />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {errors.city ? (
                    <Typography sx={{ color: 'red' }}>{errors.city}</Typography>
                  ) : null}
                </Box>
                {values.city && !errors.city ? (
                  <Box>
                    <TextField
                      type="text"
                      value={values.state}
                      placeholder="State Abbr"
                      fullWidth
                      name="state"
                      sx={{ marginY: '.25rem' }}
                      inputProps={{
                        sx: {
                          textAlign: 'center',
                        },
                      }}
                      onChange={handleChange}
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {errors.state ? (
                        <Typography sx={{ color: 'red' }}>
                          {errors.state}
                        </Typography>
                      ) : (
                        <Typography sx={{ color: 'green' }}>
                          {validState}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ) : null}
                {values.state && !errors.state ? (
                  <OutlinedInput
                    type="submit"
                    fullWidth
                    sx={{ marginY: '.25rem' }}
                    inputProps={{ sx: { cursor: 'pointer' } }}
                  />
                ) : null}
              </Form>
            )}
          </Formik>
        </Box>
      </Collapse>
    </Box>
  );
};
export default UserPreferences;
