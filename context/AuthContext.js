import { createContext, useContext, useState } from "react";

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    return <AuthContext.Provider value={{ user, setUser, token, setToken }}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)