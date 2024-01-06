import { useContext, useState } from 'react';

import OptionsContext from '../context/OptionsContext';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';



export default function FillterBar({ data }) {

  const [genre, setGenre] = useState('');
  const [date, setDate] = useState('');

  const { options, setOptions } = useContext(OptionsContext);

  const handleChange = (event) => {
    setGenre(event.target.value);

    setOptions(prevOptions => ({
      ...prevOptions,
      genre: genre,
    }));
  }

  const clearOptions = () => {
    setOptions({
      type: {
        "TV Show": true,
        "Movie": true,
      },
      country: [],
      release_year: null,
      genre: "All"
    });

    setGenre('');
    setDate(null);
  }


  return (
    <div className="filters-bar">
      <FormGroup sx={{ m: 2 }} row={true}>
        <FormControlLabel
          control={<Checkbox
            checked={options.type["TV Show"]}
            onChange={(event) => {
              const isChecked = event.target.checked;
              const updatedOptions = {
                ...options,
                type: {
                  ...options.type,
                  "TV Show": isChecked
                }
              };

              if (!isChecked && !updatedOptions.type["Movie"]) {
                // At least one checkbox should be checked
                return;
              }

              setOptions(updatedOptions);
            }}
          />}
          label="TV-Shows"
        />
        <FormControlLabel
          control={<Checkbox
            checked={options.type["Movie"]}
            onChange={(event) => {
              const isChecked = event.target.checked;
              const updatedOptions = {
                ...options,
                type: {
                  ...options.type,
                  "Movie": isChecked
                }
              };

              if (!isChecked && !updatedOptions.type["TV Show"]) {
                // At least one checkbox should be checked
                return;
              }

              setOptions(updatedOptions);
            }}
          />}
          label="Movies"
        />
        <div>

          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="select-genre">Genre</InputLabel>
            <Select
              labelId="select-label"
              id="select-helper"
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
              <DatePicker
                label={'Release Year'}
                views={['year']}
                value={null}
                onChange={(newValue) => {
                  // get the year from the date object
                  let year = newValue.year();

                  setOptions(prevOptions => ({
                    ...prevOptions,
                    release_year: year
                  }));
                }}
              />

            </LocalizationProvider>
          </FormControl>
          <Button onClick={clearOptions} sx={{ m: 2, minWidth: 120 }} variant="outlined" color="error">
            Clear
          </Button>

        </div>
      </FormGroup>

    </div>
  );
}
