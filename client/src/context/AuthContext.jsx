import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
axios.defaults.baseURL = import.meta.env.VITE_API_URL
const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const urlToken = params.get('token')

        if(urlToken) {
            saveToken(urlToken)
            window.history.replaceState({}, '', window.location.pathname)
        } else {
            const storedToken = localStorage.getItem('token')
            if(storedToken) {
                const decoded = decodeToken(storedToken)
                if(decoded && decoded.id) {
                    saveToken(storedToken)
                } else {
                    localStorage.removeItem('token')
                }
            }
        }

        setLoading(false)
    }, [])

    const saveToken = (newToken) => {
        setToken(newToken)
        localStorage.setItem('token', newToken)
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    }

    const decodeToken = (token) => {
        try {
            const payload = token.split('.')[1]
            return JSON.parse(atob(payload))
        } catch {
            return null
        }
    }

    const signup = async (email, password) => {
        const { data } = await axios.post('/api/auth/signup', { email, password })
        saveToken(data.token)
        return data
    }

    const signin = async (email, password) => {
        const { data } = await axios.post('/api/auth/signin', { email, password })
        saveToken(data.token)
        return data
    }

    const signout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
    }

    const value = {
        user,
        token,
        loading,
        signup,
        signin,
        signout,
        decodeToken,
        saveToken,
    }
    
  return (
    <AuthContext.Provider value={value}>
        {!loading && children}
    </AuthContext.Provider>
  )
}