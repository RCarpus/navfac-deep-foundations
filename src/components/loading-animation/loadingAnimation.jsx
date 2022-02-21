/**
 * @module LoadingAnimation
 */
import React from "react";
import './loadingAnimation.css';

/**
 * @description Renders a loading animation that hangs out 
 * inside the banner. The CSS was borrowed from the 
 * open-source animation library Whirl
 * https://whirl.netlify.app/
 */
export default function LoadingAnimation(props) {
  const { fullScreen } = props;
  return (
    <div className="loading-animation">
      {fullScreen &&
        <div className="loading-animation-container loading-fullscreen">
          <div className="flippers-alternate">
            <div>&#9632;</div>
            <div>&#9632;</div>
            <div>&#9632;</div>
            <div>&#9632;</div>
            <div>&#9632;</div>
            
          </div>
          <p className="loading-animation-text">Loading...</p>
        </div>}
      {!fullScreen &&
        <div className="loading-animation-container">
          <div className="flippers-alternate">
            <div>&#9632;</div>
            <div>&#9632;</div>
            <div>&#9632;</div>
            <div>&#9632;</div>
            <div>&#9632;</div>
          </div>
          <p className="loading-animation-text">Loading...</p>
        </div>
      }

    </div>
  )
}
