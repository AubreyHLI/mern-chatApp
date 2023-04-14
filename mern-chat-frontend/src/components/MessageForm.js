import React, { useContext, useEffect, useRef, useState } from 'react';
import { Badge, Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { AppContext } from '../context/appContext';
import { Avatar } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import emojiData from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

const MessageForm = () => {
    const user = useSelector(state => state.user);
    const [messageInput, setMessageInput] = useState("");
    const [showEmojis, setShowEmojis] = useState(false);
    const [lgImgShow, setLgImgShow] = useState(false);
    const [clickedImg, setClickedImg] = useState(null);
    const {socket, currentRoom, messages, setMessages, privateMemberMsg} = useContext(AppContext);
    const messageEndRef = useRef(null);
    const emojiDivRef = useRef(null);

    useEffect(() => {
        if(showEmojis) {
            document.addEventListener('click', handleClickOutside, true);
            return () => {
                console.log('clean up called');
                document.removeEventListener('click', handleClickOutside, true);
            }
        }
    }, [showEmojis]);


    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView();
    }


    socket.off('room-messages').on('room-messages', roomMsgs => {
        setMessages(roomMsgs);
        setMessageInput("");
        // console.log('roomMsgs:', roomMsgs);
    })


    const getFormmatedDate = () => {
        const date = new Date();
        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString();
        let day = date.getDate().toString();

        month = month.length > 1 ? month : `0${month}`;
        day = day.length > 1 ? day : `0${day}`;

        return `${year}/${month}/${day}`;
    }


    const getFormmatedTime = () => {
        const today = new Date();
        let hours = today.getHours();
        let minutes = today.getMinutes();

        hours = hours > 10 ? hours : `0${hours}`;
        minutes = minutes > 10 ? minutes : `0${minutes}`; 

        return `${hours}:${minutes}`;
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        if(!messageInput) return;
        const todayDate = getFormmatedDate();
        const time = getFormmatedTime();
        socket.emit('room-newMessage', currentRoom, messageInput, user, time, todayDate);
        setMessageInput("");
    }


    const handleAddEmoji = (e) => {
        let sym = e.unified.split("-");
        let codesArray = [];
        sym.forEach( el => codesArray.push("0x" + el) );
        let emoji = String.fromCodePoint(...codesArray);
        setMessageInput(prevInput => prevInput + emoji);
    }


    const handleAddAttachment = (e) => {
        const reader = new FileReader();
        if(e.target.files[0]) {
            if (e.target.files[0].size >= 2097152) {
                return alert('Max file size is 2mb');
            } 
            reader.readAsDataURL(e.target.files[0]);
            
            reader.onload = (event) => {
                const todayDate = getFormmatedDate();
                const time = getFormmatedTime();
                console.log('currentRoom:', currentRoom);
                socket.emit('file-message', currentRoom, event.target.result, user, time, todayDate);
            }
        }
    }


    const handleClickOutside = (e) => {
        console.log('emojiDivRef.current:', emojiDivRef.current);
        if(emojiDivRef.current && !emojiDivRef.current.contains(e.target)){
            setShowEmojis(false);
            console.log('click outside')
        } else if (!emojiDivRef.current) {
            console.log('2. emojiDivRef.current: mull');
        } else {
            console.log('click inside div')
        }
    }


    const handleClickImage = (imgUrl) => {
        setClickedImg(imgUrl); 
        setLgImgShow(true);
    }


    return (
    <div className='message-form'>
        {user && <div className='message-output-heading'>
            {!privateMemberMsg?._id 
            ? <><GroupIcon className='message-output-heading-icon'/> {currentRoom}</>
            : <>
                <span>{privateMemberMsg?.name}</span>
                <span className='message-output-heading-status'>
                    {privateMemberMsg.status === 'online' 
                    ? <Badge pill bg="success">Online</Badge>
                    : <Badge pill bg="secondary">Offline</Badge>}
                </span>
              </>}
        </div>}
        <div className='messages-output'>
            {!user && <div className='alert alert-danger'>Please login</div>}

            {user && messages.map((msg, idx) => (
                <div key={idx}>
                    <p className='message-date-indicator'>{msg._id}</p>
                    { msg.msgsByDate?.map((m, idx2) => (
                        <div key={idx2} className={m.from?.email === user?.email ? 'message-sent' : 'message-received'}>
                            { m.from.picture
                            ? <Avatar src={m.from.picture} alt={m.from.name} className='message-member-avater'/>
                            : <Avatar className='message-member-avater'>{m.from.name.charAt(0)}</Avatar>
                            }
                            <div className='message-info'>
                                <p className='message-name'>{m.from._id === user?._id ? 'You' : m.from.name}</p>
                                <div className='message-box'>
                                    { m.content 
                                    ? <p className='message-content'>{m.content}</p> 
                                    : <>
                                        <img className='message-img' src={m.image.url} alt='' loading="lazy" onClick={() => handleClickImage(m.image.url)}/>
                                        <Modal show={lgImgShow && clickedImg === m.image.url} onHide={() => setLgImgShow(false)} aria-labelledby="example-modal-sizes-title-lg">
                                            <Modal.Header closeButton />
                                            <Modal.Body>
                                                <img src={m.image.url} alt='' className='message-img-lg' loading="lazy"/>
                                            </Modal.Body>
                                        </Modal>
                                    </>
                                    }
                                    <p className='message-timestamp'>{m.time}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
            <div ref={messageEndRef}>

            </div>
        </div>

        <Form onSubmit={handleSubmit} className='message-input'>
            <Row className='align-items-center'>
                <Col xs='auto' className='pe-0 position-relative'>
                    <span onClick={() => setShowEmojis(!showEmojis)}>
                        <EmojiEmotionsIcon />
                    </span>
                    <div className='emoji-picker-container' ref={emojiDivRef}>
                        { showEmojis && <Picker data={emojiData} onEmojiSelect={handleAddEmoji} previewPosition='none' navPosition='bottom' maxFrequentRows='1'/> }
                    </div>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Control type='text' placeholder='Your message' disabled={!user} value={messageInput} onChange={e => setMessageInput(e.target.value)}></Form.Control>
                    </Form.Group>
                </Col>
                <Col xs='auto' className='p-0'>
                    <label htmlFor='attachment-file'>
                        <input id='attachment-file' type="file" className='hidden' onChange={handleAddAttachment}/>
                        <Button as='div' variant='light' size="sm" style={{background:'rgb(229 231 235)'}} disabled={!user}>
                            <AttachFileIcon/>
                        </Button>
                    </label>
                </Col>
                <Col xs='auto'>
                    <Button type='submit' variant='primary' size="sm" disabled={!user}>
                        <SendIcon fontSize='small' style={{color: 'white'}}/>
                    </Button>
                </Col>
            </Row>
        </Form>
    </div>
  )
}

export default MessageForm