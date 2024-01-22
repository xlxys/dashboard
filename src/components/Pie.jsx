import * as d3 from "d3";
import { useEffect } from "react";

export default function Plot({ data, width = 200, height = 200 }) {
  useEffect(() => {
    const svg = d3.select("#pie");
    svg.attr('width', width);
    svg.attr('height', height);
    svg.attr('viewBox', `-${width / 2} -${height / 2} ${width} ${height}`);

    svg.selectAll("*").remove();

    let genreList = data?.genres ;

    let genreCount = {};
    Object.keys(genreList).forEach((genre) => {
      genreCount[genre] = genreList[genre].length;
    });

    // check if one genre has less than 5% of the total
    let total = 0;
    Object.keys(genreCount).forEach((genre) => {
      total += genreCount[genre];
    });

    let other = 0;
    Object.keys(genreCount).forEach((genre) => {
      if (genreCount[genre] < total * 0.03) {
        other += genreCount[genre];
        delete genreCount[genre];
      }
    });

    if (other > 0) {
      genreCount["Other"] = other;
    }

    let tooltip = d3
      .select("#tooltipContainer")
      .style("position", "absolute")
      .style("display", "none");

    const radius = Math.min(width - 10, height - 10) / 2;

    const color = d3.scaleOrdinal()
      .range(d3.schemeSet3);

    const pie = d3.pie()
      .value(function (d) { return d[1] });

    const data_ready = pie(Object.entries(genreCount));

    const arcGenerator = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    svg.append("g").selectAll("path")
      .data(data_ready)
      .enter()
      .append("path")
      .attr("d", arcGenerator)
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .style("fill", function (d) { return color(d.data[0]); })
      .on('mouseover', function (e, d) {
        tooltip.transition().duration(0).style("display", "block");
        tooltip.html(d.data[0].toLowerCase() + ": " + d.data[1])
          .style("left", e.pageX + 10 + "px")
          .style("top", e.pageY + 10 + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(0).style("display", "none");
      });

  }, [data, width, height]);

  return (
    <>
     <h1> Genres </h1>
     <br/>
    <br/>
    <br/>
      <div id="tooltipContainer" style={{ position: "absolute", display: "none", backgroundColor: "rgba(0, 0, 0, 0.8)", color: "#fff", padding: "8px", borderRadius: "4px", fontSize: "14px" }}></div>
      <svg id="pie" width="100%" viewBox={`0 0 ${width} ${height}`}>
        <g></g>
      </svg>
    </>
  );
}