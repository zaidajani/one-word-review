import React from "react";
import "./../App.css";

export const WordWall = ({greetings}) => {
  return (
    <>
      <div className="header">Review wall</div>
      <div className="container">
        {
          greetings.map((greeting) => {
            return (
              <div className="review">{greeting.text}</div>
            )
          })
        }
      </div>
    </>
  );
};
