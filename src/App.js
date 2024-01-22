import { useState, useMemo } from "react";
import * as d3 from "d3";

import parseData from "./utilities/parseData";

import Map from "./components/Map";
import Loading from './components/LoadingComponent';
import FillterBar from "./components/FilltersBar";
import Pie from "./components/Pie";
import CalendarHeatmap from "./components/CalendarHeatmap";
import Histogram from "./components/Histograme";
import HistogramD from "./components/HistogramD";
import StackedBar from "./components/StackedBar";


import netflixData from "./data/pre-processed_netflix_titles.csv";
import mapData from "./data/world.geojson";

import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import OptionsContext from "./context/OptionsContext";

import './App.css';


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

  const [options, setOptions] = useState({
    type: {
      "TV Show": true,
      "Movie": true
    },
    country: [],
    release_year: null,
    genre: ''
  });

  useMemo(() => {
    d3.json(mapData).then((data) => {
      setGeoData(data);
    })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useMemo(() => {
    d3.csv(netflixData).then((data) => {
      let parsedData = parseData(data, options)
      setNumData(parsedData)
    }
    ).catch((err) => {
      console.log(err)
    })
  }, [options]);


  return (
    <OptionsContext.Provider value={{ options, setOptions }}>
      <div className="App">
        <Box sx={{ width: '100%', height: '100%' }}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid xs={12}>
              <Item sx={{ width: '100%', height: '100%' }}>
                <FillterBar data={numData} />
              </Item>
            </Grid>
            <Grid xs={12}>
              <Item sx={{ width: '100%', height: '450px' }}>
                {numData != null && geoData != null ? (
                  <Map numData={numData} geoData={geoData} />
                ) : (
                  <Loading />
                )}
              </Item>
            </Grid>
            <Grid xs={4}>
              <Item sx={{ width: '100%', height: '450px' }}>
                {numData != null ? (
                  <Pie data={numData} />
                ) : (
                  <Loading />
                )}
              </Item>
            </Grid>
            <Grid xs={4}>
              <Item sx={{ width: '100%', height: '450px' }}>
                {numData != null ? (
                  <StackedBar data={numData} />
                ) : (
                  <Loading />
                )}
              </Item>
            </Grid>
            <Grid xs={4}>
              <Item sx={{ width: '100%', height: '450px' }}>
                {numData != null ? (
                  <CalendarHeatmap data={numData} />
                ) : (
                  <Loading />
                )}
              </Item>
            </Grid>
            <Grid xs={6}>
              <Item sx={{ width: '100%', height: '450px' }}>
                {numData != null ? (
                  <Histogram data={numData.castList} />
                ) : (
                  <Loading />
                )}
              </Item>
            </Grid>
            <Grid xs={6}>
              <Item sx={{ width: '100%', height: '450px' }}>
                {numData != null ? (
                  <HistogramD data={numData.directorList} />
                ) : (
                  <Loading />
                )}
              </Item>
            </Grid>
          </Grid>
        </Box>

      </div>
    </OptionsContext.Provider>
  );
}
