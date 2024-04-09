import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

interface BasicSelectProps {
  value: string;
  handleChange: (input: string) => void;
  label: string;
  selectItems: { value: string; title: string }[];
}
export default function BasicSelect(props: BasicSelectProps) {
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
        <Select
          value={props.value}
          label={props.label}
          onChange={(ev) => props.handleChange(ev.target.value)}
          sx={{ zIndex: 1600 }}
          MenuProps={{ style: { zIndex: 1650 } }}
        >
          {props.selectItems.map((item) => (
            <MenuItem value={item.value}>{item.title}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
