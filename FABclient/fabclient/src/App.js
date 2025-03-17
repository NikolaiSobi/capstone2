import './App.css';
import './pages/css/tools.css'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Friends from './pages/friends';
import Game from './pages/game'
import Cards from './pages/cards';
import Navbar from './components/navbar';
import Login from './pages/login';
import Decks from './pages/decks';
import { useState } from 'react';

function App() {
  const [login, setLogin] = useState(true)

  const hideLogin = () => {
    setLogin(!login)
  }

  return (
    <div className="App">
      
      <Navbar hideFunction={hideLogin} />
      <div className='lines-left'>
        <div className='lines-left2'></div>
      </div>
      <div className='lines-right'>
        <div className='lines-right2'></div>
      </div>
      <div className={login ? 'hide' : ''}>
        <Login hideFunction={hideLogin} />
      </div>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/friends" element={<Friends />} />
        <Route path="/game" element={<Game />} />
        <Route path="/cards" element={<Cards />} />
        <Route path="/decks" element={<Decks />} />
      </Routes>
    </div>
  );
}

export default App;
