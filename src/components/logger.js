import {useState} from 'react';
import { createUser, loggearUser } from '../services/servicesLogin.js';
import { useNavigate } from 'react-router-dom';
import { Toast } from './toast.js';
import { FaArrowRightLong } from "react-icons/fa6";


const Logger = () =>{
    const navigate = useNavigate('');

    const [newUser, setNewUser] = useState({
        address_mail:'',
        username:'', 
        password:''
    });
    const [newUserLogin, setNewUserLogin] = useState({
        address_mail:'', 
        password:''})

    const [toast, setToast] = useState(null);
    const [view, setView] = useState(false);

    const changeView = () =>{
        setView(!view);
    }

    const handleCreateUser = async() =>{
        try{
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
            {(!view) ? 
            <div className='container'> 
                <div className='contenedor-login'>
                    <div className="header-branding">
                        <h1>Chatgrupal</h1>
                        <div className="separator"></div>
                        <h2>Registrarse</h2>
                    </div>
                    <div className='card-login'>
                            <input  
                                placeholder='Email'
                                type ="text"
                                value={newUser.address_mail}
                                onChange={(e) => setNewUser({ ...newUser, address_mail: e.target.value })}
                            />
                            <input  
                                placeholder='Username'
                                type ="text"
                                value={newUser.username}
                                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                            />
                            <span className='clarification'>El usuario debe tener al menos 5 caracteres</span>
                            <input 
                                placeholder='Password'
                                type='password'
                                value ={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            />
                            <button className='button'onClick={handleCreateUser}>
                                <span className='button-content'>Crear Usuario <FaArrowRightLong/></span>
                            </button>
                    </div>
                    <button onClick={changeView} className='button-login'>
                        <span>Ya tienes cuenta?</span>
                    </button>
                </div>
            </div> : 
            <div className='container'>
                <div className='contenedor-login'>
                    <div className="header-branding">
                        <h1>Chatgrupal</h1>
                        <div className="separator"></div>
                        <h2>Login</h2>
                    </div>
                    <div className='card-login'>
                        <input
                            placeholder='Email'
                            type ="text"
                            value={newUserLogin.address_mail}
                            onChange={(e) => setNewUserLogin({ ...newUserLogin, address_mail: e.target.value })}
                        />
                        <input
                            placeholder='Password'
                            type ="password"
                            value={newUserLogin.password}
                            onChange={(e) => setNewUserLogin({ ...newUserLogin, password: e.target.value })}
                        />
                        <button className='button' onClick={handleLoggin}> 
                            <span className='button-content'>Iniciar Sesion <FaArrowRightLong/></span></button>
                    </div>
                    <button onClick={changeView} className='button-login'>
                        <span>No tienes cuenta?</span>
                    </button>
                </div>
            </div> 
            }
            {toast && (
                <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
                />
            )}
        </div>
    )
}

export default Logger