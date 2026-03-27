import { useEffect, useState, useRef } from 'react';
import { getMessages } from '../services/messageService';
import InviteButton from './buttonSendInvitation.js';
import QuitButton from './buttonQuitGroup.js';
import ContextMenu from './contextMenu.js';
import getAuthHeaders from '../utils/tokenInLs.js';
import { getUser } from '../services/servicesProfile.js';
import MemberGroups from './memberGroups.js';
import { IoIosArrowBack, IoMdSend } from "react-icons/io";
import { io } from 'socket.io-client';
import { BsEnvelopePlus } from "react-icons/bs";
import { MdExitToApp } from "react-icons/md";
import { HiOutlineUsers } from "react-icons/hi2";

const MessageRoom = ({ groupId, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [msg_body, setNewBodyMessage] = useState("");
  const [groupData, setGroupData] = useState(null)
  const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const socketRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser();
        if (response && response.data && response.data.data) {
          setCurrentUser(response.data.data.username);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

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
    <div className={`message-room ${showMembers ? 'members-active' : ''}`}>
      <div className='message-room-layout'>
        <div className={`chat-main-area ${showMembers ? 'mobile-hidden' : ''}`}>
          <div className="message-room-header">
            <div className='header-left-section'>
              <button
                className="iconsShowForm btn-msg-room mobile-only"
                onClick={onBack}
              >
                <IoIosArrowBack />
              </button>
              <div className="message-room-title">
                {groupData?.image && (
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
            </div>

            <div id='options-group' className='options-group'>
              {!isMobile && (
                <button
                  className='member-groups-trigger iconsShowForm'
                  onClick={() => setShowMembers(!showMembers)}
                  title="Ver miembros"
                >
                  <HiOutlineUsers />
                </button>
              )}
              <ContextMenu
                listMap={[
                  ...(isMobile ? [{
                    name: "Ver miembros",
                    handle: () => setShowMembers(true),
                    icon: HiOutlineUsers
                  }] : []),
                  {
                    name: "Enviar invitación",
                    handle: () => setIsInviteModalOpen(true),
                    icon: BsEnvelopePlus
                  },
                  {
                    name: "Salir del grupo",
                    handle: () => setIsQuitModalOpen(true),
                    icon: MdExitToApp
                  }
                ]}
              />
            </div>

          </div>
          <div className='container-msg-room'>
            {messages?.length !== 0 && messages[0].id_msg ? (
              messages?.map((msg) => {
                const isSelf = msg.username === currentUser;
                return (
                  <div className={`container-user-body ${isSelf ? 'self' : 'others'}`} key={msg.id_msg}>
                    <div className='message-user'>{isSelf ? 'Tú' : msg.username}</div>
                    <div className='message-body'>{msg.msg_body}</div>
                  </div>
                );
              })
            ) : (
              <div className='notMessageContainer'>
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
            <button className='button-msg-send' onClick={handleSendMessage}>
              <IoMdSend style={{ width: '20px', height: '20px' }} />
            </button>
          </div>
        </div>

        {showMembers && (
          <div className='members-sidebar'>
            <MemberGroups
              groupID={groupId}
              onClose={() => setShowMembers(false)}
            />
          </div>
        )}
      </div>

      <InviteButton
        groupID={groupId}
        showForm={isInviteModalOpen}
        setShowForm={setIsInviteModalOpen}
      />
      <QuitButton
        groupID={groupId}
        groupName={groupData?.name}
        showForm={isQuitModalOpen}
        setShowForm={setIsQuitModalOpen}
      />
    </div>
  );
};

export default MessageRoom;