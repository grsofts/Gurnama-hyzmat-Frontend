/* eslint-disable react-hooks/immutability */
import React, { createContext, useState, useEffect } from 'react';

import loginService from '../api/login.service';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Настройка axios interceptors для автоматического обновления токенов
    useEffect(() => {
        // Проверяем, есть ли токен при загрузке
        checkAuth();

        return () => {
        };
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                // Проверяем валидность токена
                // const response = await axios.get(`${API_URL}/auth/me`);
                // setUser(response.data.user);
            } catch (error) {
                // Если токен невалидный, очищаем
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                console.log(error);
                
                setUser(null);
            }
        }
        setLoading(false);
    };

    const login = async (login, password) => {
        try {
            const response = await loginService.login({ login, password });
            const { user } = response;
            
            setUser(user);
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Ошибка авторизации' 
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};