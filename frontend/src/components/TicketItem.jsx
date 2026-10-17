import { Link } from 'react-router-dom'
import { FaArrowCircleRight } from 'react-icons/fa'

function TicketItem({ ticket }) {
  if (!ticket || !ticket._id) return null

  const date = ticket.createdAt
    ? new Date(ticket.createdAt).toLocaleDateString()
    : 'N/A'

  const status = ticket.status || 'new'
  const priority = ticket.priority || 'medium'

  return (
    <div className="ticket">
      <div>{date}</div>

      <div>
        <div>{ticket.product || 'Unknown'}</div>
        <small className="muted">
          {ticket.category || 'Other'}
          {ticket.user?.name ? ` · ${ticket.user.name}` : ''}
        </small>
        {ticket.assignedTo?.name && (
          <small className="assignee">Assigned: {ticket.assignedTo.name}</small>
        )}
      </div>

      <div>
        <span className={`priority priority-${priority}`}>{priority}</span>
      </div>

      <div>
        <span className={`status status-${status}`}>{status}</span>
      </div>

      <div>
        <Link to={`/tickets/${ticket._id}`} className="btn btn-reverse">
          <FaArrowCircleRight /> View
        </Link>
      </div>
    </div>
  )
}

export default TicketItem