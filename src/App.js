import './App.css';
import Navbar from './components/navbar/navbar';
import WelcomeView from './components/welcome-view/welcomeView';
import LoginView from './components/login-view/loginView';
import RegisterView from './components/register-view/registerView';

function App() {
  return (
    <div className="App">
      <Navbar />
      <RegisterView />
    </div>
  );
}

export default App;
