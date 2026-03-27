import { useEffect, useState } from "react";
import { getMembers, deleteMember, editRolMember } from "../services/servicesMembersGroup";
import { roles } from "../utils/roles";
import { Toast } from "./toast.js";
import { MdDeleteForever,  } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

const MemberGroups = ({ groupID, onClose }) => {
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(/[._\s]/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  const [getmembers, setGetmembers] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMembers(groupID);
        setGetmembers(response.data.data);
      } catch (error) {
        setToast({ message: 'No se ha podido obtener los miembros del grupo.', type: 'error' })
      }
    };

    fetchData();
  }, [groupID]);

  const handleDeleteMember = async (userID, groupID) => {
    try {
      await deleteMember(groupID, userID);
      setToast({ message: 'Haz eliminado al miembro con exito.', type: 'success' })
      setGetmembers(prev => prev.filter(m => m.id_users !== userID));
    } catch (error) {
      setToast({ message: 'No se ha podido Eliminar al miembro.', type: 'error' });
    }
  };

  const handleEditRolMember = async (userID, groupID, id_rol) => {
    try {
      await editRolMember(userID, groupID, id_rol);
      setToast({ message: 'Haz editado al miembro con exito.', type: 'success' });
      setGetmembers(prev =>
        prev.map(m => m.id_users === userID ? { ...m, id_rol } : m)
      );
    } catch (error) {
      setToast({ message: 'No se ha podido editar al miembro.', type: 'error' })
    }
  };

  return (
    <div className="members-list-sidebar">
      <div className="members-sidebar-header">
        <h2 className="members-title">Miembros del grupo</h2>
        {onClose && (
          <button 
            className="sidebar-close-btn"
            onClick={onClose}
            title="Cerrar miembros"
          >
            <IoMdClose />
          </button>
        )}
      </div>
      <div className="members-cards-container">
        {getmembers?.map((member) => (
          <div key={member.id_member} className="member-card">
            <div className="member-content">
              <div className="member-info-item">
                <strong>Usuario:</strong> {member.username}
              </div>
              <div className="member-info-item">
                <strong>Email:</strong> {member.address_mail}
              </div>
              <div className="member-info-item">
                <strong>Rol:</strong>
              </div>
              
              <div className="member-actions-row">
                <select
                  value={member.id_rol}
                  className="role-select"
                  onChange={(e) =>
                    handleEditRolMember(member.id_users, groupID, parseInt(e.target.value))
                  }
                >
                  {roles.map((rol) => (
                    <option key={rol.id_rol} value={rol.id_rol}>
                      {rol.rol_name}
                    </option>
                  ))}
                </select>
                
                <div className="action-buttons">
                  <button
                    className="delete-icon-btn"
                    onClick={() => handleDeleteMember(member.id_users, groupID)}
                    title="Eliminar miembro"
                  >
                    <MdDeleteForever />
                  </button>
                </div>
              </div>
            </div>
            <div className="member-avatar">
              {getInitials(member.username)}
            </div>
            
          </div>
        ))}
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default MemberGroups;
