import { useState } from "react";
import "./ReadMore.css";

const ReadMore = ({ text, maxWords = 5,className }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Split the text into words and handle the maxWords limit
  const words = text ? text.split(" ") : [];
  const displayedText = words.slice(0, maxWords).join(" ");

  return (
    <div className={`read-more-container ${isExpanded ? "expanded" : "collapsed"}`}>
      <p className={`read-more-text ${className}`}>
        {isExpanded ? text : `${displayedText}${words.length > maxWords ? "..." : ""}`}
      
      {words.length > maxWords && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className={`read-more-button  ${isExpanded ? "expanded-btn" : "collapsed-btn"}`}
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      )}</p>
    </div>
  );
};

export default ReadMore;
