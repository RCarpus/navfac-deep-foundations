import './App.css';
import Navbar from './components/navbar/navbar';
import WelcomeView from './components/welcome-view/welcomeView';
import LoginView from './components/login-view/loginView';
import RegisterView from './components/register-view/registerView';
import HomeView from './components/home-view/homeView';
import ProfileView from './components/profile-view/profileView';
import NewProjectView from './components/new-project-view/newProjectView';
import LoadProjectView from './components/load-project-view/loadProjectView';
import ProjectEditView from './components/project-edit-view/projectEditView';
import AnalysisView from './components/analysis-view/analysisView';

import {
  HashRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import React from 'react';
import axios from 'axios';
import LoadingAnimation from './components/loading-animation/loadingAnimation';

const API_URL = 'https://navfac-api.herokuapp.com/';


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: false,
      isLoading: false,
    }
  }

  componentDidMount() {
  }

  checkLoginStatus() {
    const token = localStorage.getItem('token');
    const headers = {
      headers: { Authorization: `Bearer ${token}` }
    }
    this.setState({ isLoading: true }, () => {
      axios.get(API_URL + 'checktoken', headers)
        .then(response => {
          this.setState({
            isLoggedIn: true,
            isLoading: false,
          });
          return response;
        })
        .catch(error => {
          this.setState({
            isLoggedIn: false,
            isLoading: false,
          });
          window.location.href = '/';
          return error;
        });
    })

  }

  redirectHomeIfLoggedIn() {
    const token = localStorage.getItem('token');
    const headers = {
      headers: { Authorization: `Bearer ${token}` }
    }
    this.setState({ isLoading: true }, () => {
      axios.get(API_URL + 'checktoken', headers)
        .then(response => {
          this.setState({ isLoading: false });
          window.location.href = '/#/home';
          return response;
        })
        .catch(error => {
          this.setState({ isLoading: false });
          return error;
        });
    });

  }

  render() {
    const { isLoggedIn, isLoading } = this.state;
    return (
      <div className="App">
        {isLoading && <LoadingAnimation />}
        <Router>
          <Navbar isLoggedIn={isLoggedIn} />
          <Routes>
            <Route path="/" element={<WelcomeView />} />
            <Route path="/profile" element={<ProfileView
              checkLoginStatus={() => this.checkLoginStatus()} />} />
            <Route path="/login" element={<LoginView
              redirectHomeIfLoggedIn={() => this.redirectHomeIfLoggedIn()} />} />
            <Route path="/register" element={<RegisterView
              redirectHomeIfLoggedIn={() => this.redirectHomeIfLoggedIn()} />} />
            <Route path="/home" element={<HomeView
              checkLoginStatus={() => this.checkLoginStatus()} />} />
            <Route path="/new-project" element={<NewProjectView
              checkLoginStatus={() => this.checkLoginStatus()} />} />
            <Route path="/load-project" element={<LoadProjectView
              checkLoginStatus={() => this.checkLoginStatus()} />} />
            <Route path="/edit-project" element={<ProjectEditView
              checkLoginStatus={() => this.checkLoginStatus()} />} />
            <Route path="analyze" element={<AnalysisView
              checkLoginStatus={() => this.checkLoginStatus()} />} />
          </Routes>
        </Router>
      </div>
    );
  }

}

export default App;
