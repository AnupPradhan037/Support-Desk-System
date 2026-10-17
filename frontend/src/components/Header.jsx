import {
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
  FaUserCog,
  FaMoon,
  FaSun,
  FaChartBar,
} from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import useTheme from '../hooks/useTheme'

function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { theme, toggleTheme } = useTheme()

  const { user } = useSelector((state) => state.auth)

  const onLogout = async () => {
    await dispatch(logout())
    navigate('/')
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">Support Desk</Link>
        </div>

        <ul className="nav-links">
          <li>
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {theme === 'dark' ? <FaSun /> : <FaMoon />}
            </button>
          </li>

          {user ? (
            <>
              {user?.isStaff && (
                <li>
                  <Link to="/dashboard">
                    <FaChartBar /> Dashboard
                  </Link>
                </li>
              )}
              <li>
                <Link to="/profile">
                  <FaUserCog /> {user.name?.split(' ')[0] || 'Profile'}
                </Link>
              </li>
              <li>
                <button className="btn" onClick={onLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">
                  <FaSignInAlt /> Login
                </Link>
              </li>
              <li>
                <Link to="/register">
                  <FaUser /> Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  )
}

export default Header