import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";


export default function Plot({ data }) {
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

  


  const cross = d3.symbol().type(d3.symbolCross).size(25);
  const circle = d3.symbol().type(d3.symbolCircle).size(25);

  const shape = d3.scaleOrdinal()
    .domain(["TV Show", "Movie"])
    .range([circle, cross])

  // color scale for the rating
  const colorScale = d3.scaleOrdinal()
    .domain([])
    .range([])

  const xScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, dimensions.width]);

  const yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([dimensions.height, 0]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  const xAxisGroup = d3.select(svgRef.current).append('g')
    .attr('transform', `translate(0, ${dimensions.height})`)
    .call(xAxis);

  const yAxisGroup = d3.select(svgRef.current).append('g')
    .call(yAxis);




  






  


  return (
    <svg id="plot" ref={svgRef}>
  
    </svg>
  );
}