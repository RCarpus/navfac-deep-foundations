/**
 * @module RegisterView
 */

import React from "react";
import './registerView.css';
import { Link } from "react-router-dom";
import axios from "axios";
import LoadingAnimation from "../loading-animation/loadingAnimation";

const API_URL = 'https://navfac-api.herokuapp.com/';


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
  constructor(props) {
    super(props);
    this.state = {
      firstNameValid: true,
      lastNameValid: true,
      companyValid: true,
      emailValid: true,
      passwordValid: true,
      isLoading: false,
    }
  }
  componentDidMount() {
    this.props.redirectHomeIfLoggedIn();
  }

  /**
   * Extract the data from the registration form, check the data for validity, 
   * and register the user account. If there is a problem with the data, the 
   * API call will not be made. If the data is valid but the registration fails,
   * it is likely due to a conflict with an existing email in the database. 
   * A window alert will warn the user of this.
   * @param {object} e event object
   */
  register(e) {
    e.preventDefault();
    const FirstName = document
      .getElementById('register__form__first-name').value;
    const LastName = document
      .getElementById('register__form__last-name').value;
    const Email = document
      .getElementById('register__form__email').value;
    const Company = document
      .getElementById('register__form__company').value;
    const Password = document
      .getElementById('register__form__password').value;
    const userInfo = { FirstName, LastName, Email, Company, Password };
    if (this.validateUserInfo(userInfo)) {
      this.setState({ isLoading: true }, () => {
        axios.post(API_URL + 'users/register', userInfo)
          .then(response => {
            console.log(response.data);
            this.setState({ isLoading: false });
            window.location.href = '/login';
          })
          .catch(e => {
            console.error(e);
            this.setState({ isLoading: false });
            window.alert(`Something went wrong. 
            Perhaps that email address is already in use.`);
          });
      })

    }
  }

  /**
   * Check each property of userInfo for compliance with data rules.
   * userInfo should contain each of the following:
   * - firstName
   * - lastName
   * - email
   * - company
   * - password
   * As a side effect, sets state values for each field to render warnings 
   * if inputs are invalid
   * @param {object} userInfo 
   * @returns {boolean} true if all included fields are valid, false otherwise
   */
  validateUserInfo(userInfo) {
    // Define patterns
    let alphaPattern = /^[a-zA-Z\s]+$/;
    let alphaNumericPattern = /^[a-zA-Z\s0-9]+$/;
    // https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression
    let emailPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    // Test each field for validity
    const firstNameValid = alphaPattern.test(userInfo.FirstName);
    const lastNameValid = alphaPattern.test(userInfo.LastName);
    const companyValid = alphaNumericPattern.test(userInfo.Company);
    const passwordValid = userInfo.Password.length >= 8;
    const emailValid = emailPattern.test(userInfo.Email);

    // set state accordingly
    this.setState({
      firstNameValid,
      lastNameValid,
      companyValid,
      passwordValid,
      emailValid,
    });
    if (firstNameValid && lastNameValid && companyValid
      && passwordValid && emailValid) {
      return true;
    } else {
      return false;
    }
  }


  render() {
    const { firstNameValid,
      lastNameValid,
      companyValid,
      passwordValid,
      emailValid,
      isLoading } = this.state;
    return (
      <div className="register">
        {isLoading && <LoadingAnimation />}
        <h2 className="register__title">New User Registration</h2>
        <div className="register__grid">
          <div className="register__grid__item">
            <form className="register__form">
              <div className="register__form__line">
                <label>First Name</label>
                <input id="register__form__first-name" />
                {!firstNameValid && <span>Invalid</span>}
              </div>
              <div className="register__form__line">
                <label>Last Name</label>
                <input id="register__form__last-name" />
                {!lastNameValid && <span>Invalid</span>}
              </div>
              <div className="register__form__line">
                <label>Email</label>
                <input id="register__form__email" />
                {!emailValid && <span>Invalid</span>}
              </div>
              <div className="register__form__line">
                <label>Company</label>
                <input id="register__form__company" />
                {!companyValid && <span>Invalid</span>}
              </div>
              <div className="register__form__line">
                <label>Password</label>
                <input type="password" id="register__form__password" />
                {!passwordValid && <span>Invalid</span>}
              </div>
              <button onClick={(e) => this.register(e)}>Register</button>
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