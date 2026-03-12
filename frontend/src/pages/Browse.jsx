import { useState, useEffect } from 'react'
import { contentAPI, watchlistAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

function Browse() {
  const { user } = useAuth()
  const [content, setContent] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [platformFilter, setPlatformFilter] = useState('ALL')
  const [genreFilter, setGenreFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadContent()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [content, search, typeFilter, platformFilter, genreFilter])

  const loadContent = async () => {
    try {
      const response = await contentAPI.getAll()
      setContent(response.data)
      setFiltered(response.data)
    } catch (err) {
      console.error('Failed to load content:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let result = [...content]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
      )
    }

    if (typeFilter !== 'ALL') {
      result = result.filter(c => c.type === typeFilter)
    }

    if (platformFilter !== 'ALL') {
      result = result.filter(c => c.platform === platformFilter)
    }

    if (genreFilter !== 'ALL') {
      result = result.filter(c => c.genre === genreFilter)
    }

    setFiltered(result)
  }

  const addToWatchlist = async (contentId) => {
    if (!user) {
      setMessage('Please login to add items to your watchlist')
      setTimeout(() => setMessage(''), 3000)
      return
    }
    try {
      await watchlistAPI.add({ contentId, status: 'PLAN_TO_WATCH' })
      setMessage('Added to watchlist!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to add to watchlist')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const platforms = [...new Set(content.map(c => c.platform).filter(Boolean))]
  const genres = [...new Set(content.map(c => c.genre).filter(Boolean))]

  if (loading) return <div className="loading">Loading content...</div>

  return (
    <div className="browse-page">
      <h1>Browse Content</h1>

      {message && <div className="toast-message">{message}</div>}

      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search movies and series..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="ALL">All Types</option>
            <option value="MOVIE">Movies</option>
            <option value="SERIES">Series</option>
          </select>
          <select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)}>
            <option value="ALL">All Platforms</option>
            {platforms.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
            <option value="ALL">All Genres</option>
            {genres.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>

      <div className="content-count">{filtered.length} title{filtered.length !== 1 ? 's' : ''} found</div>

      <div className="content-grid">
        {filtered.map(item => (
          <div key={item.id} className="content-card">
            <div className="content-card-image">
              {item.posterUrl ? (
                <img src={item.posterUrl} alt={item.title} />
              ) : (
                <div className="no-poster">{item.type === 'MOVIE' ? '🎬' : '📺'}</div>
              )}
              <span className={`badge badge-${item.type.toLowerCase()}`}>{item.type}</span>
            </div>
            <div className="content-card-body">
              <h3>{item.title}</h3>
              <div className="content-meta">
                <span>{item.releaseYear}</span>
                <span>{item.platform}</span>
                <span>{item.genre}</span>
              </div>
              <p className="content-description">{item.description}</p>
              {item.averageRating && (
                <div className="content-rating">⭐ {item.averageRating}/10</div>
              )}
              {item.totalEpisodes && (
                <div className="content-episodes">{item.totalEpisodes} episodes</div>
              )}
              {user && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => addToWatchlist(item.id)}
                >
                  + Add to Watchlist
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">No content matches your filters.</div>
      )}
    </div>
  )
}

export default Browse
