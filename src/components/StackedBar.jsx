import * as d3 from "d3";
import { useEffect } from "react";


export default function CalendarHeatmap({ data, w = 500, h = 450 }) {


  useEffect(() => {


    const durationData = data.durationList;

    const types = ["TV Show", "Movie"]

    const colorScale = d3.scaleOrdinal()
      .domain(types)
      .range(["#084594", "#c6dbef"]);


    const margin = { top: 20, right: 80, bottom: 20, left: 0 };
    const width = w - margin.left - margin.right;
    const height = h - margin.top - margin.bottom;

    const svg = d3.select("#stackedbar");
    svg.attr('width', width);
    svg.attr('height', height);
    
    
    svg.selectAll("*").remove();

    const stack = d3.stack().keys(types);

    const series = stack(durationData);


    const x = d3.scaleBand()
      .domain(durationData.map(d => d.duration))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
      .nice()
      .range([height, 0]);

    svg.selectAll("g")
      .data(series)
      .join("g")
      .attr("fill", d => colorScale(d.key))
      .selectAll("rect")
      .data(d => d)
      .join("rect")
      .attr("x", (d, i) => x(durationData[i].duration))
      .attr("y", d => y(d[1] - d[0]))
      .attr("height", d => {
        if (d[0] < (d[1] - d[0])){
          return height - y(d[1] - 2 * d[0])
        }
        else{
          return Math.abs(y(d[1]) - y(d[0]))
        }
          
      })
      .attr("width", x.bandwidth());

    // Ajouter les axes
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisRight(y)
      .tickSize(-5);


    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("transform", "translate(" + (width) + ",0)")
      .call(yAxis)

    // Ajouter une légende
    const legend = svg.append("g")
      .attr("transform", "translate(" + 20 + "," + 20 + ")")
      .selectAll("g")
      .data(types)
      .join("g")
      .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

    legend.append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", d => colorScale(d));

    legend.append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", "0.35em")
      .text(d => d);



}, [h, w, data]);

return (
  <>
    <h1> Duration Chart </h1>
    <svg id="stackedbar" width="100%" viewBox={`0 0 ${w} ${h}`}>
    </svg>
  </>

);
}
