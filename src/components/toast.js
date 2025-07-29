import { useEffect } from 'react';

export function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const backgroundColor = type === 'success' ? 'green' : 'red';

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor,
      color: 'white',
      padding: '10px 20px',
      borderRadius: '8px',
      boxShadow: '0px 2px 10px rgba(0,0,0,0.3)',
      zIndex: 9999,
    }}>
      {message}
    </div>
  );
}
