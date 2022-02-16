/**
 * @module HomeView
 */

import React from "react";
import './loginView.css';
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = 'https://navfac-api.herokuapp.com/';

/**
 * @param {function} redirectHomeIfLoggedIn Redirects the user to the 
 * HomeView if the user is already logged in.
 * @description LoginView contains a login form and a link to the 
 * RegisterView in case an unregistered user mistakenly navigated here.
 */
export default class LoginView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      // Setting to true renders a warning message
      loginFailed: undefined,
    }
  }

  /**
   * LoginView should be inaccessible to a logged in user. This checks to see 
   * if the user is already logged in and redirects to HomeView if they are 
   * logged in.
   */
  componentDidMount() {
    this.props.redirectHomeIfLoggedIn();
  }

  /**
   * Extracts the values from the email and password fields and attempts to 
   * login the user with those credentials. If the login is sucessful, the user
   * is redirected to HomeView. If the login fails, a warning message 
   * indicates to the user that their credentials were invalid.
   * @param {object} e event object
   */
  handleLogin(e) {
    e.preventDefault();
    const Email = document.getElementById('login__form__email').value;
    const Password = document.getElementById('login__form__password').value;
    const credentials = { Email, Password };
    axios.post(API_URL + 'login', credentials)
      .then(response => {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', response.data.user._id);
        window.location.href = '/#/home';
      })
      .catch(error => {
        console.error(error);
        this.setState({ loginFailed: true });
      });
  }

  render() {
    const { loginFailed } = this.state;
    return (
      <div className="login">
        <h2 className="login__title">Returning User Login</h2>
        <div className="login__failed__container">
          {loginFailed &&
            <p className="login__failed">Login Failed. Check your credentials and try again.</p>
          }
        </div>

        <form id="login__form">
          <div className="login__form__line">
            <label>Email</label>
            <input id="login__form__email" />
          </div>
          <div className="login__form__line">
            <label>Password</label>
            <input id="login__form__password" type="password" />
          </div>
          <button className="login-btn"
            onClick={(e) => this.handleLogin(e)}>
            Login
          </button>
        </form>
        <div className="login__to-registration-container">
          <span className="login__to-registration__text">
            Need an account?
          </span>
          <Link to="/register">Register</Link>
        </div>
      </div>
    )
  }
}