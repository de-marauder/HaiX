import React from 'react'
import { useState } from 'react'


export default function TweetText({item}) {
    const [show, setshow] = useState(false);

    const showMore = () => {
        setshow(!show)
    }

    const tweetShort = (item) => <>{item.tweet.split('').splice(0, 70).join('')} ... <span onClick={showMore}>read more</span></>
    const tweetFull = (item) => <>{item.tweet} <span onClick={showMore}>show less</span></>

    return (
        <>
            {!show ? tweetShort(item) : tweetFull(item)}
        </>
    )
}
