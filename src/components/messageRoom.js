import { useEffect, useState, useRef } from 'react';
import { getMessages } from '../services/messageService';
import InviteButton from './buttonSendInvitation.js';
import getAuthHeaders from '../utils/tokenInLs.js';
import MemberGroups from './memberGroups.js';
import { IoIosArrowBack } from "react-icons/io";
import { io } from 'socket.io-client';

const MessageRoom = ({ groupId, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [msg_body, setNewBodyMessage] = useState("");
  const [groupData, setGroupData] = useState(null)
  const socketRef = useRef(null);

  useEffect(() => {
    if (!groupId) return;
    
    const socket = io('http://localhost:3000/', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      extraHeaders: getAuthHeaders(),
      auth: {
        token: localStorage.getItem('access_token')
      }
    });

    socketRef.current = socket;
    const loadInitialData = async () => {
      try {
        const response = await getMessages(groupId);
        if (response && response.length > 0) {
          setGroupData({
            name: response[0].group_name,
            image: response[0].url_img
          }); 
          setMessages(response); 
        } else {
          setGroupData(null);
          setMessages([]);
        }
      } catch (error) {
        console.error("Error:", error);
        setMessages([]);
      }
    };

    loadInitialData();

    socket.on('connect', () => {
      socket.emit("joinRoom", groupId);
    });

    socket.on("receiveMessage", (updatedMessages) => {
      setMessages(updatedMessages); 
    });

    return () => {
      socket.emit("leaveRoom", groupId);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [groupId]);

  const handleSendMessage = (e) => {
    if (e) e.preventDefault(); 
    if (msg_body.trim() === "" || !socketRef.current) return;
    socketRef.current.emit("sendMessage", { 
      groupID: groupId, 
      msg_body: msg_body.trim() 
    });
    setNewBodyMessage("");
  };

  return (
    <div className='message-room'>
      <div className='message-container'>
        <div className="message-room-header">
          <div className='button-to-back'>
            <button
              className="iconsShowForm btn-msg-room mobile-only"
              onClick={onBack}
            >
              <IoIosArrowBack/>
            </button>
          </div>
          <div className="message-room-title">
            {groupData?.image&& (
              <img
                src={groupData.image}
                alt={`img-${groupData.name}`}
                className="group-image"
              />
            )}
            <h2 className="group-name">
              {groupData?.name || "Nombre del grupo no disponible"}
            </h2>
          </div>
          <div id='options-group' className='options-group'>
            <InviteButton groupID={groupId} />    
            <MemberGroups groupID={groupId} />
          </div>
        </div>
        <div className='container-msg-room'>
              {messages?.length !== 0 && messages[0].id_msg ? (
                messages?.map((msg) => (
                  <div className='container-user-body' key={msg.id_msg}>
                    <div className='message-user'>{msg.username}</div>
                    <div className='message-body'>{msg.msg_body}</div>
                  </div>
                ))        
              ) : (
                <div className='notMessageContainer'>
                  <p>No hay mensajes disponibles.</p>
                </div>
              )}
        </div>
      </div>
      <div className='send-form-message'>
        <input
          className='input-message'
          type="text"
          value={msg_body}
          onChange={(e) => setNewBodyMessage(e.target.value)}
        />
        <button className='button-msg-send' onClick={handleSendMessage}> Send </button>
      </div>
    </div>
  );
};

export default MessageRoom;