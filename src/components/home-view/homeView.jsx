/**
 * @module HomeView
 */

import React from "react";
import './homeView.css';

/**
 * @description The home view is where logged in user's generally start. 
 * Several buttons are rendered that let the user choose what they want to do.
 * The relative path for this view is "/home".
 * Home view should only be accessible to logged in users, so the 
 * checkLoginStatus() inside componentDidMount() redirects the user to the 
 * WelcomeView "/" if the don't havea valide JWT.
 */
export default class HomeView extends React.Component {

  componentDidMount() {
    this.props.checkLoginStatus();
  }

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