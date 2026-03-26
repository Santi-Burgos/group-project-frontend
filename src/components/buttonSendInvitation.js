import { useState } from 'react';
import { sendInvitation } from "../services/servicesNotification.js";
import { BsEnvelopePlus } from "react-icons/bs";
import { Toast } from './toast.js';
import { createPortal } from "react-dom";
import CloseButton from "./closeModalbutton.js";

const InviteButton = ({ groupID, showForm: controlledShowForm, setShowForm: controlledSetShowForm }) => {
  const [internalShowForm, setInternalShowForm] = useState(false);
  const showForm = controlledShowForm !== undefined ? controlledShowForm : internalShowForm;
  const setShowForm = controlledSetShowForm !== undefined ? controlledSetShowForm : setInternalShowForm;

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null)
  const [, setMessage] = useState('');

  const handleClose = () => {
    setShowForm(false);
    setEmail('');
  };

  const handleSendInvitation = async () => {
    if (!email) {
      setMessage('Por favor, ingresa un correo.');
      return;
    }
    setLoading(true);
    try {
      const response = await sendInvitation({ groupID, address_mail: email });

      if (response.success) {
        setToast({ message: 'Has enviado la notificación con éxito.', type: 'success' });
        setEmail('');
        setTimeout(() => setShowForm(false), 2000);
      } else {
        setMessage(response?.message || 'No se pudo enviar la invitación.');
        setToast({ message: 'No se ha podido enviar la invitación.', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'No se ha podido enviar la invitación.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='invite-wrapper'>
      {controlledShowForm === undefined && (
        <button className="iconsShowForm btn-msg-room" onClick={() => setShowForm(true)}>
          <BsEnvelopePlus />
        </button>
      )}

      {showForm && createPortal(
        <div>
          <div className="form-create-group">
            <div className="headerCreateGroup">
              <div className="containerTitleGroup">
                <div>Enviar Invitación</div>
                <div>
                  <CloseButton
                    handleState={handleClose}
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
              <div className="containerTitleInput">
                <p className="groupName">Correo del invitado</p>
                <input
                  type="email"
                  placeholder="Correo electrónico (ej. juan@ejemplo.com)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="buttonCreateGroup" style={{ gap: '10px', marginTop: '20px' }}>
                <button
                  className="buttonSubmitCreateGroup"
                  style={{ backgroundColor: '#f0f0f0', borderColor: '#ccc' }}
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  className="buttonSubmitCreateGroup"
                  onClick={handleSendInvitation}
                  disabled={loading || !email}
                >
                  {loading ? 'Enviando...' : 'Enviar Invitación'}
                </button>
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
};

export default InviteButton;

