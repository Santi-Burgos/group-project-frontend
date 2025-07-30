import {useEffect, useState} from 'react';
import { notification, acceptedNotification, declineNotification } from '../services/servicesNotification';
import { savePersistentToast, loadPersistentToast } from '../utils/showPersistentToast';
import { Toast } from './toast';

const NotificationButton = () =>{
    const [showForm, setShowFrom] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [toast, setToast] = useState(null)

    useEffect(()=>{
        const toastData = loadPersistentToast();
        if (toastData) setToast(toastData);
    }, []);

    const handleAccept = async (groupID) => {
        try {
            await acceptedNotification(groupID);
            savePersistentToast({message: '✅ Haz ingresado al grupo con éxito.', type: 'success'})
            window.location.reload();
        } catch (error) {
            setToast({ message: '❌ No has podido ingresar al grupo.', type: 'error' });
        }
    };

    const handleReject = async (groupID) =>{
        try{
            await declineNotification(groupID);
            savePersistentToast({message: '✅ Haz rechazado la invitacion al grupo con éxito.', type: 'success'})
            window.location.reload();
        }catch(error){
            setToast({ message: '❌ No has podido rechazar la invitacion al grupo.', type: 'error' });
        }
    }

    useEffect(()=>{
        const fetchData = async () =>{ 
            try{
                const response = await notification();
                console.log(response)
                setNotifications(response);
            }
            catch(error){
                console.log('Ha ocurrido un error al cargar tus notificaciones');
            }
        };
        fetchData();
    }, []);


    const handleClick = () => {
        setShowFrom(!showForm);
    };

    let listNotification = [];

    if (notifications && notifications.length > 0) {
        listNotification = notifications.map((notification) => (
          <div key={notification.id_invitation} className="notification-card">
            <ul className="notification-info">
              <li>
                El usuario <strong>{notification.username}</strong> te ha invitado al grupo <strong>{notification.group_name}</strong>
                <button className="button-submit normal" onClick={() => handleAccept(notification.id_group)}>Accepted</button>
                <button className="button-submit delete" onClick={() => handleReject(notification.id_group)}>Decline</button>
              </li>
            </ul>
          </div>
        ));
      } else {
        listNotification = <div className="notification-empty">No hay notificaciones para ver, vuelva luego</div>;
      }
      
      return (
        <div className="notifications-container">
          <button onClick={handleClick} className="iconsShowForm">
            {showForm ? "X" : "N"}
          </button>
          {showForm && (
            <div className="notifications">
              {listNotification}
            </div>
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