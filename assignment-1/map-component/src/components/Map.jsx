import React, { useState, useEffect } from 'react'

import { MapContainer, TileLayer, Popup, FeatureGroup, CircleMarker } from 'react-leaflet'
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

import { cleanData } from '../util/cleanMapData';
import Modal from './modal'



delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

var southWest = L.latLng(-90, 180),
    northEast = L.latLng(90, -180),
    bounds = L.latLngBounds(southWest, northEast);
    
export default function MapComponent() {

    const [coordinates, setCoordinates] = useState([]);
    const [modalActive, setModal] = useState(false);

    const [tweetData, setTweetData] = useState({});
    const [tweetLocation, setTweetLocation] = useState('');

    useEffect(() => {

        (async () => {
            const [locationCountList, tweetData] = await cleanData()
            setTweetData(tweetData)
            setCoordinates(locationCountList)
        })();

    }, [])

    const showModal = (code) => {
        setModal(!modalActive)
        setTweetLocation(code)
    }

    const fillRedOptions = { fillColor: 'red', color: 'red', strokeWidth: '2px' }
    const fillGreenOptions = { color: 'green', fillColor: 'green', strokeWidth: '2px' }
    const fillOrangeOptions = { color: 'orange', fillColor: 'orange', strokeWidth: '2px' }

    const center = [51.505, -0.09]
    return (
        <>
            {modalActive ? <Modal tweetLocation={tweetLocation} avTweetDetails={coordinates} tweetData={tweetData} modalActive={modalActive} setModal={setModal} /> : null}
            <MapContainer center={center} zoom={4} scrollWheelZoom={true} maxBounds={bounds} maxZoom={19} minZoom={2.5}>
                <TileLayer
                    noWrap={true}
                    attribution='&copy; <a href="https://carto.com/">carto.com</a> contributors'
                    url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'
                />

                {coordinates.map((item, id) => {
                    return (<div key={id}>
                        <FeatureGroup >
                            <Popup className={
                                `${(item.average >= -1 && item.average < -0.5) ?
                                    'bad' :
                                    (item.average > -0.5 && item.average < 0.5) ?
                                        'neutral' :
                                        (item.average > -0.5 && item.average < 0.5) ?
                                            'good' : ''} tooltip`
                            }>
                                <div onClick={() => showModal(item.locationCode)}>
                                    <p>{item.locationCode} ({item.count})</p>
                                </div>
                            </Popup>
                            <CircleMarker
                                radius={item.count * 1.5}
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
