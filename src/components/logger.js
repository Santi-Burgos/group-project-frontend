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
            {(!view) ? 
            <div className='container'> 
                <div className='contenedor-login'>
                    <h1>Chatgrupal</h1>
                    <button onClick={changeView} className='button-login'>
                        <span>
                            Ya tienes cuenta?
                        </span>
                    </button>
                    <div className='card-login'>
                            <div className='login-title'>
                                <h2>Registrarse</h2>
                            </div>
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
                            <span className='clarification'>El usuario debe tener al menos 5 caracteres</span>
                            <input 
                                placeholder='Password'
                                type='Password'
                                value ={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            />
                            <button className='button'onClick={handleCreateUser}>
                                <span className='button-content'>Crear Usuario <FaArrowRightLong/></span>
                            </button>
                    </div>
                </div>
            </div> : 
            <div className='container'>
                <div className='contenedor-login'>
                    <h1>Chatgrupal</h1>
                    <button onClick={changeView} className='button-login'>
                        <span>
                            No tienes cuenta?
                        </span>
                    </button>
                    <div className='card-login'>
                        <div className='login-title'>
                            <h2>Login</h2>
                        </div>
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
                        <button className='button' onClick={handleLoggin}> 
                            <span className='button-content'>Iniciar Sesion <FaArrowRightLong/></span></button>
                    </div>
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