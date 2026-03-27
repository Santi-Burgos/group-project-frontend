import { useState, useEffect } from 'react';
import { userDelete } from '../services/servicesProfile.js';
import { Toast } from './toast.js';
import { savePersistentToast, loadPersistentToast } from '../utils/showPersistentToast.js';
import { createPortal } from "react-dom";
import CloseButton from "./closeModalbutton.js";

const DeleteAccountButton = ({ showForm: controlledShowForm, setShowForm: controlledSetShowForm }) => {
  const [internalShowForm, setInternalShowForm] = useState(false);
  const showForm = controlledShowForm !== undefined ? controlledShowForm : internalShowForm;
  const setShowForm = controlledSetShowForm !== undefined ? controlledSetShowForm : setInternalShowForm;

  const [currentPassword, setCurrentPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const toastData = loadPersistentToast();
    if (toastData) setToast(toastData);
  }, []);

  const handleClose = () => {
    setShowForm(false);
    setCurrentPassword('');
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await userDelete(currentPassword);
      savePersistentToast({ message: 'Haz eliminado tu cuenta con éxito.', type: 'success' })
      window.location.reload();
    } catch (error) {
      setToast({ message: 'No has podido eliminar tu cuenta.', type: 'error' })
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="delete-account">
      {controlledShowForm === undefined && (
        <button className='button-submit delete' onClick={() => setShowForm(true)}>Eliminar cuenta</button>
      )}

      {showForm && createPortal(
        <div>
          <div className="form-create-group">
            <div className="headerCreateGroup">
              <div className="containerTitleGroup">
                <div>Eliminar Cuenta</div>
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
              <p style={{ color: '#ea411d', fontSize: '14px', marginBottom: '15px' }}>
                Esta acción es irreversible. Por favor, ingresa tu contraseña para confirmar.
              </p>
              <div className="containerTitleInput">
                <p className="groupName">Contraseña actual</p>
                <input
                  type="password"
                  placeholder="Contraseña actual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
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
                  className="button-submit delete"
                  onClick={handleDelete}
                  disabled={loading || !currentPassword}
                  style={{ border: 'none', padding: '10px 20px' }}
                >
                  {loading ? 'Eliminando...' : 'Eliminar Permanentemente'}
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

export default DeleteAccountButton;

