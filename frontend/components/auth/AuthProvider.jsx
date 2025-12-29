'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUser, getToken, isAuthenticated, logout as authLogout } from '@/lib/auth';

const AuthContext = createContext({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
    login: () => { },
    logout: () => { },
    refreshState: () => { },
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshState = () => {
        setUser(getUser());
        setToken(getToken());
    };

    useEffect(() => {
        refreshState();
        setIsLoading(false);
    }, []);

    const logout = () => {
        authLogout();
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                isAuthenticated: !!token && !!user,
                logout,
                refreshState,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
