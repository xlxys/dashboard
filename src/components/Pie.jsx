import * as d3 from "d3";
import { useEffect} from "react";

export default function Plot({ data, width=200, height=200 }) {


  useEffect(() => {
    const svg = d3.select("#pie");
    svg.attr('width', width);
    svg.attr('height', height);
    svg.attr('viewBox', `-${width / 2} -${height / 2} ${width} ${height}`);

    svg.selectAll("*").remove();

    let genreList = data?.genres;

    let genreCount = {};
    Object.keys(genreList).forEach((genre) => {
        genreCount[genre] = genreList[genre].length;
    });

    const radius = Math.min(width - 10, height - 10) / 2

    const color = d3.scaleOrdinal()
      .range(d3.schemeSet3);

    const pie = d3.pie()
      .value(function (d) { return d[1] })
    const data_ready = pie(Object.entries(genreCount))

    const arcGenerator = d3.arc()
      .innerRadius(0)
      .outerRadius(radius)

    svg
      .selectAll('mySlices')
      .data(data_ready)
      .join('path')
      .attr('d', arcGenerator)
      .attr('fill', function (d) { return (color(d.data[0])) })
      .attr("stroke", "black")
      .style("stroke-width", "2px")
      .style("opacity", 0.5)
      

  }, [width, height, data]);

  return (
      <svg id="pie" />
  );
}