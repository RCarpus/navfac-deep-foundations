/**
 * @module HomeView
 */

import React from "react";
import './homeView.css';
import { Link } from "react-router-dom";

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
    const currentProject = localStorage.getItem('currentProject');
    return (
      <div className="home">
        <h2 className="home__title">Get Started</h2>
        <div className="home__grid">
          {currentProject &&
            <Link to="/edit-project">Load Most Recent</Link>
          }
          <Link to="/new-project">Create New Project</Link>
          <Link to="/load-project">Load Project</Link>
          <Link to="/profile">Edit Profile</Link>
          <a href="https://www.youtube.com/channel/UCtsTjZ60eEUL7QC_wtlkKQw"
            target="_blank">View Demo Video</a>
          <a href="https://github.com/RCarpus/navfac-deep-foundations"
            target="_blank">About</a>
        </div>
        <p className="home__plug">
          A personal plug for Ryan Carpus and his portfolio.
          Very impressive stuff here.
        </p>
      </div>
    )
  }
}