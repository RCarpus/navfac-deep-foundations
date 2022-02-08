import './App.css';
import Navbar from './components/navbar/navbar';
import WelcomeView from './components/welcome-view/welcomeView';

function App() {
  return (
    <div className="App">
      <Navbar />
      <WelcomeView />
    </div>
  );
}

export default App;
