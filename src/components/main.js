import { useState, useEffect } from 'react';
import CreateGroup from './groupForm.js';
import NotificationButton from './notificationButton.js';
import GroupList from './groupList.js';
import MessageRoom from './messageRoom.js';
import ProfileComponent from './profile.js';
import SearchBar from './navbar.js';
import { main } from '../services/servicesMain';

const Main = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [onSelectedGroup, setOnSelectedGroup] = useState(null);
  const [visiblePanel, setVisiblePanel] = useState('groups');

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
    setVisiblePanel('messages');
  };

  const handleBackToGroups = () => {
    setVisiblePanel('groups');
    setOnSelectedGroup(null); 
  };

  return (
    <div className="main-container">
      <div className={`conteiner-groups ${visiblePanel === 'groups' ? '' : 'hidden'}`}>
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

      <div className={`message-room ${visiblePanel === 'messages' ? '' : 'hidden'}`}>
        {onSelectedGroup && (
          <MessageRoom 
            groupId={onSelectedGroup} 
            onBack={handleBackToGroups}
          />
        )}
      </div>
  </div>
  );
};

export default Main;