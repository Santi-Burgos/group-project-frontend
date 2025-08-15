const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
        Authorization: token ? `Bearer ${token}` : ''
    };
};

export default getAuthHeaders;