import React, { useState, useEffect, useRef } from 'react'

import { MapContainer, TileLayer, Popup, FeatureGroup, CircleMarker } from 'react-leaflet'
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

import { cleanData } from '../../util/cleanMapData';
import Modal from '../Modal/modal'

import classes from './Map.module.scss'


var southWest = L.latLng(-90, 180),
    northEast = L.latLng(90, -180),
    bounds = L.latLngBounds(southWest, northEast);

export default function MapComponent() {

    const [coordinates, setCoordinates] = useState([]);

    const [tweetData, setTweetData] = useState({});

    const [modalList, setModalList] = useState([]);

    useEffect(() => {

        (async () => {
            const [locationCountList, tweetData] = await cleanData()
            setTweetData(tweetData)
            setCoordinates(locationCountList)
        })();

    }, [modalList])

    const showModal = (code) => {
        setModalList([...modalList, code])
    }

    const closeModal = (code) => {
        setModalList([...modalList].filter((el) => code !== el))
    }

    const selectSentiment = (item, pos, neu, neg) => {
        return (item.average >= -1 && item.average < 0) ?
            neg :
            (item.average >= 0 && item.average < 0.5) ?
                neu :
                (item.average >= 0.5 && item.average <= 1) ?
                    pos : ''
    }

    const fillRedOptions = { fillColor: 'red', color: 'red', strokeWidth: '2px' }
    const fillGreenOptions = { color: 'green', fillColor: 'green', strokeWidth: '2px' }
    const fillOrangeOptions = { color: 'orange', fillColor: 'orange', strokeWidth: '2px' }

    const center = [51.505, -0.09]
    return (
        <div className='map-container'>
            {modalList.map((code, id) => {
                return <Modal key={id} tweetLocation={code} avTweetDetails={coordinates} tweetData={tweetData} closeModal={() => closeModal(code)} />
            })
            }
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
                                `${selectSentiment(item, 'good', 'neutral', 'bad')} tooltip`
                            }>
                                <div className={classes.popup} onClick={() => showModal(item.locationCode)}>
                                    <p className={classes.popup_title}><strong>Location: {item.locationCode}</strong></p>
                                    <p className={classes.popup_tweet_count}> Tweets: {item.count}</p>
                                    <p className={classes.popup_mean_sentiment}> <strong>Mean sentiment:</strong> {
                                        `${selectSentiment(item, 'Positive', 'Neutral', 'Negative')}`
                                    } {(+item.average).toFixed(2)}</p>
                                    <p className={classes.popup_sentiment_count}> Sentiment count: {item.count}</p>
                                    <hr />
                                    <p><strong>Legend:</strong> Positive &gt; 0.5; 0 &lt; Neutral &lt; 0.5; Negative &lt; 0 </p>
                                </div>
                            </Popup>
                            <CircleMarker
                                radius={item.count * 1.5}
                                center={[item.latitude, item.longitude]}
                                pathOptions={selectSentiment(item, fillGreenOptions, fillOrangeOptions, fillRedOptions)}
                            />

                        </FeatureGroup>
                    </div>
                    )
                })}
            </MapContainer>
        </div>
    )
}
