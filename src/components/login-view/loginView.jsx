import React from "react";
import './loginView.css';

export default class LoginView extends React.Component {
  render() {
    return (
      <div className="login">
        <h2 className="login__title">Returning User Login</h2>
        <form className="login__form">
          <div className="login__form__line">
            <label>Email</label>
            <input />
          </div>
          <div className="login__form__line">
            <label>Password</label>
            <input type="password" />
          </div>
          <button>Login</button>
        </form>
        <div className="login__to-registration-container">
          <span>
            Need an account?
          </span>
          <button>Register</button>
        </div>
      </div>
    )
  }
}