import * as d3 from "d3";
import { useEffect } from "react";


export default function Plot({ data, width=450, height=350 }) {



  useEffect(() => {
    const svg = d3.select("#plot")

    const cross = d3.symbol().type(d3.symbolCross).size(25);
    const circle = d3.symbol().type(d3.symbolCircle).size(25);
  
    const shape = d3.scaleOrdinal()
      .domain(["TV Show", "Movie"])
      .range([circle, cross])
  
    const colorScale = d3.scaleOrdinal()
      .domain([])
      .range([])
  
    const xScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, width]);
    
    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);
  
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
  
    const xAxisGroup = svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)

  
    const yAxisGroup = svg.append('g')
      .call(yAxis)

  

  }, [width, height, data]);


  return (
    <svg id="plot">
  
    </svg>
  );
}