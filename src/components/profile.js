import { useState, useEffect } from "react";
import { getUser, editUser } from '../services/servicesProfile.js'
import { Toast } from "./toast.js";
import { savePersistentToast, loadPersistentToast } from "../utils/showPersistentToast.js";
import { VscAccount } from "react-icons/vsc";
import { createPortal } from "react-dom";
import CloseButton from "./closeModalbutton.js";


const ProfileComponent = ({ showProfile: controlledShowProfile, setShowProfile: controlledSetShowProfile }) => {
  const [takeUser, setTakeUser] = useState([]);
  const [internalShowProfile, setInternalShowProfile] = useState(false);

  const showProfile = controlledShowProfile !== undefined ? controlledShowProfile : internalShowProfile;
  const setShowProfile = controlledSetShowProfile !== undefined ? controlledSetShowProfile : setInternalShowProfile;
  const [loading, setLoading] = useState(false);
  const [editProfile, setEditProfile] = useState({
    address_mail: "",
    user: "",
    password: "",
    currentPassword: ""
  })

  const [toast, setToast] = useState(null);

  useEffect(() => {
    const toastData = loadPersistentToast();
    if (toastData) setToast(toastData);
  }, []);

  useEffect(() => {
    if (!showProfile) return;

    const fetchData = async () => {
      try {
        const response = await getUser()
        setTakeUser(response.data.data);
        setEditProfile({
          address_mail: "",
          username: "",
          password: "",
          currentPassword: ""
        });
      } catch (error) {
        console.log('No se ha podido recuperar al usuario')
      }
    };
    fetchData();
  }, [showProfile])

  const handleOpenProfile = () => {
    setShowProfile(!showProfile);
  }

  const handleEditUser = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await editUser(
        editProfile.address_mail,
        editProfile.user,
        editProfile.password,
        editProfile.currentPassword
      );
      setEditProfile({
        address_mail: "",
        user: "",
        password: "",
        currentPassword: ""
      })
      if (response.success) {
        savePersistentToast({ message: 'Has podido editar tu perfil', type: 'success' })
        window.location.reload();
      }
    } catch (error) {
      savePersistentToast({ message: 'No has podido editar tu perfil', type: 'error' })
      window.location.reload();
    }
  }
  return (
    <div>
      {controlledShowProfile === undefined && (
        <button id="form-create-group" onClick={handleOpenProfile} className="iconsShowForm">
          {showProfile ? "X" : <VscAccount />}
        </button>
      )}
      {showProfile && createPortal(
        <div>
          <div className="form-create-group">
            <div className="headerCreateGroup">
              <div className="containerTitleGroup">
                <div>Mi Perfil</div>
                <div>
                  <CloseButton
                    handleState={handleOpenProfile}
                    customStyles={{
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer'
                    }}
                    customText='X'
                  />
                </div>
              </div>
            </div>
            <div className="bodyCreateGroup">
              <div id="Profile-user">
                <div className="containerTitleInput">
                  <p className="groupName">Correo actual</p>
                  <div className="notMessageContainer">{takeUser.address_mail}</div>
                </div>
                <div className="containerTitleInput">
                  <p className="groupName">Usuario actual</p>
                  <div className="notMessageContainer">{takeUser.username}</div>
                </div>
              </div>

              <form className="formContainer" onSubmit={handleEditUser}>
                <div className="containerTitleInput">
                  <p className="groupName">Nuevo correo</p>
                  <input
                    type="text"
                    placeholder="Address mail"
                    value={editProfile.address_mail}
                    onChange={(e) =>
                      setEditProfile({ ...editProfile, address_mail: e.target.value })
                    }
                  />
                </div>
                <div className="containerTitleInput">
                  <p className="groupName">Nuevo usuario</p>
                  <input
                    type="text"
                    placeholder="Username"
                    value={editProfile.username}
                    onChange={(e) =>
                      setEditProfile({ ...editProfile, user: e.target.value })
                    }
                  />
                </div>
                <div className="containerTitleInput">
                  <p className="groupName">Nueva contraseña</p>
                  <input
                    type="password"
                    placeholder="New Password"
                    value={editProfile.password}
                    onChange={(e) =>
                      setEditProfile({ ...editProfile, password: e.target.value })
                    }
                  />
                </div>
                <div className="containerTitleInput">
                  <p className="groupName">Contraseña actual</p>
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={editProfile.currentPassword}
                    onChange={(e) =>
                      setEditProfile({
                        ...editProfile,
                        currentPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="buttonCreateGroup">
                  <button className="buttonSubmitCreateGroup" type="submit" disabled={loading}>
                    {loading ? "Editando..." : "Editar Usuario"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default ProfileComponent