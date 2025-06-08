import React from "react";
import NewsHeading from "./NewsHeading";
import Para from "./UI/Para";

function TechNews({newList,handleReadMore}){

  //const tech = newList.filter(e=> e.tags.includes('Technology'))
  const tech = newList;
    return(<>
     <NewsHeading heading={'Technology'}/>
     <ul className="newsBoxContainer">
    {
        tech.map((news)=>

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
               
    
    </>)
}

export default TechNews