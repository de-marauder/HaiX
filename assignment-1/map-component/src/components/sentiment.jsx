import React from 'react'

export default function Sentiment({ polarity, classOptions }) {
    return (
        <>{
            (polarity >= -1 && polarity < -0.5) ?
                <>
                    <div className={`sentiment-marker bad ${classOptions.join(' ')}`}></div>
                    <span className='sentiment-marker-text'>Bad</span>
                </>
                :
                (polarity > -0.5 && polarity < 0.5) ?
                    <>
                        <div className={`sentiment-marker neutral ${classOptions.join(' ')}`}></div>
                        <span className='sentiment-marker-text'>Neutral</span>
                    </>
                    :
                    (polarity > -0.5 && polarity < 1) ?
                        <>
                            <div className={`sentiment-marker good ${classOptions.join(' ')}`}></div>
                            <span className='sentiment-marker-text'>Good</span>
                        </>
                        : ''
        }</>
    )
}

