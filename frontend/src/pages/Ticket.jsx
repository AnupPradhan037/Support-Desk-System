import { useEffect, useState } from 'react'
import {
  useParams,
  useNavigate,
} from 'react-router-dom'

import {
  useDispatch,
  useSelector,
} from 'react-redux'

import { FaTicketAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'
import Modal from 'react-modal'

import Spinner from '../components/Spinner'
import BackButton from '../components/BackButton'
import NoteItem from '../components/NoteItem'

import {
  getTicket,
  closeTicket,
  reset,
} from '../features/tickets/ticketSlice'

import {
  getNotes,
  createNote,
  reset as notesReset,
} from '../features/notes/noteSlice'

Modal.setAppElement('#root')

function Ticket() {
  const { ticketId } = useParams()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [modalOpen, setModalOpen] =
    useState(false)

  const [noteText, setNoteText] =
    useState('')

  // ==========================================
  // DEBUG
  // ==========================================

  console.log(
    'URL ticket ID:',
    ticketId
  )

  // ==========================================
  // REDUX
  // ==========================================

  const {
    ticket,
    isLoading,
    isError,
    message,
  } = useSelector(
    (state) => state.tickets
  )

  const {
    notes = [],
    isLoading: notesIsLoading,
    isError: notesIsError,
    message: notesMessage,
  } = useSelector(
    (state) => state.note
  )

  // ==========================================
  // USER
  // ==========================================

  const user = useSelector(
    (state) => state.auth.user
  )

  const isStaff =
    user?.isStaff === true

  // ==========================================
  // GET TICKET
  // ==========================================

  useEffect(() => {
    if (!ticketId) {
      return
    }

    console.log(
      'Dispatching getTicket:',
      ticketId
    )

    dispatch(
      getTicket(ticketId)
    )

    dispatch(
      getNotes(ticketId)
    )

    return () => {
      dispatch(reset())
      dispatch(notesReset())
    }
  }, [dispatch, ticketId])

  // ==========================================
  // ERRORS
  // ==========================================

  useEffect(() => {
    if (isError && message) {
      toast.error(message)
    }

    if (
      notesIsError &&
      notesMessage
    ) {
      toast.error(notesMessage)
    }
  }, [
    isError,
    message,
    notesIsError,
    notesMessage,
  ])

  // ==========================================
  // LOADING
  // ==========================================

  if (
    isLoading ||
    notesIsLoading
  ) {
    return <Spinner />
  }

  // ==========================================
  // NOT FOUND
  // ==========================================

  if (
    !ticket ||
    !ticket._id
  ) {
    return (
      <>
        <BackButton url="/tickets" />

        <section className="heading">
          <h1>
            <FaTicketAlt />
            Ticket Details
          </h1>

          <h3>
            Ticket not found.
          </h3>

          {message && (
            <p>{message}</p>
          )}
        </section>
      </>
    )
  }

  // ==========================================
  // CLOSE TICKET
  // ==========================================

  const onTicketClose =
    async () => {
      const result =
        await dispatch(
          closeTicket(
            ticket._id
          )
        )

      if (
        closeTicket.fulfilled.match(
          result
        )
      ) {
        toast.success(
          'Ticket Closed Successfully'
        )

        navigate('/tickets')
      } else {
        toast.error(
          result.payload ||
            'Unable to close ticket'
        )
      }
    }

  // ==========================================
  // ADD NOTE
  // ==========================================

  const onNoteSubmit =
    async (e) => {
      e.preventDefault()

      if (
        !noteText.trim()
      ) {
        toast.error(
          'Please enter a note'
        )

        return
      }

      const result =
        await dispatch(
          createNote({
            ticketId,
            text: noteText.trim(),
          })
        )

      if (
        createNote.fulfilled.match(
          result
        )
      ) {
        toast.success(
          'Note Added Successfully'
        )

        setNoteText('')
        setModalOpen(false)

        dispatch(
          getNotes(ticketId)
        )
      } else {
        toast.error(
          result.payload ||
            'Unable to add note'
        )
      }
    }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <>
      <BackButton url="/tickets" />

      <section className="heading">
        <h1>
          <FaTicketAlt /> Ticket Details
        </h1>

        <p>
          Ticket ID: {ticket._id}
        </p>
      </section>

      <div className="ticket-page">

        <div className="ticket-header">
          <h2>
            {ticket.product}
          </h2>

          <span
            className={`status status-${(
              ticket.status || ''
            ).toLowerCase()}`}
          >
            {ticket.status}
          </span>
        </div>

        <div className="ticket-info">

          <p>
            <strong>
              Created:
            </strong>{' '}

            {ticket.createdAt
              ? new Date(
                  ticket.createdAt
                ).toLocaleString()
              : 'Unknown'}
          </p>

          <hr />

          <h3>
            Description
          </h3>

          <div className="ticket-description">
            {ticket.description}
          </div>

          <hr />

          <h2>
            Notes
          </h2>

          {notes.length > 0 ? (
            notes.map(
              (note) => (
                <NoteItem
                  key={note._id}
                  note={note}
                />
              )
            )
          ) : (
            <p>
              No notes available.
            </p>
          )}

        </div>

        {isStaff &&
          ticket.status !==
            'closed' && (
            <button
              className="btn btn-block"
              onClick={() =>
                setModalOpen(true)
              }
            >
              Add Note
            </button>
          )}

        {ticket.status !==
          'closed' && (
          <button
            onClick={
              onTicketClose
            }
            className="btn btn-block btn-danger"
          >
            Close Ticket
          </button>
        )}

      </div>

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => {
          setModalOpen(false)
          setNoteText('')
        }}
        contentLabel="Add Note"
      >
        <h2>
          Add Note
        </h2>

        <form
          onSubmit={
            onNoteSubmit
          }
        >
          <div className="form-group">
            <textarea
              className="form-control"
              rows="6"
              placeholder="Write your note..."
              value={noteText}
              onChange={(e) =>
                setNoteText(
                  e.target.value
                )
              }
            />
          </div>

          <button
            type="submit"
            className="btn btn-block"
          >
            Submit Note
          </button>

          <br />

          <button
            type="button"
            className="btn btn-reverse btn-block"
            onClick={() => {
              setNoteText('')
              setModalOpen(false)
            }}
          >
            Cancel
          </button>
        </form>
      </Modal>
    </>
  )
}

export default Ticket