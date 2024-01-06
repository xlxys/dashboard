import * as d3 from "d3";
import { useEffect, useRef, useState, useContext } from "react";
import OptionsContext from "../context/OptionsContext";
import Tooltip from '@mui/material/Tooltip';

export default function WorldMap({ geoData, numData }) {

  const { options, setOptions } = useContext(OptionsContext);
  const [countries, setCountries] = useState([]);

  function chageCountriesOptions(name) {
    if (countries?.includes(name)) {
      setCountries(prevCountries => prevCountries.filter(c => c !== name));
    } else {
      setCountries(prevCountries => [...prevCountries, name]);
    }
  }

  const svgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });


  useEffect(() => {
    setOptions(prevOptions => ({
      ...prevOptions,
      country: countries || null,
    }));
  }, [countries]);


  useEffect(() => {
    if (options.country.length === 0) {
      setCountries([]);
    }
  }, [options]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.attr('width', '100%');
    svg.attr('height', '100%');

    setDimensions({
      width: svgRef.current.clientWidth,
      height: svgRef.current.clientHeight,
    });

    const handleResize = () => {
      setDimensions({
        width: svgRef.current.clientWidth,
        height: svgRef.current.clientHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    d3.select("#legend").remove();    
    
    const legendWidth = dimensions.width * 0.4;
    const legendHeight = dimensions.height * 0.02;

  const legendSvg = d3.select(svgRef.current)
    .append('g')
    .attr('id', 'legend') // Give the legend a unique id
    .attr('transform', `translate(${(dimensions.width - legendWidth) / 2}, ${dimensions.height - legendHeight - 20})`);


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


    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dimensions.width, dimensions.height]);

  const colorScale = d3.scaleThreshold();

  const updateColorScale = (data) => {
    const domain = calculateDomain(data);
    colorScale.domain(domain).range(d3.schemeBlues[domain.length + 1]);
  };

  const calculateDomain = (data) => {

    const values = Object.values(data);
    const max = Math.max(...values);
    const thresholds = [10, 50, 100, 500, 1000, 3000, max];
    return thresholds;
  };


  updateColorScale(numData.countries);

  const projection = d3.geoNaturalEarth1()
    .fitSize([dimensions.width, dimensions.height], geoData);

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
            fill={countries?.includes(shape.properties.name) ? "#2D3250" : color}
            fillOpacity={1}
            opacity={1}
          />
        </Tooltip>
      );
    });


  return (
    <svg id="map" ref={svgRef}>
      <g>{allSvgPaths}</g>
    </svg>
  );
}