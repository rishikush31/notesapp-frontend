import React, { useState, useEffect } from 'react';

// Add hover styles for modal buttons
const hoverStyles = `
  .modal-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
`;

export default function NoteModal({ note = null, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [changed, setChanged] = useState(false);

  // Initialize or reset state when note changes
  useEffect(() => {
    setTitle(note?.title || '');
    setDescription(note?.description || '');
    setChanged(false);
  }, [note]);

  // Detect changes to enable Save button
  useEffect(() => {
    if (!note) {
      setChanged(title !== '' || description !== '');
    } else {
      setChanged(title !== note.title || description !== note.description);
    }
  }, [title, description, note]);

  const handleSave = () => {
    if (!changed) return;
    const payload = note ? { ...note, title, description } : { title, description };
    onSave(payload);
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <style>{hoverStyles}</style>
      <div
        style={styles.modal}
        onClick={(e) => e.stopPropagation()} // Prevent overlay click closing
      >
        <h3 style={styles.title}>{note ? 'Edit Note' : 'New Note'}</h3>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          style={styles.textarea}
        />
        <div style={styles.buttons}>
          <button className="modal-btn" onClick={onClose} style={styles.cancelBtn}>
            Cancel
          </button>
          <button
            className="modal-btn"
            onClick={handleSave}
            disabled={!changed}
            style={{
              ...styles.saveBtn,
              opacity: changed ? 1 : 0.5,
              cursor: changed ? 'pointer' : 'not-allowed',
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modal: {
    backgroundColor: '#fffbea',
    padding: 24,
    borderRadius: 8,
    width: '90%',
    maxWidth: 500,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    border: '1px solid #f0e5a9',
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
    color: '#3e3b39',
    margin: 0,
  },
  input: {
    padding: 12,
    fontSize: 14,
    borderRadius: 6,
    border: '1px solid #e8ddb5',
    backgroundColor: '#fff',
    color: '#3e3b39',
    fontFamily: 'inherit',
  },
  textarea: {
    padding: 12,
    fontSize: 14,
    borderRadius: 6,
    border: '1px solid #e8ddb5',
    backgroundColor: '#fff',
    color: '#3e3b39',
    fontFamily: 'inherit',
    minHeight: 200,
    resize: 'vertical',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    overflow: 'auto',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    padding: '10px 18px',
    borderRadius: 6,
    border: '1px solid #e8ddb5',
    backgroundColor: '#fff',
    color: '#5a4a42',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: 14,
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  saveBtn: {
    padding: '10px 18px',
    borderRadius: 6,
    border: 'none',
    backgroundColor: '#fabd2f',
    color: '#5a4a42',
    fontWeight: 500,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};
