import React, { useContext, useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useChangePwMutation } from '../redux/services/appApi';


const ForgetPW = () => {
    const [email, setEmail] = useState('');
    const [answer, setAnswer] = useState('');
    const [newPw, setNewPw] = useState('');

    const navigate = useNavigate();
    const [changePw] = useChangePwMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        changePw({ email, newPw, answer }).then((response) => {
            const { data } = response; 
            if(data) {
                navigate('/login');
            }
        });
    }

    return (
    <Form className='login' onSubmit={handleSubmit}>
        <h1 className='text-center login-heading'>Forget Password</h1>

        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} required/>
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label>Answer</Form.Label>
            <Form.Control type="text" placeholder="Answer" value={answer} onChange={e => setAnswer(e.target.value)} required/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>NewPassword</Form.Label>
            <Form.Control type="password" placeholder="New Password" value={newPw} onChange={e => setNewPw(e.target.value)} required/>
        </Form.Group>
        <Button variant="primary" type="submit" style={{width: 80}}>
            Change Password
        </Button>
    </Form>  
    )
}

export default ForgetPW