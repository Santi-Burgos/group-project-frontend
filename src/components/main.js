import CreateGroup from './groupForm.js';
import NotificationButton from './notificationButton.js';
import GroupList from './groupList.js';
import MessageRoom from './messageRoom.js';
import MemberGroups from './memberGroups.js';
import ProfileComponent from './profile.js';
import SearchBar from './navbar.js'
import { main } from '../services/servicesMain';
import { useState, useEffect } from 'react';



const Main = () => {
  
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [onSelectedGroup, setOnSelectedGroup] = useState(null);

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
  


  return (
    <div className='main-container'>
      <div className='conteiner-groups'>
        <div>
          <div className='button-row'>
            <CreateGroup/>
            <NotificationButton/>
            <ProfileComponent/>
          </div>
          <div>
            <SearchBar onSearch={setSearch}/>
          </div>
          <div>
          </div>
        </div>
        <div>
          {loading ? (
            <p>Cargando grupos...</p>
          ) : (
            <GroupList groups={filteredGroups} onSelectGroup={setOnSelectedGroup} />
          )}
        </div>
        </div>
        {onSelectedGroup ? (
          <MessageRoom groupId={onSelectedGroup} />
        ) : (
          <p>Selecciona un grupo para ver los mensajes</p>
        )}
        <MemberGroups groupID={onSelectedGroup}/>
      </div>
  );
};


export default Main;
