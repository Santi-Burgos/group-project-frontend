import React, {useState} from 'react';
import { createUser, loggearUser } from '../services/servicesLogin.js';
import { useNavigate } from 'react-router-dom';
import { Toast } from './toast.js';

const Logger = () =>{

    const [newUser, setNewUser] = useState({
        address_mail:'',
        username:'', 
        password:''
    });
    const [newUserLogin, setNewUserLogin] = useState({
        address_mail:'', 
        password:''})

    const [toast, setToast] = useState(null);
    const navigate = useNavigate('');

    const handleCreateUser = async() =>{
        try{
            console.log(newUser)
            await createUser(newUser);

            setToast({ message: '✅ Usuario creado exitosamente.', type: 'success' });

            setNewUser({
                address_mail:'',
                username:'', 
                password:''
            })
        }catch(error){
            console.error('Error creando usuario', error)
            setToast({ message: '❌ Error creando usuario.', type: 'error' });
        }
    };

    const handleLoggin = async () => {
        try {
            const response = await loggearUser(newUserLogin); 
            if (response.success === true){
                setToast({ message: '✅ Logueado con éxito.', type: 'success' });
                setNewUserLogin({ address_mail:'', password:''});
                navigate('/main');
            }
        } catch (error) {
            console.log('Error loggeando el usuario', error);
            setToast({ message: '❌ Error loggeando el usuario.', type: 'error' });
        }
    };

    return(
        <div className='body'>
            <div
            className='contenedor-login'>
                <div className='card-login'>
                        <div className='login-title'>Registrarse</div>
                        <input  
                            placeholder='Email'
                            type ="Text"
                            value={newUser.address_mail}
                            onChange={(e) => setNewUser({ ...newUser, address_mail: e.target.value })}
                        />
                        <input  
                            placeholder='Username'
                            type ="Text"
                            value={newUser.username}
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        />
                        <input 
                            placeholder='Password'
                            type='Password'
                            value ={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        />
                        <button onClick={handleCreateUser}>Crear Usuario</button>
                </div>
            </div>
            <div 
            className='contenedor-login'>
                <div className='card-login'>
                    <div className='login-title'>Loggearse</div>
                    <input
                        placeholder='Email'
                        type ="Text"
                        value={newUserLogin.address_mail}
                        onChange={(e) => setNewUserLogin({ ...newUserLogin, address_mail: e.target.value })}
                    />
                    <input
                        placeholder='Password'
                        type ="Password"
                        value={newUserLogin.password}
                        onChange={(e) => setNewUserLogin({ ...newUserLogin, password: e.target.value })}
                    />
                    <button onClick={handleLoggin}> Iniciar Sesion </button>
                </div>
            </div>
            {toast && (
                <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
                />
            )}

            <p>TE AMO IRINA</p>
        </div>
    )
}

export default Logger