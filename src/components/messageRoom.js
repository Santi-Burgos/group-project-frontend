import { useEffect, useState } from 'react';
import { getMessages} from '../services/messageService';
import InviteButton from './buttonSendInvitation.js';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
    withCredentials: true
});

const MessageRoom = ({ groupId }) => {
    const [messages, setMessages] = useState([]);
    const [msg_body, setNewBodyMessage] = useState("");

    useEffect(() => {

        if (!groupId) return;
    
        socket.on('connect', () => {
            console.log('🔗 WebSocket conectado');
        });
        
        socket.on('connect_error', (err) => {
            console.error('Error de conexión:', err);
        });
    
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
        const handleReceiveMessage = (newMessages) => {
            console.log("🔄 Mensajes actualizados recibidos:", newMessages); 
            setMessages(newMessages);
        };
    
        socket.on("receiveMessage", handleReceiveMessage);
    
        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
            socket.emit("leaveRoom", groupId);
        };
    }, [groupId]);;
    
    
    
    
    const handleSendMessage = async () => {
        if (msg_body.trim() === "") return;
    
        try {
            socket.emit("sendMessage", { 
                groupID: groupId, 
                msg_body 
            });
    
            setNewBodyMessage("");
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
        }
    };
    


    return (
        <div className='message-room'>
            <div className='message-container'>
                <div className="message-room-header">
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
                    <InviteButton groupID={groupId} />
                </div>

                {messages?.length > 0 ? (
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