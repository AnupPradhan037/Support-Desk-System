import { ClipLoader } from 'react-spinners'

function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      <ClipLoader size={80} />
    </div>
  )
}

export default Spinner