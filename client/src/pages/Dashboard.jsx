import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export default function Dashboard() {
  const { signout } = useAuth()
  const navigate   = useNavigate()

  const [user, setUser]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  // ── Fetch user data on mount ───────────────────────────
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get('/api/auth/me')
        // data = { user: { firstName, lastName, email, role, ... } }
        setUser(data.user)
      } catch (err) {
        // Token might be expired
        setError('Session expired. Please log in again.')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])
  // [] = run once when dashboard first loads

  // ── Logout handler ─────────────────────────────────────
  const handleLogout = () => {
    signout()         // clears token from context + localStorage
    navigate('/login') // send them back to login page
  }

  // ── Loading state ──────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    )
  }

  // ── Error state ────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 underline cursor-pointer"
          >
            Back to login
          </button>
        </div>
      </div>
    )
  }

  // ── Main render ────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">MyApp</h1>
        <div className="flex items-center gap-4">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            /> ) : (<div className="w-8 h-8 rounded-full bg-gray-900 text-white text-xs font-medium flex items-center justify-center">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          )}
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-900 transition cursor-pointer"
          >
            Log out
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-10">

        {/* Welcome banner */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <p className="text-sm text-gray-500 mb-1">Welcome back 👋</p>
          <h2 className="text-2xl font-bold text-gray-900">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-sm text-gray-500 mt-1">@{user?.displayName}</p>
        </div>

        {/* User details card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            Account details
          </h3>

          {/* Each detail row */}
          <div className="space-y-4">

            <DetailRow label="Email" value={user?.email} />

            <DetailRow
              label="Role"
              value={
                // Capitalize first letter of role
                user?.role
                  ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                  : '—'
              }
            />

            <DetailRow
              label="Date of birth"
              value={
                user?.dateOfBirth
                  // Format: "15 June 1995"
                  ? new Date(user.dateOfBirth).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : '—'
              }
            />

            <DetailRow
              label="Sign in method"
              value={user?.googleId ? 'Google' : 'Email & Password'}
            />

            <DetailRow
              label="Member since"
              value={
                new Date(user?.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              }
            />

          </div>
        </div>

      </main>
    </div>
  )
}

// ── Small reusable component for each row ──────────────
function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-800">{value}</span>
    </div>
  )
}