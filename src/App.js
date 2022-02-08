import './App.css';
import Navbar from './components/navbar/navbar';
import WelcomeView from './components/welcome-view/welcomeView';
import LoginView from './components/login-view/loginView';
import RegisterView from './components/register-view/registerView';
import HomeView from './components/home-view/homeView';

function App() {
  return (
    <div className="App">
      <Navbar />
      <HomeView />
    </div>
  );
}

export default App;
