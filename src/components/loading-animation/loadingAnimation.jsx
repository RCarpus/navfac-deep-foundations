/**
 * @module LoadingAnimation
 */
import React from "react";
import './loadingAnimation.css';

/**
 * @description Renders a loading animation that covers the whole screen 
 * except for the banner. After some time, an additional message indicates 
 * that the server is waking up.
 */
export default class LoadingAnimation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      serverIsSleeping: false,
    }
    setTimeout(() => { this.setState({ serverIsSleeping: true }) }, 1400);
  }
  render() {
    let { serverIsSleeping } = this.state;
    return (
      <div className="loading-animation">
        <div className="loading-animation-container">
          <div className="flippers-alternate">
            <div>&#9632;</div>
            <div>&#9632;</div>
            <div>&#9632;</div>
            <div>&#9632;</div>
            <div>&#9632;</div>
          </div>
          <p>Loading...</p>
          {serverIsSleeping &&
            <p>The server is waking up...</p>}
        </div>

      </div>
    )
  }
}