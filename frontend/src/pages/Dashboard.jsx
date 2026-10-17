import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaChartBar } from 'react-icons/fa'
import statsService from '../features/stats/statsService'
import BackButton from '../components/BackButton'
import Spinner from '../components/Spinner'

const formatDuration = (hours) => {
  if (hours === null || hours === undefined) return '—'
  if (hours < 1) return `${Math.round(hours * 60)} min`
  if (hours < 48) return `${hours.toFixed(1)} h`
  return `${(hours / 24).toFixed(1)} days`
}

function StatCard({ label, value, hint, to }) {
  const content = (
    <>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
      {hint && <small className="muted">{hint}</small>}
    </>
  )

  return to ? (
    <Link to={to} className="stat-card stat-link">
      {content}
    </Link>
  ) : (
    <div className="stat-card">{content}</div>
  )
}

function BarList({ title, rows, colorByLabel }) {
  const max = Math.max(1, ...rows.map((r) => r.count))

  return (
    <section className="panel">
      <h3>{title}</h3>
      {rows.length === 0 ? (
        <p className="muted">No data yet.</p>
      ) : (
        rows.map((row) => (
          <div className="bar-row" key={row.label}>
            <span className="bar-label">{row.label}</span>
            <div className="bar-track">
              <div
                className={`bar-fill ${colorByLabel ? `fill-${row.label}` : ''}`}
                style={{ width: `${(row.count / max) * 100}%` }}
              />
            </div>
            <span className="bar-count">{row.count}</span>
          </div>
        ))
      )}
    </section>
  )
}

function Dashboard() {
  const { user } = useSelector((state) => state.auth)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    statsService
      .getStats(user.token)
      .then((data) => {
        if (!cancelled) setStats(data)
      })
      .catch((error) => {
        if (!cancelled) {
          toast.error(error.response?.data?.message || 'Failed to load dashboard')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [user.token])

  if (loading) return <Spinner />

  if (!stats) {
    return (
      <>
        <BackButton url="/" />
        <p className="empty">Could not load the dashboard.</p>
      </>
    )
  }

  const maxDay = Math.max(1, ...stats.last7Days.map((d) => d.count))

  return (
    <>
      <BackButton url="/" />

      <section className="heading">
        <h1>
          <FaChartBar /> Staff Dashboard
        </h1>
        <p>Overview of all support tickets</p>
      </section>

      <div className="stat-grid">
        <StatCard label="Total tickets" value={stats.totals.all} to="/tickets" />
        <StatCard label="New" value={stats.totals.new} />
        <StatCard label="Open" value={stats.totals.open} />
        <StatCard label="Closed" value={stats.totals.closed} />
        <StatCard
          label="Unassigned"
          value={stats.unassigned}
          hint="not closed"
          to="/tickets"
        />
        <StatCard label="Assigned to me" value={stats.assignedToMe} hint="not closed" />
        <StatCard
          label="Avg. first response"
          value={formatDuration(stats.avgFirstResponseHours)}
        />
      </div>

      <section className="panel">
        <h3>New tickets, last 7 days</h3>
        <div className="spark">
          {stats.last7Days.map((day) => (
            <div className="spark-col" key={day.date} title={`${day.date}: ${day.count}`}>
              <span className="spark-count">{day.count}</span>
              <div className="spark-bar" style={{ height: `${(day.count / maxDay) * 100}%` }} />
              <span className="spark-label">{day.date.slice(5)}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="panel-grid">
        <BarList title="Active tickets by priority" rows={stats.byPriority} colorByLabel />
        <BarList title="Tickets by category" rows={stats.byCategory} />
        <BarList title="Tickets by product" rows={stats.byProduct} />
      </div>
    </>
  )
}

export default Dashboard