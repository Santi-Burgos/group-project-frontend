import { useState, useEffect } from 'react';
import CreateGroup from './groupForm.js';
import NotificationButton from './notificationButton.js';
import GroupList from './groupList.js';
import MessageRoom from './messageRoom.js';
import ProfileComponent from './profile.js';
import SearchBar from './navbar.js';
import ContextMenu from './contextMenu.js';
import DeleteAccountButton from './deleteAcc.js';
import { main } from '../services/servicesMain';
import { VscAdd, VscAccount } from "react-icons/vsc";
import { MdDeleteForever } from "react-icons/md";

const Main = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [onSelectedGroup, setOnSelectedGroup] = useState(null);
  const [visiblePanel, setVisiblePanel] = useState('groups');
  const [isGroupFormOpen, setIsGroupFormOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);

  const listMap = [
    {
      name: "Crear Grupo",
      handle: () => setIsGroupFormOpen(true),
      icon: VscAdd
    },
    {
      name: "Ver Perfil",
      handle: () => setIsProfileOpen(true),
      icon: VscAccount
    },
    {
      name: "Eliminar Cuenta",
      handle: () => setIsDeleteAccountOpen(true),
      icon: MdDeleteForever
    }
  ];

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


  console.log(groups);

  const filteredGroups = (groups.data || []).filter(group =>
    group?.group_name?.toLowerCase().includes(search.toLowerCase())
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
          <p>
            GroupApp
          </p>
          <div className='options-conteiner'>
            <NotificationButton />
            <ContextMenu listMap={listMap} />
          </div>
        </div>
        <SearchBar onSearch={setSearch} />
        {loading ? (
          <p>Cargando grupos...</p>
        ) : (
          <>
            <GroupList groups={filteredGroups} onSelectGroup={handleSelectGroup} />
            <div className="sidebar-footer">
              v2.0
            </div>
          </>
        )}
      </div>
      <CreateGroup showForm={isGroupFormOpen} setShowForm={setIsGroupFormOpen} />
      <ProfileComponent showProfile={isProfileOpen} setShowProfile={setIsProfileOpen} />
      <DeleteAccountButton showForm={isDeleteAccountOpen} setShowForm={setIsDeleteAccountOpen} />
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