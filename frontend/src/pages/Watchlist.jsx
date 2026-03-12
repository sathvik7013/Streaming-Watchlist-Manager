import { useState, useEffect } from 'react'
import { watchlistAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const STATUS_LABELS = {
  PLAN_TO_WATCH: 'Plan to Watch',
  WATCHING: 'Watching',
  COMPLETED: 'Completed',
  DROPPED: 'Dropped'
}

function Watchlist() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [stats, setStats] = useState({})
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    loadWatchlist()
    loadStats()
  }, [user])

  const loadWatchlist = async () => {
    try {
      const response = await watchlistAPI.getAll()
      setItems(response.data)
    } catch (err) {
      console.error('Failed to load watchlist:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await watchlistAPI.getStats()
      setStats(response.data)
    } catch (err) {
      console.error('Failed to load stats:', err)
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      const item = items.find(i => i.id === id)
      await watchlistAPI.update(id, { contentId: item.contentId, status: newStatus })
      loadWatchlist()
      loadStats()
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const handleRemove = async (id) => {
    if (!window.confirm('Remove this item from your watchlist?')) return
    try {
      await watchlistAPI.remove(id)
      setItems(items.filter(i => i.id !== id))
      loadStats()
    } catch (err) {
      console.error('Failed to remove item:', err)
    }
  }

  const startEditing = (item) => {
    setEditingId(item.id)
    setEditForm({
      contentId: item.contentId,
      status: item.status,
      userRating: item.userRating || '',
      currentEpisode: item.currentEpisode || '',
      notes: item.notes || ''
    })
  }

  const saveEdit = async () => {
    try {
      const payload = { ...editForm }
      if (payload.userRating === '') payload.userRating = null
      if (payload.currentEpisode === '') payload.currentEpisode = null
      await watchlistAPI.update(editingId, payload)
      setEditingId(null)
      loadWatchlist()
      loadStats()
    } catch (err) {
      console.error('Failed to save:', err)
    }
  }

  const filteredItems = statusFilter === 'ALL'
    ? items
    : items.filter(i => i.status === statusFilter)

  const totalItems = Object.values(stats).reduce((a, b) => a + b, 0)

  if (loading) return <div className="loading">Loading watchlist...</div>

  return (
    <div className="watchlist-page">
      <h1>My Watchlist</h1>

      <div className="stats-bar">
        <div className="stat-item" onClick={() => setStatusFilter('ALL')}>
          <span className="stat-number">{totalItems}</span>
          <span className="stat-label">Total</span>
        </div>
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <div
            key={key}
            className={`stat-item ${statusFilter === key ? 'active' : ''}`}
            onClick={() => setStatusFilter(statusFilter === key ? 'ALL' : key)}
          >
            <span className="stat-number">{stats[key] || 0}</span>
            <span className="stat-label">{label}</span>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="empty-state">
          <p>{statusFilter === 'ALL'
            ? 'Your watchlist is empty. Browse content to add items!'
            : `No items with status "${STATUS_LABELS[statusFilter]}".`}
          </p>
        </div>
      ) : (
        <div className="watchlist-grid">
          {filteredItems.map(item => (
            <div key={item.id} className={`watchlist-card status-${item.status.toLowerCase()}`}>
              <div className="watchlist-card-header">
                <div className="watchlist-card-info">
                  <h3>{item.contentTitle}</h3>
                  <div className="content-meta">
                    <span className={`badge badge-${item.contentType.toLowerCase()}`}>{item.contentType}</span>
                    <span>{item.platform}</span>
                    <span>{item.genre}</span>
                  </div>
                </div>
              </div>

              {editingId === item.id ? (
                <div className="edit-form">
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                    >
                      {Object.entries(STATUS_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Rating (1-10)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={editForm.userRating}
                        onChange={(e) => setEditForm({...editForm, userRating: e.target.value ? parseInt(e.target.value) : ''})}
                      />
                    </div>
                    {item.totalEpisodes && (
                      <div className="form-group">
                        <label>Episode ({item.totalEpisodes} total)</label>
                        <input
                          type="number"
                          min="0"
                          max={item.totalEpisodes}
                          value={editForm.currentEpisode}
                          onChange={(e) => setEditForm({...editForm, currentEpisode: e.target.value ? parseInt(e.target.value) : ''})}
                        />
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Notes</label>
                    <textarea
                      value={editForm.notes}
                      onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                      placeholder="Add personal notes..."
                      rows="2"
                    />
                  </div>
                  <div className="edit-actions">
                    <button className="btn btn-primary btn-sm" onClick={saveEdit}>Save</button>
                    <button className="btn btn-outline btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="watchlist-card-body">
                  <div className="watchlist-details">
                    <div className="status-select">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      >
                        {Object.entries(STATUS_LABELS).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                    </div>
                    {item.userRating && <div className="user-rating">⭐ {item.userRating}/10</div>}
                    {item.totalEpisodes && (
                      <div className="episode-progress">
                        Ep {item.currentEpisode || 0}/{item.totalEpisodes}
                      </div>
                    )}
                    {item.notes && <div className="item-notes">{item.notes}</div>}
                  </div>
                  <div className="watchlist-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => startEditing(item)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleRemove(item.id)}>Remove</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Watchlist
