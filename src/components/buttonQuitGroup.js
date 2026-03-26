import { useState, useEffect } from 'react';
import { userQuitGroup } from "../services/servicesUserQuitGroup.js";
import { Toast } from "./toast.js";
import { savePersistentToast, loadPersistentToast } from "../utils/showPersistentToast.js";
import { MdDeleteForever } from "react-icons/md";
import { createPortal } from "react-dom";
import CloseButton from "./closeModalbutton.js";

const QuitButton = ({ groupID, groupName, showForm: controlledShowForm, setShowForm: controlledSetShowForm }) => {
  const [internalShowForm, setInternalShowForm] = useState(false);
  const showForm = controlledShowForm !== undefined ? controlledShowForm : internalShowForm;
  const setShowForm = controlledSetShowForm !== undefined ? controlledSetShowForm : setInternalShowForm;

  const [toast, setToast] = useState(null);

  useEffect(() => {
    const toastData = loadPersistentToast();
    if (toastData) setToast(toastData);
  }, []);

  const handleClose = () => {
    setShowForm(false);
  };

  const handleQuitGroup = async () => {
    try {
      await userQuitGroup(groupID);
      savePersistentToast({ message: 'Has salido del grupo con éxito.', type: 'success' });
      window.location.reload();
    } catch (error) {
      console.error("Error al salir del grupo:", error);
      setToast({ message: 'No has podido salir del grupo.', type: 'error' });
    }
  };

  return (
    <div>
      {controlledShowForm === undefined && (
        <button className='iconsShowForm btn-delete' onClick={() => setShowForm(true)}>
          <MdDeleteForever />
        </button>
      )}

      {showForm && createPortal(
        <div>
          <div className="form-create-group">
            <div className="headerCreateGroup">
              <div className="containerTitleGroup">
                <div>Salir del Grupo</div>
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
              <p style={{ marginBottom: '20px', fontSize: '15px' }}>
                ¿Estás seguro de que deseas salir del grupo <strong>{groupName || ''}</strong>?
              </p>
              <div className="buttonCreateGroup" style={{ gap: '10px' }}>
                <button
                  className="buttonSubmitCreateGroup"
                  style={{ backgroundColor: '#f0f0f0', borderColor: '#ccc' }}
                  onClick={handleClose}
                >
                  Cancelar
                </button>
                <button
                  className="button-submit delete"
                  onClick={handleQuitGroup}
                  style={{ border: 'none', padding: '10px 20px' }}
                >
                  Salir del Grupo
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

export default QuitButton;

