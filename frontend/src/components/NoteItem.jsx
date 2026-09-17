import React from 'react'

function NoteItem({ note }) {
  const isStaff = note.user?.isStaff

  return (
    <div
      className={`note ${
        isStaff ? 'note-staff' : 'note-user'
      }`}
    >
      <div className="note-head">
        <div>
          <strong>
            {note.user?.name || 'User'}
          </strong>

          <span className="note-role">
            {isStaff
              ? 'Support Staff'
              : 'Customer'}
          </span>
        </div>

        <span>
          {new Date(
            note.createdAt
          ).toLocaleString()}
        </span>
      </div>

      <div className="note-body">
        {note.text}
      </div>
    </div>
  )
}

export default NoteItem