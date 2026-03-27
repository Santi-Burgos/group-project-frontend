import { useState, useEffect } from "react";
import { createGroup } from "../services/servicesGroup.js";
import { Toast } from "./toast.js";
import { loadPersistentToast, savePersistentToast } from "../utils/showPersistentToast.js";
import CloseButton from "./closeModalbutton.js";
import { ReactComponent as UploadFileIcon } from "../assets/uploadFileIcon.svg?react";
import { createPortal } from "react-dom";

const CreateGroup = ({ onCreate, showForm: controlledShowForm, setShowForm: controlledSetShowForm }) => {

  const [internalShowForm, setInternalShowForm] = useState(false);

  const showForm = controlledShowForm !== undefined ? controlledShowForm : internalShowForm;
  const setShowForm = controlledSetShowForm !== undefined ? controlledSetShowForm : setInternalShowForm;

  const [toast, setToast] = useState(null);

  const [newGroup, setNewGroup] = useState({
    group_name: "",
    group_description: "",
    address_mail: "",
    group_img: null,
  });

  const [loading, setLoading] = useState(false);
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
    setShowForm(!showForm);
  };

  const closeSelf = () => setShowForm(false);

  const handleCreateGroup = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await createGroup(newGroup);
      savePersistentToast({ message: 'Has creado un grupo con éxito.', type: 'success' });
      closeSelf();
      window.location.reload();
    } catch (error) {
      setToast({ message: 'No has podido crear el grupo.', type: 'error' })
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {showForm && createPortal(
        <div>
          <div className="form-create-group" onClick={(e) => e.stopPropagation()}>
            <div className="headerCreateGroup">
              <div className="containerTitleGroup">
                <div>
                  Crear Nuevo Grupo
                </div>
                <div>
                  <CloseButton
                    handleState={handleClick}
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
              <form
                className="formContainer"
                onSubmit={handleCreateGroup}
                encType="multipart/form-data"
              >
                <div className="containerTitleInput">
                  <p className="groupName">
                    Nombre del grupo
                  </p>
                  <input
                    type="text"
                    placeholder="Nombre del grupo"
                    value={newGroup.group_name}
                    onChange={(e) =>
                      setNewGroup({ ...newGroup, group_name: e.target.value || '' })
                    }
                    required
                  />
                </div>
                <div className="containerTitleInput">
                  <p className="groupDescription">
                    Descripción
                  </p>
                  <textarea
                    placeholder="Descripción del grupo"
                    value={newGroup.group_description}
                    onChange={(e) =>
                      setNewGroup({ ...newGroup, group_description: e.target.value || '' })
                    }
                    required
                  />
                </div>
                <div className="containerTitleInput">
                  <p className="groupInvitation">
                    Invitaciones
                  </p>
                  <p className="mailExample">
                    Correo de invitado (ej. juan@ejemplo.com)
                  </p>
                  <input
                    type="email"
                    placeholder="Correo de invitado (ej. juan@ejemplo.com)"
                    value={newGroup.address_mail || ''}
                    onChange={(e) =>
                      setNewGroup({ ...newGroup, address_mail: e.target.value || '' })
                    }
                  />
                </div>
                <div className="containerTitleInput">
                  <label className="uploadContainer">
                    <UploadFileIcon />
                    Arrastra el archivo o haga click
                    <input
                      type="file"
                      accept="image/*"
                      name="group_img"
                      onChange={handleUploadImg}
                      hidden
                    />
                  </label>
                  {newGroup.group_img && (
                    <img
                      src={URL.createObjectURL(newGroup.group_img)}
                      alt="Preview"
                      width="100"
                    />
                  )}
                </div>
                <div className="buttonCreateGroup">
                  <button type="submit" className="buttonSubmitCreateGroup" disabled={loading}>
                    {loading ?
                      "Creando..." :

                      <div>
                        Crear Grupo
                      </div>
                    }
                  </button>
                </div>
              </form>
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

export default CreateGroup;
