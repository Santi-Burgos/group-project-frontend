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
    const socketRef = useRef(null);

    useEffect(() => {
        if (!groupId) return;

        const socket = io(  
            'http://localhost:3000'
            , {
            withCredentials: true,
            transports: ['polling', 'websocket'],
            extraHeaders: getAuthHeaders(),
            reconnection: true,      
            reconnectionAttempts: 5,  
            reconnectionDelay: 1000,  
        });

        socketRef.current = socket;

        socket.on('connect', () => console.log('🔗 WebSocket conectado'));
        socket.on('connect_error', (err) => console.error('Error de conexión:', err));

        const fetchMessages = async () => {
            try {
                const data = await getMessages(groupId);
                setMessages(data);
            } catch (error) {
                console.error("Error al obtener mensajes:", error);
            }
        };

        fetchMessages();

        socket.emit("joinRoom", groupId);

        const handleReceiveMessage = (newMessages) => setMessages(newMessages);
        socket.on("receiveMessage", handleReceiveMessage);

        return () => {
            socket.emit("leaveRoom", groupId);
            socket.off("receiveMessage", handleReceiveMessage);
            socket.disconnect();
        };
    }, [groupId]);

    const handleSendMessage = () => {
        if (msg_body.trim() === "") return;
        socketRef.current?.emit("sendMessage", { groupID: groupId, msg_body });
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
                        {messages?.[0]?.url_img && (
                        <img
                            src={messages[0].url_img}
                            alt="Group"
                            className="group-image"
                        />
                        )}
                        <h2 className="group-name">
                        {messages?.[0]?.group_name || "Nombre del grupo no disponible"}
                        </h2>
                    </div>
                    <div id='options-group' className='options-group'>
                        <InviteButton groupID={groupId} />    
                        <MemberGroups groupID={groupId} />
                    </div>
                    </div>
                    <div className='container-msg-room'>
                        {messages?.length !== 0 ? (
                            messages.map((msg) => (
                                <div className='container-user-body' key={msg.id_msg}>
                                    <div className='message-user'>{msg.username}:</div>
                                    <div className='message-body'>{msg.msg_body}</div>
                                </div>
                            ))
                        
                        ) : (
                            <div>
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