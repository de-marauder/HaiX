import React from 'react'
import Sentiment from './sentiment';
import TweetText from './tweetText';

export default function Modal(props) {


    // Select tweets from particular location
    const validTweets = props.tweetData.filter((item) => {
        return item.locationCode === props.tweetLocation
    })

    const selectLocationDetails = props.avTweetDetails.find((item) => item.locationCode === props.tweetLocation)

    
    return (
        <div className='modal-wrapper'>
            <div onClick={() => { props.setModal(!props.modalActive) }} className='backdrop'></div>
            <div className='modal'>
                <div className='title'>
                    <h2>Tweets from {props.tweetLocation}</h2>
                    <h2 className='title-sentiment'>Sentiment <Sentiment classOptions={['big']} polarity={selectLocationDetails.average} /></h2>
                </div>
                <div className='tweets'>
                    {validTweets.map((item, id) => {
                        return (
                            <div key={id} className="tweet">
                                <div className='tweet-title'>
                                    <div>
                                        <div className='profile-image'>
                                            <img src={item.profile_image_url} alt='profile-pic' />
                                        </div>
                                        <p><strong>{item.name}</strong> <span>@{item.handler_name}</span></p>
                                    </div>
                                    <div className='date'>
                                        <p>{item.date.split('T').join(', ')}</p>
                                        <Sentiment classOptions={[]} polarity={item.sentimentPolarity} />
                                    </div>
                                </div>
                                <div>
                                    <TweetText item={item} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
