import * as d3 from "d3";
import { useEffect, useContext } from "react";

import OptionsContext from "../context/OptionsContext";

export default function CalendarHeatmap({ data, width = 400, height = 200 }) {

  const {options} = useContext(OptionsContext)


  useEffect(() => {
    const svg = d3.select("#heatmap");
    svg.attr('width', width);
    svg.attr('height', height);

    let tooltip = d3
      .select("#tooltipContainer")
      .style("position", "absolute")
      .style("display", "none");

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
    const gridX = (width - gridWidth) / 2;
    const gridY = (height - gridHeight) / 2;

    svg.selectAll(".year-cell")
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
      .on('mouseover', function (e, d) {
        tooltip.transition().duration(0).style("display", "block");
        tooltip.html(d.year + ": " + d.count)
          .style("left", e.pageX + 10 + "px")
          .style("top", e.pageY + 10 + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(0).style("display", "none");
      });


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
      .style("stroke-width", 1)



  }, [height, width, data]);

 

  if (options.release_year !== null)
  {
    return (
      <>
      <h1>  </h1>
      <br/>
      <h2> {options.release_year} </h2>
      </>
    )
  }

  return (
    <>
    <h1> Years heatmap </h1>
    <br/>
    <br/>
    <br/>
      <div id="tooltipContainer" style={{ position: "absolute", display: "none", backgroundColor: "rgba(0, 0, 0, 0.8)", color: "#fff", padding: "8px", borderRadius: "4px", fontSize: "14px" }}></div>
      <svg id="heatmap" width="100%" viewBox={`0 0 ${width} ${height}`}>
      </svg>
    </>

  );
}
