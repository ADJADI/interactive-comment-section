import axios from 'axios';

const API_URL = "http://127.0.0.1/frontEndMentor/interactive-comment-section/server";


const initAuth = () => {
    axios.interceptors.request.use(
        config => {
            const token = sessionStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        error => Promise.reject(error)
    );

    axios.interceptors.response.use(
        response => response,
        error => {
            if (error.response && error.response.status === 401) {
                logout();
            }
            return Promise.reject(error);
        }
    );
};

const isAuthenticated = () => {
    return !!sessionStorage.getItem('token');
};

const getCurrentUser = () => {
    try {
        const userStr = sessionStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
        return null;
    }
};

const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/api/authentication/authentication.php`, {
            email,
            password
        });

        if (response.data.success && response.data.token) {
            sessionStorage.setItem('token', response.data.token);
            sessionStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data.user;
        } else {
            throw new Error(response.data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error details:', error);
        throw error;
    }
};

const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
};

export {
    initAuth,
    isAuthenticated,
    getCurrentUser,
    login,
    logout
};
