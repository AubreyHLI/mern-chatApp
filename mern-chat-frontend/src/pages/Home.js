import React from 'react';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import homebg from '../assets/home-bg-light.jpg';

const Home = () => {
  const user = useSelector(state => state.user);

  return (
    <div className='home' >
        <h1>Share the world with your friends</h1>
        <p>MernChat lets you connect with the world</p>
        <LinkContainer to={ !user ? "/login" : "/chat"}>
            <Button variant="success">
                Get Started
            </Button>
        </LinkContainer>
    </div>   
  )
}

export default Home