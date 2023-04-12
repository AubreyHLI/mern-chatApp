import React, { useContext, useEffect } from 'react'
import { Badge, ListGroup} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { AppContext } from '../context/appContext';
import { addNotifications, resetNotifications } from '../redux/slices/userSlice';
import { Avatar } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';


const Sidebar = () => {
    const user = useSelector(state => state.user);
    const { socket, rooms, setRooms, currentRoom, setCurrentRoom, members, setMembers, privateMemberMsg, setPrivateMemberMsg, isInit, setIsInit } = useContext(AppContext);
	const dispatch = useDispatch();
    
    useEffect(() => {
		if(user && !isInit) {
			// get rooms
			// fetch('http://localhost:5000/rooms')
			fetch('https://mern-chatapp-server.onrender.com/rooms')
				.then(response => response.json())
				.then(data => setRooms(data))
				.catch(err => console.log(err.message));
				
			setCurrentRoom('general');
			setIsInit(true);
			// emit events
			socket.emit('join-room', 'general');
			socket.emit('new-user');
		}
    }, [])
    

    // add an event listener that will be fired when 'new-user' event is emitted
    socket.off('new-user').on('new-user', payload => {
		setMembers(payload);
    });


	const handleJoinRoom = (room, isPublicRoom = true)  => {
		socket.emit('join-room', room, currentRoom);
		setCurrentRoom(room);
		if(isPublicRoom) {
			setPrivateMemberMsg(null);
		}
		// dispatch for notifications
		dispatch(resetNotifications(room));
	}

	
	socket.off('notifications').on('notifications', room => {
		if(currentRoom !== room) {
			dispatch(addNotifications(room));
		}
	});


	const chatRoomId = (member1, member2) => {
		if(member1._id > member2._id) {
			return `${member1._id}-${member2._id}`;
		} else {
			return `${member2._id}-${member1._id}`;
		}
	}


	const handlePrivateMemberMsg = (member) => {
		setPrivateMemberMsg(member);
		const roomId = chatRoomId(member, user);
		handleJoinRoom(roomId, false);
	}


    return !user ? <></> :
    (
		<div>
			<h5 className='mt-2'><GroupIcon className='room-icon'/>Group chat</h5>
			<ListGroup>
				{ rooms.map((r, idx) => 
				<ListGroup.Item key={idx} active={r === currentRoom} onClick={() => handleJoinRoom(r)} style={{display:'flex', justifyContent:'space-between', alignItems:'center', cursor: 'pointer'}}>
					{r}
					{currentRoom !== r && <Badge pill bg="danger" className='notif-unread'>{user.newMessages[r]}</Badge>}
				</ListGroup.Item>) }
			</ListGroup>

			<h5 className='mt-4'><PersonIcon className='room-icon'/>Contacts</h5>
			<ListGroup>
				{ members.map( m => (
				<ListGroup.Item key={m._id} style={{cursor:'pointer'}} active={m._id === privateMemberMsg?._id} disabled={m._id === user._id} onClick={() => handlePrivateMemberMsg(m)}>
					<div className='member-item'>
						<div className='member-status'>
							{ m.picture
							? <Avatar src={m.picture} alt='' className='member-avatar'/>
							: <Avatar className='member-avatar'>{m.name.charAt(0)}</Avatar>
							}
							{ m.status === 'online' && <CircleIcon className='status-icon online-status-icon'/>	}
						</div>
						<div className='member-name'>
							<span>{m.name}</span>
							<span className='member-label ms-2'>
								{m._id === user?._id && '(You)'}
							</span>
						</div>
						<Badge bg="danger" pill className='notif-unread'>{user.newMessages[chatRoomId(user, m)]}</Badge>
					</div>
				</ListGroup.Item>)) }
			</ListGroup>
		</div>
    )
}

export default Sidebar