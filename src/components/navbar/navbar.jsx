/**
 * @module Navbar
 */
import React from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';

/**
 * @description Navbar is pinned to the top of the screen at all times.
 * (See App component.) 
 * If the user is logged in, renders navigation links.
 * @param {boolean} isLoggedIn true if the user is logged in, else false
 */
export default function Navbar(props) {
  /**
   * Logs out the user by clearing localStorage, and reloads the page. 
   * This will cause them to be redirected to WelcomeView.
   * @param {object} e event object
   * @returns false
   */
  function logout(e) {
    e.preventDefault();
    localStorage.clear();
    window.location.href = '/';
    return false;
  }

  const { isLoggedIn } = props;
  return (
    <div className="banner">
      {isLoggedIn &&
        <div className="banner__links">
          <button className="banner__link" onClick={(e) => logout(e)}>Logout</button>
          <Link className="banner__link" to="/home">Home</Link>
        </div>
      }
      <h1 className="banner__title">NAVFAC Deep Foundation Design</h1>
    </div>
  )
}