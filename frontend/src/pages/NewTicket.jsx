
import { useState, useEffect } from 'react';
import { FaTicketAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Spinner from '../components/Spinner';
import BackButton from '../components/BackButton';
import { createTicket, reset } from '../features/tickets/ticketSlice';

function NewTicket() {
  const { user } = useSelector((state) => state.auth);

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.tickets
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState('iPhone');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      dispatch(reset());
      navigate('/tickets');
    }

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isError, isSuccess, message, navigate]);

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(
      createTicket({
        product,
        description,
      })
    );
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <BackButton />

      <section className="heading">
        <h1>
          <FaTicketAlt /> Create New Ticket
        </h1>

        <p>Please fill out the form below.</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="name">Customer Name</label>

            <input
              type="text"
              id="name"
              className="form-control"
              value={user?.name || ''}
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Customer Email</label>

            <input
              type="email"
              id="email"
              className="form-control"
              value={user?.email || ''}
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="product">Product</label>

            <select
              id="product"
              className="form-control"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            >
              <option value="iPhone">iPhone</option>
              <option value="MacBook Pro">MacBook Pro</option>
              <option value="iMac">iMac</option>
              <option value="iPad">iPad</option>
              <option value="Dell">Dell</option>
              <option value="HP">HP</option>
              <option value="Asus">Asus</option>
              <option value="MSI">MSI</option>
              <option value="Android">Android</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description of the Issue</label>

            <textarea
              id="description"
              className="form-control"
              rows="5"
              placeholder="Describe your issue"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <button className="btn btn-block" type="submit">
              Submit
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default NewTicket;