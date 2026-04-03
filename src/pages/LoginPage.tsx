import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })

    if (err) {
      console.error('Login error:', err.message, err.status)
      setError(`Greška: ${err.message}`)
      setLoading(false)
      return
    }

    if (!data.session) {
      setError('Sesija nije kreirana. Proverite Supabase konfiguraciju.')
      setLoading(false)
      return
    }

    navigate('/admin')
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="login-header">
          <img src="/logo.webp" alt="Vrbovski" className="login-logo" />
          <h1>Admin Panel</h1>
          <p>Unesite pristupne podatke</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}

          <label className="login-label">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="login-input"
            />
          </label>

          <label className="login-label">
            <span>Lozinka</span>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="login-input"
            />
          </label>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Prijavljivanje...' : 'Prijavi se'}
          </button>
        </form>
      </div>
    </main>
  )
}
