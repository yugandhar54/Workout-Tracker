import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'

import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Navbar from './components/Navbar'

const App = () => {
  const { user } = useAuthContext()

  useEffect(() => {
    if (typeof window === 'undefined' || !window.VANTA || !document.getElementById('vanta-bg')) return

    const effect = window.VANTA.CLOUDS({
      el: '#vanta-bg',
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      backgroundColor: 0xffffff,
      skyColor: 0x68b8d7,
      cloudColor: 0xadc1de,
      cloudShadowColor: 0x183550,
      sunColor: 0xff9919,
      sunGlareColor: 0xff6633,
      sunlightColor: 0xff9933,
      speed: 1
    })

    return () => effect && effect.destroy()
  }, [])

  return (
    <BrowserRouter>
      <div className="App">
        <div id="vanta-bg" className="vanta-bg" />
        <div className="app-shell">
          <Navbar />
          <div className="pages">
            <Routes>
              <Route
                path="/"
                element={user ? <Home /> : <Navigate to="/login" />}
              />
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/" />}
              />
              <Route
                path="/signup"
                element={!user ? <Signup /> : <Navigate to="/" />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
