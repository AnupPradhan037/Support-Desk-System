import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import {
  getTicket,
  closeTicket,
  reopenTicket,
  assignTicket,
  unassignTicket,
  resetTicket,
} from '../features/tickets/ticketSlice'
import {
  getNotes,
  createNote,
  reset as resetNotes,
} from '../features/notes/noteSlice'
import BackButton from '../components/BackButton'
import Spinner from '../components/Spinner'
import NoteItem from '../components/NoteItem'

function Ticket() {
  const { ticketId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.auth)
  const { ticket, isLoading, isError, message } = useSelector(
    (state) => state.tickets
  )
  const { notes } = useSelector((state) => state.notes)

  const [noteText, setNoteText] = useState('')

  useEffect(() => {
    dispatch(getTicket(ticketId))
    dispatch(getNotes(ticketId))

    return () => {
      dispatch(resetTicket())
      dispatch(resetNotes())
    }
  }, [ticketId, dispatch])

  useEffect(() => {
    if (isError && !ticket) {
      toast.error(message)
      navigate('/tickets')
    }
  }, [isError, message, ticket, navigate])

  const run = async (action, successMessage) => {
    try {
      await dispatch(action).unwrap()
      if (successMessage) toast.success(successMessage)
      return true
    } catch (error) {
      toast.error(error)
      return false
    }
  }

  const onTicketClose = async () => {
    if (!window.confirm('Close this ticket?')) return
    const ok = await run(closeTicket(ticketId), 'Ticket closed')
    if (ok) navigate('/tickets')
  }

  const onTicketReopen = () => run(reopenTicket(ticketId), 'Ticket reopened')
  const onAssign = () => run(assignTicket(ticketId), 'Ticket assigned to you')
  const onUnassign = () => run(unassignTicket(ticketId), 'Ticket unassigned')

  const onNoteSubmit = async (e) => {
    e.preventDefault()
    const ok = await run(createNote({ ticketId, text: noteText }))
    if (ok) setNoteText('')
  }

  if (isLoading || !ticket) return <Spinner />

  const isClosed = ticket.status === 'closed'
  const priority = ticket.priority || 'medium'
  const assignedToMe = ticket.assignedTo?._id === user._id

  return (
    <div className="ticket-page">
      <header className="ticket-header">
        <BackButton url="/tickets" />

        <h2>
          Ticket ID: {ticket._id}
          <span className={`status status-${ticket.status}`}>{ticket.status}</span>
          <span className={`priority priority-${priority}`}>{priority}</span>
        </h2>

        <h3>Date Submitted: {new Date(ticket.createdAt).toLocaleString()}</h3>
        <h3>Product: {ticket.product}</h3>
        <h3>Category: {ticket.category || 'Other'}</h3>
        <h3>Handled by: {ticket.assignedTo?.name || 'Not assigned yet'}</h3>

        {user.isStaff && (
          <div className="staff-panel">
            <div>
              <strong>Customer:</strong> {ticket.user?.name} ({ticket.user?.email})
            </div>

            {!isClosed && (
              <div className="staff-actions">
                {!assignedToMe && (
                  <button className="btn btn-sm" onClick={onAssign}>
                    {ticket.assignedTo ? 'Take over' : 'Assign to me'}
                  </button>
                )}
                {ticket.assignedTo && (
                  <button className="btn btn-reverse btn-sm" onClick={onUnassign}>
                    Unassign
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        <hr />

        <div className="ticket-desc">
          <h3>Description of Issue</h3>
          <p>{ticket.description}</p>
        </div>

        <h2>Notes</h2>
      </header>

      {!isClosed && (
        <form onSubmit={onNoteSubmit} className="form">
          <div className="form-group">
            <textarea
              className="form-control"
              placeholder="Add a note"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-block">Add Note</button>
        </form>
      )}

      {notes.length === 0 ? (
        <p className="muted">No notes yet.</p>
      ) : (
        notes.map((note) => <NoteItem key={note._id} note={note} />)
      )}

      {isClosed ? (
        <button onClick={onTicketReopen} className="btn btn-block">
          Reopen Ticket
        </button>
      ) : (
        <button onClick={onTicketClose} className="btn btn-block btn-danger">
          Close Ticket
        </button>
      )}
    </div>
  )
}

export default Ticket