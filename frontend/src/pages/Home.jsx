import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Home() {
  const { user } = useAuth()

  return (
    <div className="home-page">
      <div className="hero">
        <h1>Streaming Watchlist Manager</h1>
        <p>Organize and track your movies and TV series across all streaming platforms in one place.</p>
        <div className="hero-actions">
          <Link to="/browse" className="btn btn-primary btn-lg">Browse Content</Link>
          {!user && <Link to="/register" className="btn btn-outline btn-lg">Get Started</Link>}
          {user && <Link to="/watchlist" className="btn btn-outline btn-lg">My Watchlist</Link>}
        </div>
      </div>
      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">🔍</div>
          <h3>Browse & Search</h3>
          <p>Explore movies and series from Netflix, HBO Max, Disney+, Amazon Prime, and more.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📋</div>
          <h3>Track Progress</h3>
          <p>Mark content as Plan to Watch, Watching, Completed, or Dropped.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⭐</div>
          <h3>Rate & Review</h3>
          <p>Rate content and add personal notes to remember your thoughts.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Statistics</h3>
          <p>View your watchlist statistics and track your viewing habits.</p>
        </div>
      </div>
    </div>
  )
}

export default Home
