import { useEffect, useState } from "react";
import { getMembers, deleteMember, editRolMember } from "../services/servicesMembersGroup";
import { roles } from "../utils/roles";
import { Toast} from "./toast";

const MemberGroups = ({ groupID }) => {
  const [getmembers, setGetmembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false); // ✅ Estado para mostrar/ocultar miembros
  
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!showMembers) return; // ✅ Solo trae los miembros si se clickeó el botón

    const fetchData = async () => {
      try {
        const response = await getMembers(groupID);
        setGetmembers(response.data);
      } catch (error) {
        setToast({ message: '❌ No se ha podido obtener los miembros del grupo.', type: 'error' })
      }
    };

    fetchData();
  }, [groupID, showMembers]);
  const handleDeleteMember = async (userID, groupID) => {
    try {
      await deleteMember(groupID, userID);
      setToast({ message: '✅ Haz eliminado al miembro con exito.', type: 'success' })
      setGetmembers(prev => prev.filter(m => m.id_users !== userID));
    } catch (error) {
      setToast({ message: '❌ No se ha podido Eliminar al miembro.', type: 'error' });
    }
  };

  const handleEditRolMember = async (userID, groupID, id_rol) => {
    try {
      await editRolMember(userID, groupID, id_rol);
      setToast({ message: '✅ Haz editado al miembro con exito.', type: 'success' });
      setGetmembers(prev =>
        prev.map(m => m.id_users === userID ? { ...m, id_rol } : m)
      );
    } catch (error) {
      setToast({ message: '❌ No se ha podido editar al miembro.', type: 'error' })
    }
  };

  return (
    <div className="member-groups-container">
      <button 
        onClick={() => setShowMembers(prev => !prev)} 
        className="toggle-button"
      >
        {showMembers ? 'Ocultar miembros' : 'Ver miembros'}
      </button>

      {showMembers && (
        <div className="members-list">
          <h2 className="members-title">Miembros del grupo</h2>
          {getmembers?.map((member) => (
            <div key={member.id_member} className="member-card">
              <ul className="member-info">
                <li><strong>Usuario:</strong> {member.user}</li>
                <li><strong>Email:</strong> {member.address_mail}</li>
                <li>
                  <strong>Rol:</strong>
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
                </li>
                <li>
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteMember(member.id_users, groupID)}
                  >
                    Eliminar
                  </button>
                </li>
              </ul>
            </div>
          ))}
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MemberGroups;
