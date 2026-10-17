import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

// Use inside PrivateRoute: only staff may open these pages
const StaffRoute = () => {
  const { user } = useSelector((state) => state.auth)
  return user?.isStaff ? <Outlet /> : <Navigate to="/" replace />
}

export default StaffRoute