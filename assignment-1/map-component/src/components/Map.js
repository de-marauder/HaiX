import React, { useState, useEffect } from 'react'

// import * as d3 from 'd3';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import { getCountries, getCountriesCodes, cleanData } from './cleanMapData';

import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export default function MapComponent() {

    // const ref = useRef();
    const [coordinates, setCoordinates] = useState([])
    useEffect(() => {

        (async () => {
            const countries = await getCountries()
            const countriesCode = await getCountriesCodes()

            const locationCountList = cleanData(countries, countriesCode)
            console.log(locationCountList)
            setCoordinates(locationCountList)
            //     // The svg
            //     var svg = d3.select(ref.current)
            //     const map = document.getElementById('map')
            //     const widthStr = window.getComputedStyle(map).width
            //     let width = +(widthStr.slice(0, widthStr.length - 2))
            //     // let width = 600

            //     const height = +svg.attr("height");


            //     // Map and projection

            //     var projection = d3.geoMercator()
            //         .center([0, 20])                // GPS of location to zoom on
            //         .scale(120)                       // This is like the zoom
            //         .translate([width / 2, height / 2])

            //     Promise.all([
            //         // d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),  // World shape
            //         d3.json("http://enjalot.github.io/wwsd/data/world/world-110m.geojson"),  // World shape
            //         d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_gpsLocSurfer.csv") // Position of circles
            //     ]).then(([data1]) => {
            //         ready(data1, locationCountList);
            //     })

            //     function ready(dataGeo, data) {

            //         data.forEach(row => {
            //             const foundGeometry = dataGeo.features.find(e => e.id === row.code);
            //             if (foundGeometry) foundGeometry.properties.countryName = row.name;
            //         });

            //         // Create a color scale
            //         var allCountries = d3.map(data, function (d) { return (d.location) }).keys()
            //         var color = d3.scaleOrdinal()
            //             .domain(allCountries)
            //             .range(d3.schemePaired);

            //         // Add a scale for bubble size
            //         var valueExtent = d3.extent(data, function (d) { return +d.count; })
            //         var size = d3.scaleSqrt()
            //             .domain(valueExtent)  // What's in the data
            //             .range([1, 10])  // Size in pixel

            //         // Draw the map
            //         svg.append("g")
            //             .selectAll("path")
            //             .data(dataGeo.features)
            //             .enter()
            //             .append("path")
            //             .attr("class", "Country")
            //             .attr("d", d3.geoPath()
            //                 .projection(projection)
            //             )
            //             .style("stroke", "#333")
            //             .style("opacity", .3)
            //             .append("text")
            //             .attr("text-anchor", "end")
            //             .style("fill", "black")
            //             .attr("x", 10)
            //             .attr("y", 30)
            //             // .attr("width", 90)
            //             .style("font-size", 14)
            //             .classed("text", true)
            //             .html((d) => { return d.id })

            //         // Add circles:
            //         svg
            //             .selectAll("myCircles")
            //             .data(data.sort(function (a, b) { return +b.average - +a.average }).filter(function (d, i) { return i < 1000 }))
            //             .enter()
            //             .append("circle")
            //             .attr("cx", function (d) { return projection([(Math.round(+d.longitude * 10) / 10), (Math.round(+d.latitude * 10) / 10)])[0] })
            //             .attr("cy", function (d) { return projection([(Math.round(+d.longitude * 10) / 10), (Math.round(+d.latitude * 10) / 10)])[1] })
            //             // .attr("r", function (d) { return size(+d.n) })
            //             .attr("r", function (d) { return size(d.count * 1.5) })
            //             .attr("class", "circle")
            //             .attr("title", (d) => { return d.location })
            //             .style("fill", function (d) { return color(d.location) })
            //             .attr("stroke", function (d) { if (d.count > 2000) { return "black" } else { return "none" } })
            //             // .attr("stroke-width", 1)
            //             .attr("fill-opacity", .4)
            //             .append("text")
            //             .attr("text-anchor", "end")
            //             .style("fill", "black")
            //             .attr("x", width - 10)
            //             .attr("y", height - 30)
            //             .attr("width", 90)
            //             .style("font-size", 14)
            //             .html((d) => { return d.location })


            //         // Add title and explanation
            //         svg
            //             .append("text")
            //             .attr("text-anchor", "end")
            //             .style("fill", "black")
            //             .attr("class", "map-desc")
            //             .attr("x", width - 10)
            //             .attr("y", height - 30)
            //             .attr("width", 90)
            //             .html("Twitter Sentiment Analysis")
            //             .style("font-size", 14)
            //     }
        })();

    }, [])

    // const position = [51.505, -0.09]
    console.log(coordinates)
    // const position = coordinates.map((item) => {
    //     return [
    //         item.latitude,
    //         item.longitude
    //     ]
    // })
    // console.log(position)
    return (
        // <div id='mapid' className="map-wrapper">
        //     <svg id="map" ref={ref} height="350" ></svg>
        // </div>
        <MapContainer center={[51.505, -0.09]} zoom={2} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {coordinates.map((item, id) => {
                return (<Marker key={id} position={[item.latitude, item.longitude]}>
                    <Popup>
                        <p>Location: {item.location}</p>
                        <p>Number of tweets: {item.count}</p>
                        <p>Sentiment: {
                        (item.average >= -1 && item.average < -0.5) ?
                        <span className='sentiment-marker bad'></span> :
                        (item.average > -0.5 && item.average < 0.5) ?
                        <span className='sentiment-marker neutral'></span> :
                        (item.average > -0.5 && item.average < 0.5) ?
                        <span className='sentiment-marker good'></span> : ''
                        }</p>
                    </Popup>
                </Marker>)
            })}
        </MapContainer>
    )
}
