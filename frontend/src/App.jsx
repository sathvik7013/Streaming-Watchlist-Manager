import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Browse from './pages/Browse'
import Watchlist from './pages/Watchlist'
import './App.css'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to="/watchlist" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/watchlist" /> : <Register />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/watchlist" element={user ? <Watchlist /> : <Navigate to="/login" />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>Streaming Watchlist Manager &copy; 2025</p>
      </footer>
    </div>
  )
}

export default App
