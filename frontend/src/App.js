import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NewTicket from './pages/NewTicket';
import Tickets from './pages/Tickets';
import Ticket from './pages/Ticket';

function App() {
  return (
    <Router>
      <Header />

      <main className="container">
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/new-ticket" element={<NewTicket />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/tickets/:ticketId" element={<Ticket />} />
          </Route>

        </Routes>
      </main>

      <ToastContainer />
    </Router>
  );
}

export default App;