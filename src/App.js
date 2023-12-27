import { useState, useEffect } from "react";
import * as d3 from "d3";

import Plot from "./components/Plot";
import Map from "./components/Map";
import Loading from './components/LoadingComponent';


import netflixData from "./data/netflix_titles.csv";
import mapData from "./data/world.geojson";

import { parseData } from "./utilities/parseData";


export default function App() {

  const [numData, setNumData] = useState(null);
  const [geoData, setGeoData] = useState(null);

  // const [options, setOptions] = useState({
  //   year: "all",
  //   type: "all",
  //   country: "all",
  //   // rating: "all",
  //   genre: "all",
  //   // director: "all",
  //   // actor: "all",
  //   duration: "all",
  // });


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


  return (
    <>
      <Plot data={numData} />
      {numData != null && geoData != null ? (
        <Map numData={numData} geoData={geoData} />
      ) : (
        <Loading /> // TODO: add loading screen
      )}
    </>
  );
}
