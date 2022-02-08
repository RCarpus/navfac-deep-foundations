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
  render() {
    return (
      <div className="banner">
        <h1 className="banner__title">NAVFAC Deep Foundation Design</h1>
      </div>
    )
  }


}