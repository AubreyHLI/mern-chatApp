import { SOCKET_URL } from '../constants/global';
import React, { useState } from "react";
import { io } from "socket.io-client";

// const SOCKET_URL = 'http://localhost:5000';
// const SOCKET_URL = 'https://mern-chatapp-server.onrender.com';

export const socket = io(SOCKET_URL,  {
    withCredentials: true,
    transportOptions: {
      polling: {
        extraHeaders: {
          "my-custom-header": "abcd"
        }
      }
    }
  });

// initial a context object
export const AppContext = React.createContext();

// assign the Provider to a component
export function AppContextProvider(props) {
    const [rooms, setRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState([]);
    const [members, setMembers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [privateMemberMsg, setPrivateMemberMsg] = useState({});
    const [newMsg, setNewMsg] = useState({});
    const [isInit, setIsInit] = useState(false);

    return (
        <AppContext.Provider value={{ socket, rooms, setRooms, currentRoom, setCurrentRoom, members, setMembers, 
        messages, setMessages, privateMemberMsg, setPrivateMemberMsg, newMsg, setNewMsg, isInit, setIsInit }}>
            { props.children } {/* render all elements that are child componets of the <ScoreboardContextProvider></ScoreboardContextProvider> */}
        </AppContext.Provider>
    );
}