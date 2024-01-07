import * as d3 from "d3";
import { useEffect, useContext } from "react";

import OptionsContext from '../context/OptionsContext';


export default function CalendarHeatmap({ data, width=400, height=200  }) {

  const { options } = useContext(OptionsContext);

  useEffect(() => {
    const svg = d3.select("#heatmap");
    svg.attr('width', width);
    svg.attr('height', height);

    svg.selectAll("*").remove();


    const yearsCount = data?.years;

    const years = Object.keys(yearsCount).map((year) => {
      return { year: year, count: yearsCount[year].length };
    });

    const cellSize = 15;
    // const maxYear = Math.max(...Object.keys(yearsCount));
    // const minYear = Math.min(...Object.keys(yearsCount));
    // const numberCells = 200;
    const cellGap = 2;


    const color = d3.scaleLinear()
      .domain([0, 5, 10, 20, 50, 100, 200, 500, 1000])
      .range(d3.schemeBlues[9]);

    const gridSize = Math.ceil(Math.sqrt(years.length));


    const gridWidth = gridSize * (cellSize + cellGap);
    const gridHeight = Math.ceil(years.length / gridSize) * (cellSize + cellGap);
    const gridX = (width - gridWidth) / 2 ;
    const gridY = (height - gridHeight) / 2;

    const heatmap = svg.selectAll(".year-cell")
      .data(years)
      .enter()
      .append("rect")
      .attr("class", "year-cell")
      .attr("x", (d, i) => gridX + (i % gridSize) * (cellSize + cellGap))
      .attr("y", (d, i) => gridY + Math.floor(i / gridSize) * (cellSize + cellGap))
      .attr("width", cellSize - cellGap)
      .attr("height", cellSize - cellGap)
      .style("fill", (d) => color(d.count))
      .style("stroke", "black")
      .style("stroke-width", 0.5)

    

    const legend = svg.selectAll(".legend-item")
      .data(color.range())
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0,${i * 10})`);

    legend.append("rect")
      .attr("x", 10)
      .attr("y", 10)
      .attr("width", 15)
      .attr("height", 15)
      .style("fill", (d) => d)
      .style("stroke", "black")
      .style("stroke-width", 1);

  }, [height, width, options, data]);

  return (
    <svg id="heatmap" />
  );
}
