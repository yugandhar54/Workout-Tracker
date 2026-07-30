import { createContext, useReducer, useEffect } from 'react'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload }
    case 'LOGOUT':
      return { user: null }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null })

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user')
      const user = storedUser ? JSON.parse(storedUser) : null

      if (user?.token) {
        dispatch({ type: 'LOGIN', payload: user })
      } else {
        localStorage.removeItem('user')
      }
    } catch (error) {
      localStorage.removeItem('user')
    }
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
