import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">🎬 Watchlist Manager</Link>
      </div>
      <div className="navbar-links">
        <Link to="/browse">Browse</Link>
        {user ? (
          <>
            <Link to="/watchlist">My Watchlist</Link>
            <span className="navbar-user">Hi, {user.username}</span>
            <button onClick={handleLogout} className="btn btn-outline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
