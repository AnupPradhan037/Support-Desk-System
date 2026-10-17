import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { createTicket } from '../features/tickets/ticketSlice'
import { PRODUCTS, CATEGORIES, PRIORITIES } from '../constants'
import BackButton from '../components/BackButton'
import Spinner from '../components/Spinner'

function NewTicket() {
  const { user } = useSelector((state) => state.auth)
  const { isLoading } = useSelector((state) => state.tickets)

  const [product, setProduct] = useState(PRODUCTS[0])
  const [category, setCategory] = useState('Other')
  const [priority, setPriority] = useState('medium')
  const [description, setDescription] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      await dispatch(
        createTicket({ product, category, priority, description })
      ).unwrap()
      toast.success('New ticket created!')
      navigate('/tickets')
    } catch (error) {
      toast.error(error)
    }
  }

  if (isLoading) return <Spinner />

  return (
    <>
      <BackButton url="/" />

      <section className="heading">
        <h1>Create New Ticket</h1>
        <p>Please fill out the form below</p>
      </section>

      <section className="form">
        <div className="form-group">
          <label>Customer Name</label>
          <input type="text" className="form-control" value={user.name} disabled />
        </div>
        <div className="form-group">
          <label>Customer Email</label>
          <input type="text" className="form-control" value={user.email} disabled />
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="product">Product</label>
            <select
              id="product"
              className="form-control"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            >
              {PRODUCTS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              className="form-control"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description of the issue</label>
            <textarea
              id="description"
              className="form-control"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              required
            />
            <small className="muted">{description.length}/1000</small>
          </div>

          <button className="btn btn-block">Submit</button>
        </form>
      </section>
    </>
  )
}

export default NewTicket