import { useEffect } from 'react'

import {
  useDispatch,
  useSelector,
} from 'react-redux'

import { FaTicketAlt } from 'react-icons/fa'

import { toast } from 'react-toastify'

import Spinner from '../components/Spinner'
import BackButton from '../components/BackButton'
import TicketItem from '../components/TicketItem'

import {
  getTickets,
  reset,
} from '../features/tickets/ticketSlice'

function Tickets() {
  const dispatch =
    useDispatch()

  const {
    tickets = [],
    isLoading = false,
    isError = false,
    message = '',
  } =
    useSelector(
      (state) =>
        state.tickets || {}
    )

  useEffect(() => {
    dispatch(getTickets())

    return () => {
      dispatch(reset())
    }
  }, [dispatch])

  useEffect(() => {
    if (
      isError &&
      message
    ) {
      toast.error(message)
    }
  }, [
    isError,
    message,
  ])

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <BackButton url="/" />

      <section className="heading">
        <h1>
          <FaTicketAlt /> My Tickets
        </h1>

        <p>
          View your support tickets
        </p>
      </section>

      {tickets.length === 0 ? (
        <h3>
          You have not created
          any tickets.
        </h3>
      ) : (
        <>
          <div className="ticket-headings">
            <div>Date</div>
            <div>Product</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {tickets.map(
            (ticket) => {
              if (
                !ticket ||
                !ticket._id
              ) {
                return null
              }

              return (
                <TicketItem
                  key={
                    ticket._id
                  }
                  ticket={
                    ticket
                  }
                />
              )
            }
          )}
        </>
      )}
    </>
  )
}

export default Tickets