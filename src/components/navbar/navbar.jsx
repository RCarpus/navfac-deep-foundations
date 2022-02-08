/**
 * @module Navbar
 */
import React from 'react';
import './navbar.css';

/**
 * @description Navbar is pinned to the top of the screen at all times.
 * (See App component.) 
 * If the user is logged in, renders navigation links.
 */
export default class Navbar extends React.Component {

  /**
   * Logs out the user by clearing localStorage, and reloads the page. 
   * This will cause them to be redirected to WelcomeView.
   * @param {object} e event object
   * @returns false
   */
  logout(e) {
    e.preventDefault();
    localStorage.clear();
    window.location.reload();
    return false;
  }

  render() {
    const { isLoggedIn } = this.props;
    return (
      <div className="banner">
        <h1 className="banner__title">NAVFAC Deep Foundation Design</h1>
        {this.props.isLoggedIn &&
          <button onClick={(e)=>this.logout(e)}>logout</button>
        }

      </div>
    )
  }


}