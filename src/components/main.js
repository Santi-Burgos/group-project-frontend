import CreateGroup from './groupForm.js';
import NotificationButton from './notificationButton.js';
import GroupList from './groupList.js';
import MessageRoom from './messageRoom.js';
import MemberGroups from './memberGroups.js';
import ProfileComponent from './profile.js';
import SearchBar from './navbar.js';
import { main } from '../services/servicesMain';
import { useState, useEffect } from 'react';

const Main = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [onSelectedGroup, setOnSelectedGroup] = useState(null);
  const [visiblePanel, setVisiblePanel] = useState('groups'); // 'groups' | 'messages' | 'members'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await main();
        setGroups(response);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredGroups = (groups || []).filter(group =>
    group.group_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectGroup = (groupId) => {
    setOnSelectedGroup(groupId);
    setVisiblePanel('messages'); // en móvil, ir a mensajes al seleccionar grupo
  };

  return (
    <div className="main-container">

      {/* PANEL GRUPOS */}
      <div className={`conteiner-groups ${visiblePanel !== 'groups' ? 'mobile-hidden' : ''}`}>
        <div className="button-row">
          <CreateGroup />
          <NotificationButton />
          <ProfileComponent />
        </div>
        <SearchBar onSearch={setSearch} />
        {loading ? (
          <p>Cargando grupos...</p>
        ) : (
          <GroupList groups={filteredGroups} onSelectGroup={handleSelectGroup} />
        )}
      </div>

      {/* PANEL MENSAJES */}
      {onSelectedGroup && (
        <div className={`message-room ${visiblePanel !== 'messages' ? 'mobile-hidden' : ''}`}>
          {/* Botón volver en móvil */}
          <button
            className="back-button mobile-only"
            onClick={() => setVisiblePanel('groups')}
          >
            ← Volver a grupos
          </button>
          <MessageRoom groupId={onSelectedGroup} />
        </div>
      )}

      {/* PANEL MIEMBROS */}
      {onSelectedGroup && (
        <div className={`member-groups ${visiblePanel !== 'members' ? 'mobile-hidden' : ''}`}>
          <button
            className="back-button mobile-only"
            onClick={() => setVisiblePanel('messages')}
          >
            ← Volver a mensajes
          </button>
          <MemberGroups groupID={onSelectedGroup} />
        </div>
      )}

    </div>
  );
};

export default Main;
