import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import Tooltip from '@mui/material/Tooltip';

export default function WorldMap({ geoData, numData }) {
  const svgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const colorScale = d3
    .scaleThreshold()
    .domain([10, 50, 100, 500, 1000, 3000])
    .range(d3.schemeBlues[7]);

  const projection = d3.geoNaturalEarth1()
    .fitSize([dimensions.width, dimensions.height], geoData);

  const geoPathGenerator = d3.geoPath().projection(projection);

  const allSvgPaths = geoData.features
    .map((shape) => {

      const regionData = numData.countries[shape.properties.name]?.length || 0;
      const color = regionData ? colorScale(regionData) : 'lightgrey';

      return (
        <Tooltip key={shape.id} title={`${shape.properties.name}, ${regionData}`} placement="right">
          <path
            onClick={() => console.log(shape.properties.name)}
            d={geoPathGenerator(shape)}
            stroke="black"
            strokeWidth={0.2}
            fill={color}
            fillOpacity={1}
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