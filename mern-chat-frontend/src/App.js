import './App.css';
import Navigation from './components/Navigation';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chat';
import ForgetPW from './pages/ForgetPW';


function App() {  
  const user = useSelector(state => state.user);

  return (
    <BrowserRouter >
      <div className='app'>
        <Navigation />
        <Routes>
          <Route path='/'>
            <Route index exact element={<Home />} />
            {!user && <>
              <Route path='login' element={<Login />} />
              <Route path='signup' element={<Signup />} />
              <Route path='forgetPw' element={<ForgetPW />} />
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
