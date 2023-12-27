import * as d3 from "d3";

export default function WorldMap({
  geoData,
  numData,
  width = 640,
  height = 400
}) {

  const colorScale = d3
    .scaleThreshold()
    .domain([10, 50, 100, 500, 1000, 3000])
    .range(d3.schemeBlues[7]);

  const projection = d3.geoNaturalEarth1()
    .fitSize([width, height], geoData);

  const geoPathGenerator = d3.geoPath().projection(projection);

  const allSvgPaths = geoData.features
    .map((shape) => {

      const regionData = numData.countries[shape.properties.name]?.length || null;
      const color = regionData ? colorScale(regionData) : 'lightgrey';

      return (
        <path onClick={() => console.log(shape.properties.name)}
          key={shape.id}
          d={geoPathGenerator(shape)}
          stroke="lightGrey"
          strokeWidth={0.5}
          fill={color}
          fillOpacity={1}
        />
      );
    });

  return (
      <svg id="map" width={width} height={height}>
        <g>{allSvgPaths}</g>
      </svg>
  );

}


