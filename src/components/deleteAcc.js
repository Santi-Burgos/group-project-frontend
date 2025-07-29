import { useState, useEffect } from 'react';
import { userDelete } from '../services/servicesProfile.js';
import { Toast } from './toast.js';
import { savePersistentToast, loadPersistentToast } from '../utils/showPersistentToast.js';

const DeleteAccountButton = () => {
  const [showInput, setShowInput] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
          const toastData = loadPersistentToast();
          if (toastData) setToast(toastData);
      }, []);

  const handleDelete = async () => {
    setLoading(true);

    try {
      await userDelete(currentPassword);
      savePersistentToast({message: '✅ Haz eliminado tu cuenta con éxito.', type: 'success'})
      window.location.reload();
    } catch (error) {
      setToast({message:'❌ No has podido eliminar tu cuenta.', type: 'error'})
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="delete-account">
      {!showInput ? (
        <button className='button-submit delete' onClick={() => setShowInput(true)}>Eliminar cuenta</button>
      ) : (
        <div>
          <input
            type="password"
            placeholder="Contraseña actual"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <button className="button-submit normal" onClick={handleDelete} disabled={loading || !currentPassword}>
            {loading ? 'Eliminando...' : 'Confirmar'}
          </button>
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
};

export default DeleteAccountButton;
