import { useState, useRef, useEffect } from 'react';
import { SlOptionsVertical } from "react-icons/sl";

const ContextMenu = ({ listMap, customStyles }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="context-menu-wrapper" ref={menuRef}>
      <button onClick={toggleMenu} className="iconsShowForm btn-main">
        <SlOptionsVertical />
      </button>
      
      {isOpen && (
        <div className="context-menu-container" style={customStyles}>
          <ul className="context-menu-list">
            {listMap.map((item) => (
              <li 
                key={item.name} 
                onClick={() => {
                  item.handle();
                  setIsOpen(false);
                }} 
                className="context-menu-item"
              >
                {item.icon && <item.icon className="context-menu-icon" />}
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ContextMenu;