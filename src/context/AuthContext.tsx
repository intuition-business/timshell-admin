import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
    token: string | null;
    role: string | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const decodeJWT = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const decodedData = JSON.parse(atob(base64));
    return decodedData;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [role, setRole] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const login = (newToken: string) => {
        try {
            const decoded = decodeJWT(newToken);
            setToken(newToken);
            setRole(decoded?.role || null);
            localStorage.setItem("token", newToken);
        } catch (e) {
            console.error("Invalid token during login", e);
        }
    };

    const logout = () => {
        setToken(null);
        setRole(null);
        localStorage.removeItem("token");
    };

    // load token from storage once on mount
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            const decodedToken = decodeJWT(storedToken);
            setRole(decodedToken?.role || null);
            setToken(storedToken);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ token, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
