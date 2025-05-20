import React from 'react'
import Para from './UI/Para'

function NewsHeading({heading}) {
  return (
    <>
        <div className='newsHeading'>
            <Para variant='subtitle2' color='primary'>{heading}</Para>
        </div>
    </>
  )
}

export default NewsHeading