import * as d3 from "d3";
import { useEffect } from "react";


export default function Histogram({ data, w = 500, h = 400 }) {

  useEffect(() => {

    d3.select("#my_dataviz svg").remove();

    // get the data

    console.log(data);


    // set the dimensions and margins of the graph
    const margin = { top: 20, right: 30, bottom: 40, left: 90 },
      width = w,
      height = h - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#my_dataviz")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);


    // Add X axis
    const x = d3.scaleLinear()
      .domain([0, 50])
      .range([0, width]);
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Y axis
    const y = d3.scaleBand()
      .range([0, height])
      .domain(data.map(d => d.cast))
      .padding(.1);
    svg.append("g")
      .call(d3.axisLeft(y))

    //Bars
    svg.selectAll("myRect")
      .data(data)
      .join("rect")
      .attr("x", x(0))
      .attr("y", d => y(d.cast))
      .attr("width", d => x(d.count))
      .attr("height", y.bandwidth())
      .attr("fill", "#c6dbef")


  }, [w, h, data]);
  return (
    <>
    <h1> Most prolific actors </h1>
      <div id="my_dataviz"></div>
    </>

  );
}
