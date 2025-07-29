import React, { useState } from 'react';
import { sendInvitation } from "../services/servicesNotification.js";
import { BsEnvelopePlus, BsEnvelopeX} from "react-icons/bs";
import { Toast } from './toast.js';

const InviteButton = ({ groupID }) => {
    const [showInput, setShowInput] = useState(false);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null)
    const [message, setMessage] = useState('');

    const handleSendInvitation = async () => {
        if (!email) {
            setMessage('Por favor, ingresa un correo.');
            return;
        }
        setLoading(true);
        try {
            const response = await sendInvitation({ groupID, address_mail: email });
        
            if (response.success) {
                setToast({ message: '✅ Has enviado la notificación con éxito.', type: 'success' });
                setEmail('');
            }else {
                setMessage(response?.message || 'No se pudo enviar la invitación.');
                setToast({ message: '❌ No se ha podido enviar la invitación.', type: 'error' });
            }
        } catch (error) {
            setToast({ message: '❌ No se ha podido enviar la invitación.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='invite-wrapper'>
            <button className="iconsShowForm" onClick={() => setShowInput(!showInput)}>
                {showInput ? <BsEnvelopeX /> : <BsEnvelopePlus />}
            </button>

            {showInput && (
                <div className="invite-container">
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={handleSendInvitation} disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar'}
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

export default InviteButton;
