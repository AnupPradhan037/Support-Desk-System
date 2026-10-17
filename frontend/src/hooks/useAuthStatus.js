import { useSelector } from 'react-redux'

const useAuthStatus = () => {
  const { user } = useSelector((state) => state.auth)

  // Derived directly from the store, so there is no flash of "logged out"
  return {
    loggedIn: Boolean(user),
    checkingStatus: false,
  }
}

export default useAuthStatus