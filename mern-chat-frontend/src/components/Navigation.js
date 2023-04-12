import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import chatlogo from '../assets/chat.png';
import { useLogoutUserMutation } from '../redux/services/appApi';
import { Avatar } from '@mui/material';
import { AppContext } from '../context/appContext';

const Navigation = () => {
  const user = useSelector(state => state.user);
  const { setIsInit } = useContext(AppContext);
	

  const [ logoutUser ] = useLogoutUserMutation();

  const handleLogout = async (e) => {
    e.preventDefault();
    console.log(user);
    const id = user._id;
    await logoutUser({id});
    setIsInit(false);
    // redirect to home page
    window.location.replace('/');
  }

  return (
    <Navbar bg="light" expand="md">
      <Container fluid='xl' style={{paddingInline: 25}}>
        <LinkContainer to='/'>
            <Navbar.Brand className='d-flex align-items-center'>
                <img src={chatlogo} style={{width:30, height:30}} alt=''/>
                <h4 className='logo-name'>MernChat</h4>
            </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {!user && 
            <LinkContainer to='/login'>
                <Nav.Link>Login</Nav.Link>
            </LinkContainer>
            }
            {user && (<>
            <LinkContainer to='/chat'>
                <Nav.Link>Chat</Nav.Link>
            </LinkContainer>
            <NavDropdown id="basic-nav-dropdown" align='end' className='user-dropdown' title={
              <>
                {user.picture
                ? <Avatar src={user.picture} alt={user.name} className='member-avatar'/>
                : <Avatar className='member-avatar'>{user.name.charAt(0)}</Avatar>
                }
                {user.name}
              </>
            }>
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as="button" onClick={handleLogout}>
                Log out
              </NavDropdown.Item>
            </NavDropdown>
            </>)}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation