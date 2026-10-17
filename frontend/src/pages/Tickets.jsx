import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { FaSearch } from 'react-icons/fa'
import { getTickets, reset } from '../features/tickets/ticketSlice'
import { PRIORITIES, STATUS_TABS, ASSIGN_FILTERS } from '../constants'
import Spinner from '../components/Spinner'
import BackButton from '../components/BackButton'
import TicketItem from '../components/TicketItem'
import Pagination from '../components/Pagination'

const PAGE_SIZE = 10

function Tickets() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { tickets, pagination, isLoading, isError, message } = useSelector(
    (state) => state.tickets
  )

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('')
  const [assigned, setAssigned] = useState('')
  const [page, setPage] = useState(1)

  // Wait 300ms after typing stops, and go back to page 1
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim())
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    dispatch(
      getTickets({
        page,
        limit: PAGE_SIZE,
        status,
        priority,
        assigned,
        search: debouncedSearch,
      })
    )
  }, [dispatch, page, status, priority, assigned, debouncedSearch])

  useEffect(() => {
    return () => {
      dispatch(reset())
    }
  }, [dispatch])

  useEffect(() => {
    if (isError) toast.error(message)
  }, [isError, message])

  const hasFilters = Boolean(status || priority || assigned || debouncedSearch)

  const clearFilters = () => {
    setSearch('')
    setDebouncedSearch('')
    setStatus('')
    setPriority('')
    setAssigned('')
    setPage(1)
  }

  return (
    <>
      <BackButton url="/" />
      <h1>{user?.isStaff ? 'All Tickets' : 'My Tickets'}</h1>

      <div className="filters">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            className="form-control"
            placeholder="Search by description, product or category"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="form-control filter-select"
          value={priority}
          onChange={(e) => {
            setPriority(e.target.value)
            setPage(1)
          }}
          aria-label="Filter by priority"
        >
          <option value="">All priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </option>
          ))}
        </select>

        {user?.isStaff && (
          <select
            className="form-control filter-select"
            value={assigned}
            onChange={(e) => {
              setAssigned(e.target.value)
              setPage(1)
            }}
            aria-label="Filter by assignment"
          >
            {ASSIGN_FILTERS.map((f) => (
              <option key={f.label} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="tabs">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.label}
            type="button"
            className={`tab ${status === tab.value ? 'tab-active' : ''}`}
            onClick={() => {
              setStatus(tab.value)
              setPage(1)
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tickets">
        <div className="ticket-headings">
          <div>Date</div>
          <div>Product</div>
          <div>Priority</div>
          <div>Status</div>
          <div></div>
        </div>

        {isLoading ? (
          <Spinner />
        ) : tickets.length === 0 ? (
          <div className="empty">
            <p>{hasFilters ? 'No tickets match your filters.' : 'No tickets yet.'}</p>
            {hasFilters && (
              <button className="btn btn-reverse btn-sm" onClick={clearFilters}>
                Clear filters
              </button>
            )}
          </div>
        ) : (
          tickets.map((ticket) => <TicketItem key={ticket._id} ticket={ticket} />)
        )}
      </div>

      {!isLoading && (
        <Pagination
          page={pagination.page}
          pages={pagination.pages}
          total={pagination.total}
          onChange={setPage}
        />
      )}
    </>
  )
}

export default Tickets