/**
 * @module RegisterView
 */

import React from "react";
import './registerView.css';
import { Link } from "react-router-dom";

/**
 * @description RegisterView lets the user create a new account. Because this 
 * view should be inaccessible to logged in users, componentDidMount() includes
 * a call to the prop function redirectHomeIfLoggedIn, which does exactly what 
 * the name indicates.
 * 
 * The account creation form has real-time data validation to prevent 
 * improperly formatted data being sent to the server.
 * 
 * This form also includes a link to the LoginView in case a registered user 
 * accidentally navigated to this page.
 */
export default class RegisterView extends React.Component {
  componentDidMount() {
    this.props.redirectHomeIfLoggedIn();
  }
  render() {
    return (
      <div className="register">
        <h2 className="register__title">New User Registration</h2>
        <div className="register__grid">
          <div className="register__grid__item">
            <form className="register__form">
              <div className="register__form__line">
                <label>First Name</label>
                <input />
              </div>
              <div className="register__form__line">
                <label>Last Name</label>
                <input />
              </div>
              <div className="register__form__line">
                <label>Email</label>
                <input />
              </div>
              <div className="register__form__line">
                <label>Company</label>
                <input />
              </div>
              <div className="register__form__line">
                <label>Password</label>
                <input type="password" />
              </div>
              <button>Register</button>
            </form>
            <div className="register__to-login-container">
              <span>
                Already have an account?
              </span>
              <Link to="/login">Login</Link>
            </div>
          </div>
          <div className="register__grid__item">
            <p>
              Your full name and company name will appear on your calculation 
              reports.
            </p>
            <p>
              Your email is used to log into your account or to recover your 
              account if you forget your password.
            </p>
            <p>
              Your personal information will not be given to anybody for any 
              reason and will not be used for purposes other than those 
              described above.
            </p>
          </div>
        </div>
      </div>
    )
  }
}