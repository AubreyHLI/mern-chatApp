import React, { useContext, useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginUserMutation } from '../redux/services/appApi';
import { AppContext } from '../context/appContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loginUser, { isLoading, error }] = useLoginUserMutation();
    const navigate = useNavigate();
    const { socket } = useContext(AppContext);


    const handleLogin = async (e) => {
        e.preventDefault();
        loginUser({ email, password }).then((response) => {
            const { data } = response; 
            if(data) {
                // emit an event named 'new-user'
                socket.emit('new-user');
                navigate('/chat');
            }
        });
    }

  return (
    <Form className='login' onSubmit={handleLogin}>
        <h1 className='text-center login-heading'>Log in to chatapp</h1>

        {error && <p className='alert alert-danger'>{error.data}</p>}

        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} required/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required/>
        </Form.Group>
        <Button variant="primary" type="submit">
            {isLoading ? 'Log in...' :'Log in' }
        </Button>

        <div className='py-4'>
            <p className='text-center'>
                Don't have an account ? <Link to='/signup'>Signup</Link>
            </p>
        </div>
    </Form>  
  )
}

export default Login