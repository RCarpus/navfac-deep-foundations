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
            <Link className="home-link" to="/edit-project">Load Most Recent</Link>
          }
          <Link className="home-link" to="/new-project">Create New Project</Link>
          <Link className="home-link" to="/load-project">Load Project</Link>
          <Link className="home-link" to="/clone-project">Clone Project</Link>
          <Link className="home-link" to="/profile">Edit Profile</Link>
          <a className="home-link"
            href="https://www.youtube.com/watch?v=Rb0EnvPmI84"
            target="_blank">View Demo Video</a>
          <a className="home-link"
            href="https://github.com/RCarpus/navfac-deep-foundations"
            target="_blank">About</a>
        </div>
        <p className="home__plug">
          I'm Ryan Carpus! I made this website because I love solving engineering
          problems and writing code. To see some of my other work,&#160;
          <a href="https://rcarpus.github.io" target="_blank">
            check out my portfolio
          </a>
          . I am currently seeking work as a web developer, either onsite in
          Ann Arbor, Michigan or remote, so drop me a line if you are a recruiter!
        </p>
      </div>
    )
  }
}