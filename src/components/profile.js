import { useState, useEffect } from "react";
import DeleteAccountButton from "./deleteAcc.js";
import {getUser, editUser} from '../services/servicesProfile.js'
import { Toast } from "./toast.js"; 
import { savePersistentToast, loadPersistentToast } from "../utils/showPersistentToast.js";
import { VscAccount } from "react-icons/vsc";


const ProfileComponent = ({}) =>{
    const [takeUser, setTakeUser] = useState([]);
    const [showProfile, setShowProfile] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editProfile, setEditProfile] = useState({
        address_mail: "", 
        user : "",
        password: "",
        currentPassword: ""
    })
    
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const toastData = loadPersistentToast();
        if (toastData) setToast(toastData);
    }, []);

    useEffect(()=>{
        if(!showProfile) return;

        const fetchData = async () =>{
            try{
                const response = await getUser()
                setTakeUser(response.data);
                setEditProfile({
                    address_mail: response.data.address_mail || "",
                    user: response.data.user || "",
                    password: "",
                    currentPassword: ""
                });
            }catch(error){
                console.log('No se ha podido recuperar al usuario')
            }
        };
        fetchData();
    }, [showProfile])

    const handleOpenProfile = () =>{
        setShowProfile(!showProfile);
    }

    const handleEditUser = async(event) =>{
        event.preventDefault();
        setLoading(true);
        try{
            const response = await editUser(
                editProfile.address_mail, 
                editProfile.user, 
                editProfile.password,
                editProfile.currentPassword);
                setEditProfile({  address_mail: "", 
                    user : "",
                    password: "",
                    currentPassword: ""})
            if(response.success){
            savePersistentToast({message: '✅ Has podido editar tu perfil', type:'success'})
            window.location.reload();
            }
        }catch(error){
            savePersistentToast({message: '❌ No has podido editar tu perfil', type:'error'})
            window.location.reload();
            console.log('no se ha podido editar el usuario', error)
        }   
}
    return(
        <div>
        <button id="form-create-group" onClick={handleOpenProfile} className="iconsShowForm">
            {showProfile ? "X" : <VscAccount />}
        </button>
        {showProfile && (
        <div className="form-create-group">
            <DeleteAccountButton />
            <form onSubmit={handleEditUser}>
                <input
                    type="text"
                    placeholder="Address mail"
                    value={editProfile.address_mail}
                    onChange={(e) =>
                    setEditProfile({ ...editProfile, address_mail: e.target.value })
                    }
                />
                <input
                    type="text"
                    placeholder="Username"
                    value={editProfile.user}
                    onChange={(e) =>
                    setEditProfile({ ...editProfile, user: e.target.value })
                    }
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={editProfile.password}
                    onChange={(e) =>
                    setEditProfile({ ...editProfile, password: e.target.value })
                    }
                />
                <input
                    type="password"
                    placeholder="Current Password"
                    value={editProfile.currentPassword}
                    onChange={(e) =>
                    setEditProfile({
                        ...editProfile,
                        currentPassword: e.target.value,
                    })
                    }
                />
                <button className="button-submit normal" type="submit" disabled={loading}>
                    {loading ? "Editando..." : "Editar Usuario"}
                </button>
            </form>
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

export default ProfileComponent