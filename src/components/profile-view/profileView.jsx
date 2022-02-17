/**
 * @module ProfileView
 */

import React from "react";
import './profileView.css';
import axios from "axios";
import LoadingAnimation from "../loading-animation/loadingAnimation";
const API_URL = 'https://navfac-api.herokuapp.com/';


/**
 * @description ProfileView allows the user to view their personal details 
 * or update them. Fields are inactive by default, but can be set to active 
 * by clicking the "edit" button. Real-time data validation prevents the user 
 * from submitted improperly formatted data to the server.
 * 
 * The bottom of the view has a "Delete Account" button. To avoid accidental 
 * account deletion, the user is prompted to enter their email address and 
 * confirm their decision before deleting the account. 
 * 
 * If the account is deleted, the login info is cleared from localStorage 
 * and the user is redirected to the WelcomeView.
 */
export default class ProfileView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      firstNameValid: true,
      lastNameValid: true,
      companyValid: true,
      passwordValid: true,
      emailValid: true,
      successfullyUpdated: false,
      deleteAccountFailed: false,
      userInfo: {
        FirstName: '',
        LastName: '',
        Company: '',
        Email: '',
      },
    }
  }

  /**
   * When the profile component loads, check the token for validity and 
   * redirect the user if needed, and download the user's info to be useed 
   * as form placeholders.
   * @param {object} props none
   */
  componentDidMount(props) {
    this.props.checkLoginStatus();
    this.getUserInfo();
  }

  /** 
   * Gets the user's profile info from the server and save into 
   * state. This info is then used to display placeholder text in 
   * the form.
   */
  getUserInfo() {
    const ID = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    const headers = {
      headers: { Authorization: `Bearer ${token}` }
    };
    this.setState({ isLoading: true }, () => {
      axios.get(API_URL + `users/${ID}`, headers)
        .then(response => {
          this.setState({
            userInfo: {
              FirstName: response.data.FirstName,
              LastName: response.data.LastName,
              Email: response.data.Email,
              Company: response.data.Company
            },
            isLoading: false,
          });
        })
        .catch(error => {
          console.error(error);
          this.setState({ isLoading: false });
        })
    })

  }

  /**
   * Extract the data from the profile form, check the data for validity,
   * and update the user profile with the updated information. If there is 
   * a problem with the data, the API call will not be made. If the data is 
   * valid but the update fails, it is likely due to a conflict with an 
   * existing email in the database.
   * A window alert will warn the user of this.
   * @param {object} e event object
   */
  updateUserInfo(e) {
    e.preventDefault();
    // Extract values from the form
    const FirstName = document.
      getElementById('profile__form__first-name').value;
    const LastName = document.
      getElementById('profile__form__last-name').value;
    const Email = document.
      getElementById('profile__form__email').value;
    const Company = document.
      getElementById('profile__form__company').value;
    const Password = document.
      getElementById('profile__form__password').value;

    // aggregate the non-empty values into userInfo
    let userInfo = {};
    if (FirstName) userInfo.FirstName = FirstName;
    if (LastName) userInfo.LastName = LastName;
    if (Email) userInfo.Email = Email;
    if (Company) userInfo.Company = Company;
    if (Password) userInfo.Password = Password;

    if (this.validateUpdatedUserInfo(userInfo)) {
      const ID = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      const headers = {
        headers: { Authorization: `Bearer ${token}` }
      };
      this.setState({ isLoading: true }, () => {
        // Send updated info to the server and set the state with the 
        // returned new user info.
        axios.put(API_URL + `users/${ID}`, userInfo, headers)
          .then(response => {
            this.setState({
              userInfo: {
                FirstName: response.data.updatedUser.FirstName,
                LastName: response.data.updatedUser.LastName,
                Company: response.data.updatedUser.Company,
                Email: response.data.updatedUser.Email,
              },
              successfullyUpdated: true,
              isLoading: false,
            });
            return response.data;
          })
          .catch(error => {
            console.error(error);
            this.setState({ isLoading: false });
            window.alert(`Failed to update user data. 
            The email may already be in use.`);
          });
      })
    }
  }

  /**
   * Check each property of userInfo for compliance with data rules.
   * userInfo can contain any of the following, each of which is optional:
   * - FirstName
   * - LastName
   * - Email
   * - Company
   * - Password
   * As a side effect, sets state values for each field to render warnings if 
   * inputs are invalid. Note that if a value is not provided for a given 
   * piece of userInfo, the value would not be sent to the server, but the 
   * valid state would be set to true because we don't need to see a warning.
   * @param {object} userInfo 
   * @returns {boolean} true if all included fields are valid, false otherwise
   */
  validateUpdatedUserInfo(userInfo) {
    // initialize validity of inputs
    let firstNameValid = true,
      lastNameValid = true,
      companyValid = true,
      passwordValid = true,
      emailValid = true;
    // Define patterns
    let alphaPattern = /^[a-zA-Z\s]+$/;
    let alphaNumericPattern = /^[a-zA-Z\s0-9]+$/;
    // https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression
    let emailPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    // Test each field for validity only if it is not blank
    if (userInfo.FirstName)
      firstNameValid = alphaPattern.test(userInfo.FirstName);
    if (userInfo.LastName)
      lastNameValid = alphaPattern.test(userInfo.LastName);
    if (userInfo.Company)
      companyValid = alphaNumericPattern.test(userInfo.Company);
    if (userInfo.Password)
      passwordValid = userInfo.Password.length >= 8;
    if (userInfo.Email)
      emailValid = emailPattern.test(userInfo.Email);

    // Set state accordingly
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

  /**
   * Deletes the user's account. 
   * Prior to deletion, the user is prompted to enter their email address.
   * If the email is not correct or if the user cancels, the account will 
   * not be deleted.
   * Upon succesful deletion, localStorage is cleared and the page is reloaded,
   * triggering a redirect to the welcome view.
   * @param {string} email the user's email address 
   * @returns null or false
   */
  deleteAccount(email) {
    const promptText = `Are you sure you want to delete your account? 
    This cannot be undone. Your profile and projects will all be erased.
    To confirm that you want to DELETE your account, enter your email.
    ${email}`;
    const confirmed = window.prompt(promptText);
    console.log(confirmed);
    if (confirmed !== email) {
      this.setState({ deleteAccountFailed: true });
      return;
    }
    const ID = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const headers = {
      headers: { Authorization: `Bearer ${token}` }
    };
    axios.delete(API_URL + `users/${ID}`, headers)
      .then(response => {
        localStorage.clear();
        window.location.reload();
        return false;
      })
      .catch(error => {
        console.error(error);
        window.alert('Failed to delete. Guess we\'re stuck with you.');
      });

  }

  render() {
    const { userInfo,
      successfullyUpdated,
      firstNameValid,
      lastNameValid,
      companyValid,
      passwordValid,
      emailValid,
      deleteAccountFailed,
      isLoading } = this.state;
    console.log(userInfo);
    return (
      <div className="profile">
        {isLoading && <LoadingAnimation />}
        <h2 className="profile__title">
          User Profile
        </h2>
        <form className="profile__form">
          <div className="profile__form__line">
            <label>First Name</label>
            <input id="profile__form__first-name"
              placeholder={userInfo.FirstName} />
            {!firstNameValid && <span className="invalid">Invalid</span>}
          </div>
          <div className="profile__form__line">
            <label>Last Name</label>
            <input id="profile__form__last-name"
              placeholder={userInfo.LastName} />
            {!lastNameValid && <span className="invalid">Invalid</span>}
          </div>
          <div className="profile__form__line">
            <label>Email</label>
            <input id="profile__form__email"
              placeholder={userInfo.Email} />
            {!emailValid && <span className="invalid">Invalid</span>}
          </div>
          <div className="profile__form__line">
            <label>Company</label>
            <input id="profile__form__company"
              placeholder={userInfo.Company} />
            {!companyValid && <span className="invalid">Invalid</span>}
          </div>
          <div className="profile__form__line">
            <label>Password</label>
            <input type="password" id="profile__form__password" />
            {!passwordValid && <span className="invalid">Invalid</span>}
          </div>
          <button id="update-profile-btn" 
          onClick={(e) => this.updateUserInfo(e)}>save</button>
          {successfullyUpdated && 
          <span id="profile-saved">Saved</span>}
        </form>
        <h3 className="profile__title">
          --- Danger Zone ---
        </h3>
        <button id="delete-account-btn"
          onClick={() => this.deleteAccount(userInfo.Email)}>Delete Account</button>
        {deleteAccountFailed && <span>Failed to delete account</span>}

      </div>
    )
  }
}