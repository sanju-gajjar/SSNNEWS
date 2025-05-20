import React from 'react'
import NewsHeading from './NewsHeading'
import Para from './UI/Para'

function CrimeNews({newList,handleReadMore}) {
  const crime = newList.filter(e=> e.tags.includes('Crime'))

  return (
    <>
        <NewsHeading heading={'Crime'}/>
         <div className="news-list-wrap">
                {crime.map((news)=>

                        <li key={news._id} className='newsCrime-item' 
                        onClick={() => handleReadMore(news._id)}>
                                  <div className="news-thumbnail">
                            <img src={news?.image} alt={news.title} />                          
                        </div>
                          <div className="news-content">
                            <Para variant='caption' className="newsBox-title">{news.title}</Para>
                           
                         {/* <p className="news-summary">{news.content.substring(0, 100)}...</p> */}
                        </div>
                        </li>
                
                )}
                </div>
    </>
  )
}

export default CrimeNews