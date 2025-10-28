import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
    token: string | null;
    role: string | null;
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

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            const decodedToken = decodeJWT(storedToken);
            setRole(decodedToken?.role);
            setToken(storedToken);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ token, role }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
