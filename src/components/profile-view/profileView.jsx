/**
 * @module ProfileView
 */

import React from "react";
import './profileView.css';

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
  componentDidMount(props) {
    this.props.checkLoginStatus();
  }
  render() {
    return (
      <div className="profile">
        <h2 className="profile__title">
          User Profile
        </h2>
        <button className="profile__enable-edit-button">edit</button>
        <form className="profile__form">
          <div className="profile__form__line">
            <label>First Name</label>
            <input />
          </div>
          <div className="profile__form__line">
            <label>Last Name</label>
            <input />
          </div>
          <div className="profile__form__line">
            <label>Email</label>
            <input />
          </div>
          <div className="profile__form__line">
            <label>Company</label>
            <input />
          </div>
          <div className="profile__form__line">
            <label>Password</label>
            <input type="password" />
          </div>
          <button>save</button>
        </form>
        <h3 className="profile__title">
          --- Danger Zone ---
        </h3>
        <button id="delete-account-btn">Delete Account</button>

      </div>
    )
  }
}