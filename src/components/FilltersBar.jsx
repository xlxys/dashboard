import {useState} from 'react';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';






export default function FillterBar({ data }) {

  const [genre, setGenre] = useState('');

  const handleChange = (event) => {
    setGenre(event.target.value);
  }

  return (
    <div className="filters-bar">
      <FormGroup sx={{ m: 2 }} row={true}>
        <FormControlLabel control={<Checkbox defaultChecked />} label="TV-Shows" />
        <FormControlLabel control={<Checkbox defaultChecked />} label="Movies" />
        <div>

          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-helper-label">Genre</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={genre}
              label="Genre"
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {data?.genreList?.map((item, index) => {
                return (
                  <MenuItem key={index} value={item}>{item}</MenuItem>
                )
              })}
            </Select>
          </FormControl>


          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker label={'Release Year'} views={['year']} />
            </LocalizationProvider>
          </FormControl>
        </div>
      </FormGroup>
    </div>
  );
}
