import React from 'react'
import Para from './UI/Para'
import NewsHeading from './NewsHeading'
import './NewsUI.css'

function LiveNews({ heading, video }) {
  return (
    <>
      <div className='liveNews_wrap'>
        <NewsHeading heading={heading || 'Live News'} />
        <div className='live-video'>
          <iframe
            src={video ? video : 'https://youtube.com/embed/8PA0MrkasCY?si=U5Lp1D7m1tFDGGUU'}
            title="News video player"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ width: '100%', minHeight: 220, borderRadius: 12 }}
          />
          <Para color='secondary'>{heading}</Para>
        </div>
      </div>
    </>
  );
}
export default LiveNews