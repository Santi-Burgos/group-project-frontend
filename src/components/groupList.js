import { useState } from 'react';
import QuitButton from './buttonQuitGroup.js';
import InviteButton from './buttonSendInvitation.js';
import ContextMenu from './contextMenu.js';
import { BsEnvelopePlus } from "react-icons/bs";
import { MdExitToApp } from "react-icons/md";

const GroupList = ({ groups, onSelectGroup }) => {
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [activeGroupName, setActiveGroupName] = useState("");
  const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  if (!groups || groups.length === 0) {
    return <h1>No hay grupos para mostrar</h1>;
  }

  const handleOpenQuit = (group) => {
    setActiveGroupId(group.id_group);
    setActiveGroupName(group.group_name);
    setIsQuitModalOpen(true);
  };

  const handleOpenInvite = (group) => {
    setActiveGroupId(group.id_group);
    setIsInviteModalOpen(true);
  };

  return (
    <div>
      {groups.map((group) => (
        <div className='group-item' key={group.id_group}>
          <div
            className='list-group'
            onClick={() => onSelectGroup(group.id_group)}
          >
            <img
              className='img-listgroup'
              src={group.url_img}
              alt={'foto de ' + group.group_name}
            />
            <span className='group-name'>{group.group_name}</span>
          </div>
          <ContextMenu
            listMap={[
              { 
                name: "Enviar invitación", 
                handle: () => handleOpenInvite(group),
                icon: BsEnvelopePlus
              },
              { 
                name: "Salir del grupo", 
                handle: () => handleOpenQuit(group),
                icon: MdExitToApp
              }
            ]}
          />
        </div>
      ))}

      {activeGroupId && (
        <>
          <QuitButton
            groupID={activeGroupId}
            groupName={activeGroupName}
            showForm={isQuitModalOpen}
            setShowForm={setIsQuitModalOpen}
          />
          <InviteButton
            groupID={activeGroupId}
            showForm={isInviteModalOpen}
            setShowForm={setIsInviteModalOpen}
          />
        </>
      )}
    </div>
  );
};

export default GroupList;

