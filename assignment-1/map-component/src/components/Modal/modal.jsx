import React, { useRef, useState } from 'react'
import { CgClose } from 'react-icons/cg'
import Draggable from 'react-draggable';
import Sentiment from '../Sentiment/sentiment';
import TweetText from '../TweetText/tweetText';

import classes from './Modal.module.scss'

export default function Modal(props) {

    const modalRef = useRef()

    // Select tweets from particular location
    const validTweets = props.tweetData.filter((item) => {
        return item.locationCode === props.tweetLocation
    })

    const clicked = () => {
        const activeModal = document.querySelector('.move_forward');
        activeModal?.classList.remove('move_forward');

        modalRef.current.classList.add('move_forward')
    }

    const selectLocationDetails = props.avTweetDetails.find((item) => item.locationCode === props.tweetLocation)

    return (

        <Draggable>
            <div ref={modalRef} onClick={clicked}>
                <div className={classes.modal_wrapper}>
                    <div className={classes.modal}>
                        <div className={classes.title}>
                            <div className={classes.close} onClick={props.closeModal}>
                                <CgClose />
                            </div>
                            <h2>Tweets from {props.tweetLocation}</h2>
                            <h2 className={classes.title_sentiment}>Av. sentiment <Sentiment classOptions={['big']} polarity={selectLocationDetails.average} /></h2>
                        </div>
                        <div className={classes.tweets}>
                            {validTweets.map((item, id) => {
                                return (
                                    <div key={id} className={classes.tweet}>
                                        <div className={classes.tweet_title}>
                                            <div>
                                                <div className={classes.profile_image}>
                                                    <img src={item.profile_image_url} alt='profile-pic' />
                                                </div>
                                                <p><strong>{item.name}</strong> <a href={`https://twitter.com/${item.handler_name}`} target='_blank'><span>@{item.handler_name}</span></a></p>
                                            </div>
                                            <div className={classes.date}>
                                                <p>{item.date.split('T').join(', ')}</p>
                                                <Sentiment classOptions={[]} polarity={item.sentimentPolarity} />
                                            </div>
                                        </div>
                                        <div>
                                            <TweetText item={item} />
                                        </div>
                                        <a className={classes.tweet_link} href={`https://twitter.com/i/web/status/${item._id}`} target='_blank'>
                                            Goto tweet
                                        </a>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </Draggable>
    )
}
