import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import MessageForm from '../components/MessageForm';
import Sidebar from '../components/Sidebar';

const Chat = () => {
  return (
    <Container fluid='xxl' className='chat-container'>
        <Row style={{height:'100%'}}>
            <Col md={4} xl={3} className='chat-sidebar'>
                <Sidebar />
            </Col>
            
            <Col md={8} xl={9} className='chat-message'>
                <MessageForm />
            </Col>
        </Row>
    </Container>
  )
}

export default Chat