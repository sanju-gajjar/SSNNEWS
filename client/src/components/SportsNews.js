import React from 'react'
import NewsHeading from './NewsHeading'
import Para from './UI/Para'

function SportsNews({newList,handleReadMore}) {

      const sport = newList.filter(e=> e.tags.includes('Sports'))
  return (
    <>
   <NewsHeading heading={'Sports'}/>
     <ul className="newsBoxContainer">
    {
        sport.map((news)=>

                        <li key={news._id} className='newsBox-item' 
                        onClick={() => handleReadMore(news._id)}>
                                  <div className="newsBox-thumbnail">
                            <img src={news?.image} alt={news.title} />                          
                        </div>
                          <div className="newsBox-content">
                            <Para variant='caption' className="newsBox-title">{news.title}</Para>
                           
                         {/* <p className="news-summary">{news.content.substring(0, 100)}...</p> */}
                        </div>
                        </li>
                
                )
    }
    </ul>
   </>            
  )
}

export default SportsNews