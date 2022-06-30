import React, { createContext, useState, } from 'react'

export const AuthContext = createContext({
    login: () => {},
    name: null,
    isAuthenticated: false,
    logout: () => {},
    token: null,
})

const AuthWrapper = ( {children} ) =>{
    const [isAuthenticated, setIsAuthenticated] = useState(
         (localStorage.getItem("isAuthenticated") || "false") === "true" ? true: false )
         
    const [name, setName] = useState(null)
    const [token, setToken] = useState(null)

    const login = (name, token) => {
        setIsAuthenticated(true)
        setName(name)
        setToken(token)
        localStorage.setItem("token", token)
        localStorage.setItem("name", name)
        localStorage.setItem("isAuthenticated", true)
    }

    const logout = () => {
        setIsAuthenticated(false)
        setName(null)
        setToken(null)
        localStorage.removeItem("token")
        localStorage.removeItem("name")
        localStorage.removeItem("isAuthenticated")
    }

    return (
        <AuthContext.Provider value = {{isAuthenticated: isAuthenticated, logout: logout, login: login, name: name, token: token}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthWrapper