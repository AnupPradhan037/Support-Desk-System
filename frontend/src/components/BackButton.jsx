import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      className="btn btn-reverse btn-sm"
      onClick={() => navigate(-1)}
    >
      <FaArrowLeft /> Back
    </button>
  );
}

export default BackButton;