import React from "react";
import './homeView.css';

export default class HomeView extends React.Component {
  render() {
    return(
      <div className="home">
        <h2 className="home__title">Get Started</h2>
        <div className="home__grid">
          <button>Load Most Recent</button>
          <button>Create New Project</button>
          <button>Load Project</button>
          <button>Edit Profile</button>
          <button>Load Demo Project</button>
          <button>View Demo Video</button>
          <button>About</button>
        </div>
        <p className="home__plug">
          A personal plug for Ryan Carpus and his portfolio. 
          Very impressive stuff here.
        </p>
      </div>
    )
  }
}