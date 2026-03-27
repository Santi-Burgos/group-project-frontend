import { useEffect, useState } from 'react';
import { notification, acceptedNotification, declineNotification } from '../services/servicesNotification';
import { savePersistentToast, loadPersistentToast } from '../utils/showPersistentToast';
import { Toast } from './toast';
import { IoMdNotificationsOutline } from "react-icons/io";
import { createPortal } from "react-dom";
import CloseButton from "./closeModalbutton.js";


const NotificationButton = () => {
  const [showForm, setShowForm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const toastData = loadPersistentToast();
    if (toastData) setToast(toastData);
  }, []);

  const handleAccept = async (groupID) => {
    try {
      await acceptedNotification(groupID);
      savePersistentToast({ message: 'Haz ingresado al grupo con éxito.', type: 'success' })
      window.location.reload();
    } catch (error) {
      setToast({ message: 'No has podido ingresar al grupo.', type: 'error' });
    }
  };

  const handleReject = async (groupID) => {
    try {
      await declineNotification(groupID);
      savePersistentToast({ message: 'Haz rechazado la invitacion al grupo con éxito.', type: 'success' })
      window.location.reload();
    } catch (error) {
      setToast({ message: 'No has podido rechazar la invitacion al grupo.', type: 'error' });
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await notification();
        setNotifications(response.data);
      }
      catch (error) {
        console.log('Ha ocurrido un error al cargar tus notificaciones');
      }
    };
    fetchData();
  }, []);


  const handleToggle = () => {
    setShowForm(!showForm);
  };

  let listNotification = [];

  if (notifications && notifications.length > 0) {
    listNotification = notifications.map((notif) => (
      <div key={notif.id_invitation} className="notification-card" style={{ marginBottom: '15px', padding: '10px', borderBottom: '1px solid #eee' }}>
        <p style={{ fontSize: '14px', marginBottom: '10px' }}>
          El usuario <strong>{notif.username}</strong> te ha invitado al grupo <strong>{notif.group_name}</strong>
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="button-submit normal" onClick={() => handleAccept(notif.id_group)}>Aceptar</button>
          <button className="button-submit delete" onClick={() => handleReject(notif.id_group)}>Rechazar</button>
        </div>
      </div>
    ));
  } else {
    listNotification = <div className="notification-empty">No hay notificaciones para ver, vuelva luego</div>;
  }

  return (
    <div className="notifications-container">
      <button onClick={handleToggle} className="iconsShowForm btn-main">
        <IoMdNotificationsOutline />
      </button>

      {showForm && createPortal(
        <div>
          <div className="form-create-group">
            <div className="headerCreateGroup">
              <div className="containerTitleGroup">
                <div>Notificaciones</div>
                <div>
                  <CloseButton
                    handleState={handleToggle}
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
              <div className="notifications-list">
                {listNotification}
              </div>
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


export default NotificationButton