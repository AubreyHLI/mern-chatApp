import './App.css';
import Navigation from './components/Navigation';
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chat';
import { useSelector } from 'react-redux';


function App() {  
  const user = useSelector(state => state.user);

  return (
    <BrowserRouter >
      <div className='app'>
        <Navigation />
        <Routes>
          <Route path='/'>
            <Route index element={<Home />} />
            {!user && <>
            <Route path='login' element={<Login />} />
            <Route path='signup' element={<Signup />} />
            </>
            }
            {user && 
            <Route path='chat' element={<Chat />} />
            }
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
