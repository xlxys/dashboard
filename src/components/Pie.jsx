import * as d3 from "d3";
import { useEffect, useRef, useState, useContext } from "react";

import OptionsContext from '../context/OptionsContext';


export default function Plot({ data }) {
  const svgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 200, height: 200 });

  const { options, setOptions } = useContext(OptionsContext);



  useEffect(() => {
    
    const resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });

    resizeObserver.observe(svgRef.current);

    const currentSvgRef = svgRef.current; // Store the current value of svgRef.current

    return () => resizeObserver.unobserve(currentSvgRef); // Use the stored value in the cleanup function
  }, []);

  useEffect(() => {
    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    svg.attr('width', width);
    svg.attr('height', height);
    svg.attr('viewBox', `-${width / 2} -${height / 2} ${width} ${height}`);

    // Clear the SVG
    svg.selectAll("*").remove();

    // get the number of movies in each genre

    let genreList = data?.genres;

    let genreCount = {};
    Object.keys(genreList).forEach((genre) => {
      if (genreList[genre].length > 600)
        genreCount[genre] = genreList[genre].length;
    });

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width - 10, height - 10) / 2


    // set the color scale
    const color = d3.scaleOrdinal()
      .range(d3.schemeSet3);

    // Compute the position of each group on the pie:
    const pie = d3.pie()
      .value(function (d) { return d[1] })
    const data_ready = pie(Object.entries(genreCount))

    // shape helper to build arcs:
    const arcGenerator = d3.arc()
      .innerRadius(0)
      .outerRadius(radius)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    
    svg
      .selectAll('mySlices')
      .data(data_ready)
      .join('path')
      .attr('d', arcGenerator)
      .attr('fill', function (d) { return (color(d.data[0])) })
      .attr("stroke", "black")
      .style("stroke-width", "2px")
      .style("opacity", 0.5)
      .on("mouseover", (event, d) => {
        // Show tooltip

      })
      .on("mouseout", () => {
        // Hide tooltip

      });


  }, [dimensions, data]);

  return (
      <svg ref={svgRef} id="pie" />
  );
}