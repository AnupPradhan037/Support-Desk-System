import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaQuestionCircle, FaTicketAlt, FaChartBar } from 'react-icons/fa'

function Home() {
  const { user } = useSelector((state) => state.auth)

  return (
    <>
      <section className="heading">
        <h1>What do you need help with?</h1>
        <p>Please choose from an option below</p>
      </section>

      <Link to="/new-ticket" className="btn btn-reverse btn-block">
        <FaQuestionCircle /> Create New Ticket
      </Link>

      <Link to="/tickets" className="btn btn-block">
        <FaTicketAlt /> {user?.isStaff ? 'View All Tickets' : 'View My Tickets'}
      </Link>

      {user?.isStaff && (
        <Link to="/dashboard" className="btn btn-reverse btn-block">
          <FaChartBar /> Staff Dashboard
        </Link>
      )}
    </>
  )
}

export default Home