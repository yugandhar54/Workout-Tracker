import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useAuthContext()

  const signup = async (email, password) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:4000/api/user/signup', {
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
        setError(json?.error || 'Signup failed')
        setIsLoading(false)
        return
      }

      localStorage.setItem('user', JSON.stringify(json))
      dispatch({ type: 'LOGIN', payload: json })
      setIsLoading(false)
    } catch (err) {
      setError(err.message || 'Signup failed')
      setIsLoading(false)
    }
  }

  return { signup, isLoading, error }
}
