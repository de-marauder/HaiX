import React, { useState, useEffect } from 'react'

import { MapContainer, TileLayer, Popup, Circle, FeatureGroup } from 'react-leaflet'
import L from 'leaflet';

import "leaflet/dist/leaflet.css";

import { getCountries, getCountriesCodes, cleanData } from './cleanMapData';

import Modal from './modal'


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export default function MapComponent() {

    // const ref = useRef();
    const [coordinates, setCoordinates] = useState([]);
    const [modalActive, setModal] = useState(false);

    const [tweetData, setTweetData] = useState({});
    const [tweetLocation, setTweetLocation] = useState('');

    useEffect(() => {

        (async () => {
            const countries = await getCountries()
            const countriesCode = await getCountriesCodes()

            const [locationCountList, tweetData] = await cleanData(countries, countriesCode)
            setTweetData(tweetData)
            console.log(locationCountList)
            console.log(tweetData)
            setCoordinates(locationCountList)
        })();

    }, [])

    const showModal = (code) => {
        setModal(!modalActive)
        setTweetLocation(code)
    }

    // console.log(coordinates)

    const fillRedOptions = { fillColor: 'red', color: 'red' }
    const fillGreenOptions = { color: 'green', fillColor: 'green' }
    const fillOrangeOptions = { color: 'orange', fillColor: 'orange' }

    const center = [51.505, -0.09]
    return (
        <>
            {modalActive ? <Modal tweetLocation={tweetLocation} avTweetDetails={coordinates} tweetData={tweetData} modalActive={modalActive} setModal={setModal} /> : null}
            <MapContainer center={center} zoom={2} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {coordinates.map((item, id) => {
                    return (<div key={id}>
                        <FeatureGroup >
                            <Popup >
                                <div style={{"cursor": "pointer"}} onClick={()=>showModal(item.locationCode)}>

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
                                </div>
                            </Popup>
                            <Circle
                                radius={item.count}
                                center={[item.latitude, item.longitude]}
                                pathOptions={
                                    (item.average >= -1 && item.average < -0.5) ?
                                        fillRedOptions :
                                        (item.average > -0.5 && item.average < 0.5) ?
                                            fillOrangeOptions :
                                            (item.average > -0.5 && item.average < 1) ?
                                                fillGreenOptions : ''
                                }
                            />
                        </FeatureGroup>
                    </div>
                    )
                })}
            </MapContainer>
        </>
    )
}
