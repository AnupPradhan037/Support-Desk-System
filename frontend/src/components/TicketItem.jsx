import { Link } from 'react-router-dom'
import { FaArrowCircleRight } from 'react-icons/fa'

function TicketItem({ ticket }) {
  if (!ticket || !ticket._id) {
    return null
  }

  const date = ticket.createdAt
    ? new Date(ticket.createdAt).toLocaleDateString()
    : 'N/A'

  const product = ticket.product || 'Unknown'

  const status = ticket.status || 'New'

  return (
    <div className="ticket">

      <div>
        {date}
      </div>

      <div>
        {product}
      </div>

      <div>
        <span
          className={`status status-${status.toLowerCase()}`}
        >
          {status.charAt(0).toUpperCase() +
            status.slice(1)}
        </span>
      </div>

      <div>
        <Link
          to={`/tickets/${ticket._id}`}
          className="btn btn-reverse"
        >
          <FaArrowCircleRight />
          View
        </Link>
      </div>

    </div>
  )
}

export default TicketItem