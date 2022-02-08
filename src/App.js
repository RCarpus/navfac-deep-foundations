import './App.css';
import Navbar from './components/navbar/navbar';
import WelcomeView from './components/welcome-view/welcomeView';
import LoginView from './components/login-view/loginView';
import RegisterView from './components/register-view/registerView';
import HomeView from './components/home-view/homeView';
import ProfileView from './components/profile-view/profileView';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import React from 'react';
import axios from 'axios';

const API_URL = 'https://navfac-api.herokuapp.com/';


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: false,
    }
  }

  componentDidMount() {
  }

  checkLoginStatus() {
    const token = localStorage.getItem('token');
    const headers = {
      headers: { Authorization: `Bearer ${token}` }
    }
    axios.get(API_URL + 'checktoken', headers)
      .then(response => {
        this.setState({ isLoggedIn: true });
        return response;
      })
      .catch(error => {
        window.location.href = '/';
        return error;
      });
  }

  redirectHomeIfLoggedIn() {
    const token = localStorage.getItem('token');
    const headers = {
      headers: { Authorization: `Bearer ${token}` }
    }
    axios.get(API_URL + 'checktoken', headers)
      .then(response => {
        window.location.href = '/home';
        return response;
      })
      .catch(error => {
        return error;
      });
  }

  render() {
    return (
      <div className="App">
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<WelcomeView />} />
            <Route path="/profile" element={<ProfileView
              checkLoginStatus={() => this.checkLoginStatus()} />} />
            <Route path="/login" element={<LoginView 
            redirectHomeIfLoggedIn={()=>this.redirectHomeIfLoggedIn()}/>} />
            <Route path="/register" element={<RegisterView 
            redirectHomeIfLoggedIn={()=>this.redirectHomeIfLoggedIn()}/>} />
            <Route path="/home" element={<HomeView
              checkLoginStatus={() => this.checkLoginStatus()} />} />
          </Routes>
        </Router>
      </div>
    );
  }

}

export default App;
