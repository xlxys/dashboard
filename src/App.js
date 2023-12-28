import { useState, useEffect } from "react";
import * as d3 from "d3";

import parseData from "./utilities/parseData";

import Plot from "./components/Plot";
import Map from "./components/Map";
import Loading from './components/LoadingComponent';
import FillterBar from "./components/FilltersBar";


import netflixData from "./data/netflix_titles.csv";
import mapData from "./data/world.geojson";

import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));



export default function App() {

  const [numData, setNumData] = useState(null);
  const [geoData, setGeoData] = useState(null);


  useEffect(() => {

    // load data
    Promise.all([d3.csv(netflixData), d3.json(mapData)])
      .then((datasets) => {
        let parsedData = parseData(datasets[0]);
        setNumData(parsedData);
        setGeoData(datasets[1]);
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

  // TODO: add fillters and search
  return (
    <div className="App">
      <Box sx={{ width: '100%', height: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid xs={12}>
            <Item sx={{width: '100%', height: '100%'}}>
              <FillterBar data={numData}/>
            </Item>
          </Grid>
          <Grid xs={6}>
            <Item><Plot data={numData} /></Item>
          </Grid>
          <Grid xs={6}>
            <Item sx={{width: '100%', height: '100%'}}>
              {numData != null && geoData != null ? (
                <Map numData={numData} geoData={geoData}  />
              ) : (
                <Loading /> // TODO: add loading screen
              )}
            </Item>
          </Grid>
          <Grid xs={12}>
            <Stack direction="row" sx={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}} spacing={2}>
              <Item>Item 1</Item>
              <Item>Item 2</Item>
              <Item>Item 3</Item>
            </Stack>
          </Grid>
        </Grid>
      </Box>


    </div>
  );
}
