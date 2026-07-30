import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useLogin = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useAuthContext()

  const login = async (email, password) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:4000/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      let json = null
      try {
        json = await response.json()
      } catch {
        json = null
      }

      if (!response.ok) {
        setError(json?.error || 'Login failed')
        setIsLoading(false)
        return
      }

      localStorage.setItem('user', JSON.stringify(json))
      dispatch({ type: 'LOGIN', payload: json })
      setIsLoading(false)
    } catch (err) {
      setError(err.message || 'Login failed')
      setIsLoading(false)
    }
  }

  return { login, isLoading, error }
}
