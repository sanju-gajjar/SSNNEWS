import React from 'react'
import Para from './UI/Para'
import NewsHeading from './NewsHeading'
import './NewsUI.css'

function LiveNews({heading}) {
  return (
   <>
        <div className='liveNews_wrap'>
            <NewsHeading heading={'Live News'}/>
                <div className='live-video'>
                    <iframe
                     src="https://youtube.com/embed/8PA0MrkasCY?si=U5Lp1D7m1tFDGGUU"
                     title="News video player" frameborder="0"
                     allow="autoplay; encrypted-media"
                     allowfullscreen>
                    </iframe>
                    <Para color='secondary'>{heading}</Para>
                </div>
        </div>
   </>
  )
}
export default LiveNews