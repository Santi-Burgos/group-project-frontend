import { useState, useEffect } from 'react';
import { userQuitGroup } from "../services/servicesUserQuitGroup.js";
import { Toast } from "./toast.js";
import { savePersistentToast, loadPersistentToast } from "../utils/showPersistentToast.js";
import { MdOutlineExitToApp } from "react-icons/md";


const QuitButton = ({ groupID }) => {
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const toastData = loadPersistentToast();
        if (toastData) setToast(toastData);
    }, []);

    const handleQuitGroup = async () => {
        try {
            await userQuitGroup(groupID);
            savePersistentToast({ message: '✅ Has salido del grupo con éxito.', type: 'success' });
            window.location.reload();
        } catch (error) {
            console.error("Error al salir del grupo:", error);
            setToast({ message: '❌ No has podido salir del grupo.', type: 'error' });
        }
    };

    return (
        <div>
            <button className='iconsShowForm' onClick={handleQuitGroup}><MdOutlineExitToApp />
            </button>
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
