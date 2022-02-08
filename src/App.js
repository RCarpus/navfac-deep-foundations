import './App.css';
import Navbar from './components/navbar/navbar';
import WelcomeView from './components/welcome-view/welcomeView';
import LoginView from './components/login-view/loginView';
import RegisterView from './components/register-view/registerView';
import HomeView from './components/home-view/homeView';
import ProfileView from './components/profile-view/profileView';

function App() {
  return (
    <div className="App">
      <Navbar />
      <ProfileView />
    </div>
  );
}

export default App;
