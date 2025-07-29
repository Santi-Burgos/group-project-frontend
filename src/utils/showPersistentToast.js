export const savePersistentToast = (toastData) => {
    sessionStorage.setItem('toast', JSON.stringify(toastData));
  };
  
  export const loadPersistentToast = () => {
    const savedToast = sessionStorage.getItem('toast');
    if (savedToast) {
      sessionStorage.removeItem('toast');
      return JSON.parse(savedToast);
    }
    return null;
  };