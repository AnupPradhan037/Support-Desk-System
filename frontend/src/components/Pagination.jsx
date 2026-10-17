function Pagination({ page, pages, total, onChange }) {
  if (pages <= 1) {
    return total > 0 ? <p className="muted pagination-info">{total} ticket{total === 1 ? '' : 's'}</p> : null
  }

  return (
    <div className="pagination">
      <button
        type="button"
        className="btn btn-reverse btn-sm"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
      >
        Previous
      </button>

      <span className="muted">
        Page {page} of {pages} ({total} tickets)
      </span>

      <button
        type="button"
        className="btn btn-reverse btn-sm"
        onClick={() => onChange(page + 1)}
        disabled={page >= pages}
      >
        Next
      </button>
    </div>
  )
}

export default Pagination