import React, { useEffect, useRef } from 'react'

import * as d3 from 'd3';


export default function MapComponent() {

    const ref = useRef();

    useEffect(() => {
        // The svg
        var svg = d3.select(ref.current)
        const map = document.getElementById('map')
        const widthStr = window.getComputedStyle(map).width
        let width = +(widthStr.slice(0, widthStr.length -2))

        const height = +svg.attr("height");

        // Map and projection

        var projection = d3.geoMercator()
            .center([0, 20])                // GPS of location to zoom on
            .scale(120)                       // This is like the zoom
            .translate([width / 2, height / 2])

        Promise.all([
            d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),  // World shape
            d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_gpsLocSurfer.csv") // Position of circles
        ]).then(([data1, data2]) => {
            ready(data1, data2);
        })

        function ready(dataGeo, data) {

            data.forEach(row => {
                const foundGeometry = dataGeo.features.find(e => e.id === row.code);
                if (foundGeometry) foundGeometry.properties.countryName = row.name;
            });

            // Create a color scale
            var allContinent = d3.map(data, function (d) { return (d.homecontinent) }).keys()
            console.dir(allContinent)
            var color = d3.scaleOrdinal()
                .domain(allContinent)
                .range(d3.schemePaired);

            // Add a scale for bubble size
            var valueExtent = d3.extent(data, function (d) { return +d.n; })
            var size = d3.scaleSqrt()
                .domain(valueExtent)  // What's in the data
                .range([1, 50])  // Size in pixel

            // Draw the map
            svg.append("g")
                .selectAll("path")
                .data(dataGeo.features)
                .enter()
                .append("path")
                .attr("class", "Country")
                .attr("d", d3.geoPath()
                    .projection(projection)
                )
                .style("stroke", "#333")
                .style("opacity", .3)

            // Add circles:
            svg
                .selectAll("myCircles")
                .data(data.sort(function (a, b) { return +b.n - +a.n }).filter(function (d, i) { return i < 1000 }))
                .enter()
                .append("circle")
                .attr("cx", function (d) { return projection([+d.homelon, +d.homelat])[0] })
                .attr("cy", function (d) { return projection([+d.homelon, +d.homelat])[1] })
                // .attr("r", function (d) { return size(+d.n) })
                .attr("r", function (d) { return size(5) })
                .style("fill", function (d) { return color(d.homecontinent) })
                // .attr("stroke", function (d) { if (d.n > 2000) { return "black" } else { return "none" } })
                // .attr("stroke-width", 1)
                .attr("fill-opacity", .4)

            // Add title and explanation
            svg
                .append("text")
                .attr("text-anchor", "end")
                .style("fill", "black")
                .attr("x", width - 10)
                .attr("y", height - 30)
                .attr("width", 90)
                .html("Twitter Sentiment Analysis")
                .style("font-size", 14)
        }
    })


    return (
        <div className="map-wrapper">
            <svg id="map" ref={ref} height="350" ></svg>
        </div>
    )
}
