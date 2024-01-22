import * as d3 from "d3";
import { useEffect, useContext } from "react";
import OptionsContext from "../context/OptionsContext";
import Tooltip from '@mui/material/Tooltip';

export default function WorldMap({ geoData, numData, width = 750, height = 380 }) {

  const { options, setOptions } = useContext(OptionsContext);

  function chageCountriesOptions(name) {
    if (options.country?.includes(name)) {
      // setCountries(prevCountries => prevCountries.filter(c => c !== name));
      setOptions(prevOptions => ({ ...prevOptions, country: prevOptions.country.filter(c => c !== name) }));
    } else {
      // setCountries(prevCountries => [...prevCountries, name]);
      setOptions(prevOptions => ({ ...prevOptions, country: [...prevOptions.country, name] }));
    }
  }

  const svg = d3.select("#map");
  svg.attr('width', width);
  svg.attr('height', height);


  const colorScale = d3.scaleThreshold()
    .domain([10, 50, 100, 500, 1000, 3000, 5000])
    .range(d3.schemeBlues[7]);


  const projection = d3.geoNaturalEarth1()
    .fitSize([width, height], geoData);

  const geoPathGenerator = d3.geoPath().projection(projection);

  const allSvgPaths = geoData.features
    .map((shape) => {

      const regionData = numData.countries[shape.properties.name]?.length || 0;
      const color = regionData ? colorScale(regionData) : 'lightgrey';

      return (
        <Tooltip key={shape.id} title={`${shape.properties.name}, ${regionData}`} placement="top">
          <path
            onClick={() => chageCountriesOptions(shape.properties.name)}
            d={geoPathGenerator(shape)}
            stroke="black"
            strokeWidth={0.3}
            fill={options.country?.includes(shape.properties.name) ? "#2D3250" : color}
            fillOpacity={1}
            opacity={1}
          />
        </Tooltip>
      );
    });

  useEffect(() => {

    d3.select("#legend").remove();

    const legendWidth = width * 0.4;
    const legendHeight = height * 0.02;

    const legendSvg = d3.select("#map")
      .append('g')
      .attr('id', 'legend')
      .attr('transform', `translate(${(width - legendWidth) / 2}, ${height - legendHeight - 20})`);


    const legendScale = d3.scaleLinear()
      .domain([0, d3.schemeBlues[8].length - 1])
      .range([0, legendWidth]);

    let ticks = [1, 10, 50, 100, 500, 1000, 3000, 5000, 10000]

    const legendAxis = d3.axisBottom(legendScale)
      .tickValues(d3.range(d3.schemeBlues[8].length + 1))
      .tickFormat(i => ticks[i]);

    legendSvg.append('g')
      .attr('transform', `translate(0, ${legendHeight})`)
      .call(legendAxis);

    legendSvg.selectAll('rect')
      .data(d3.schemeBlues[8])
      .enter()
      .append('rect')
      .attr('x', (d, i) => legendScale(i))
      .attr('width', legendWidth / d3.schemeBlues[8].length + 5)
      .attr('height', legendHeight)
      .attr('fill', d => d);
  }, [width, height]);


  return (
    <>
    
      <svg id="map" width="100%" viewBox={`0 0 ${width} ${height}`}>
        <g>{allSvgPaths}</g>
      </svg>
      <h1> Choropleth </h1>
      
    </>

  )
}