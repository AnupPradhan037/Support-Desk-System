import { FaArrowLeft } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'

// Usage: <BackButton url="/tickets" />  (url is optional)
function BackButton({ url }) {
  const navigate = useNavigate()

  if (url) {
    return (
      <Link to={url} className="btn btn-reverse btn-sm">
        <FaArrowLeft /> Back
      </Link>
    )
  }

  return (
    <button className="btn btn-reverse btn-sm" onClick={() => navigate(-1)}>
      <FaArrowLeft /> Back
    </button>
  )
}

export default BackButton