import React from "react";
import './profileView.css';

export default class ProfileView extends React.Component {
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