import { useState, useEffect } from "react";
import { createGroup } from "../services/servicesGroup.js";
import { Toast } from "./toast.js";
import { loadPersistentToast, savePersistentToast } from "../utils/showPersistentToast.js";


const CreateGroup = ({ onCreate }) => {

  const [showForm, setShowFrom] = useState(false);

  const [toast, setToast] = useState(null);

  const [newGroup, setNewGroup] = useState({
    group_name: "",
    group_description: "",
    address_mail: "",
    group_img: null,    
  });

  const [loading, setLoading] = useState(false); // Para mostrar un spinner o deshabilitar el botón

    useEffect(() => {
        const toastData = loadPersistentToast();
        if (toastData) setToast(toastData);
    }, []);

  const handleUploadImg = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewGroup((prev) => ({ ...prev, group_img: file }));
    }
  };

  const handleClick = () => {
    setShowFrom(!showForm);
  };

  const handleCreateGroup = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await createGroup(newGroup); 
      savePersistentToast({ message: '✅ Haz creado un grupo con éxito.', type: 'success' });
      window.location.reload();
      setNewGroup({ group_name: "", group_description: "", address_mail: "", group_img: null });
      if (onCreate) onCreate(); 
    } catch (error) {
      setToast({message: '❌ No has podido crear el grupo.', type: 'error'})
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button id="form-create-group" onClick={handleClick} className="iconsShowForm btn-main">
        {showForm ? "-" : "+"}
      </button>
      {showForm && (
        <div>
          <div className="form-create-group">
            <form onSubmit={handleCreateGroup} encType="multipart/form-data">
              <input
                type="text"
                placeholder="Nombre del grupo"
                value={newGroup.group_name}
                onChange={(e) => setNewGroup({ ...newGroup, group_name: e.target.value || '' })}
                required
              />

              <textarea
                placeholder="Descripción del grupo"
                value={newGroup.group_description}
                onChange={(e) => setNewGroup({ ...newGroup, group_description: e.target.value || '' })}
                required
              />
              <input 
                type="email"
                placeholder="Correo del invitado"
                value={newGroup.address_mail || ''}  // Asegúrate de que nunca sea undefined
                onChange={(e) => setNewGroup({ ...newGroup, address_mail: e.target.value || '' })}
              />
              <input type="file" accept="image/*" name="group_img" onChange={handleUploadImg} />
              {newGroup.group_img && (
                <img
                  src={URL.createObjectURL(newGroup.group_img)}
                  alt="Preview"
                  width="100"
                />
              )}

              <button type="submit" disabled={loading}>
                {loading ? "Creando..." : "Crear Grupo"}
              </button>
            </form>
          </div>
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

export default CreateGroup;
