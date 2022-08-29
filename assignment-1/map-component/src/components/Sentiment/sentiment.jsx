import { FaRegSmileBeam, FaRegMehBlank } from 'react-icons/fa'
import { CgSmileSad } from 'react-icons/cg'

import classes from './Sentiment.module.scss'


export default function Sentiment({ polarity, classOptions }) {
    return (
        <>{
            (polarity >= -1 && polarity < 0) ?
                <>
                    {/* <div className={`${classes.sentiment_marker} ${classes.bad} bad ${classOptions.join(' ')}`}></div> */}
                    <CgSmileSad className={`${classes.sentiment_marker} ${classes.bad} bad ${classOptions.join(' ')}`} />
                    <span className={`${classes.sentiment_marker_text}`}>Negative</span>
                </>
                :
                (polarity >= 0 && polarity < 0.5) ?
                    <>
                        {/* <div className={`${classes.sentiment_marker} ${classes.neutral} neutral ${classOptions.join(' ')}`}></div> */}
                        <FaRegMehBlank className={`${classes.sentiment_marker} ${classes.neutral} neutral ${classOptions.join(' ')}`} />
                        <span className={`${classes.sentiment_marker_text}`}>Neutral</span>
                    </>
                    :
                    (polarity >= 0.5 && polarity <= 1) ?
                        <>
                            {/* <div className={`${classes.sentiment_marker} ${classes.good} good ${classOptions.join(' ')}`}></div> */}
                            <FaRegSmileBeam className={`${classes.sentiment_marker} ${classes.good} good ${classOptions.join(' ')}`} />
                            <span className={`${classes.sentiment_marker_text}`}>Positive</span>
                        </>
                        : ''
        }</>
    )
}

