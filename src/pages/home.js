import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'fusion-plugin-react-router';

import { listNotes, updateNote, deleteNote, createNote } from '../store/notes/actions';
import { getUser, logout } from '../store/auth/actions';
import NoteModal from '../components/noteModal';

// Add hover styles
const hoverStyles = `
  .note-card:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 16px rgba(0,0,0,0.12);
  }
  
  .add-btn:hover {
    transform: scale(1.08);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
  
  .delete-btn:hover {
    transform: scale(1.12);
    box-shadow: 0 2px 6px rgba(216, 63, 49, 0.5);
  }
  
  .logout-btn:hover {
    transform: scale(1.08);
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  }
  
  .modal-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
`;

export default function Home() {
  const dispatch = useDispatch();
  const history = useHistory();

  const { user, loading: authLoading } = useSelector((state) => state.auth || {});
  const { list: notes, loading, error } = useSelector((state) => state.notes || {});

  const [activeNote, setActiveNote] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // --- Rehydrate user and fetch notes on mount ---
  // Rehydrate user on mount
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  // Fetch notes only after user is available
  useEffect(() => {
    if (user) dispatch(listNotes());
  }, [user, dispatch]);

  // If rehydration finished and there's no user, redirect to login
  useEffect(() => {
    if (!user && authLoading === false) {
      history.replace('/login');
    }
  }, [user, authLoading, history]);

  const handleUpdate = async (note) => {
    await dispatch(updateNote(note));
    setActiveNote(null); // Close modal after update
  };
  const handleDelete = (id) => dispatch(deleteNote(id));
  const handleCreate = (note) => dispatch(createNote(note));

  const handleLogout = async() => {
    await dispatch(logout());
    history.push('/login');
  };

  return (
    <div style={styles.container}>
      <style>{hoverStyles}</style>
      {/* Navbar */}
      <div style={styles.nav}>
        <span style={styles.navText}>{user?.name}</span>
        <button className="logout-btn" style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      {/* Loading/Error */}
      {loading && <div style={{ padding: 20 }}>Loading notes…</div>}
      {error && <div style={{ color: 'red', padding: 20 }}>{error}</div>}

      {/* Notes Grid */}
      <div style={styles.grid}>
        {notes?.length > 0 &&
          notes.map((note) => (
            <div
              key={note.id}
              className="note-card"
              style={styles.card}
              onClick={() => setActiveNote(note)}
            >
              <h4 style={styles.cardTitle}>{note.title}</h4>
              <p style={styles.cardContent}>{note.description}</p>
              <button
                className="delete-btn"
                style={styles.deleteBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(note.id);
                }}
              >
                Delete
              </button>
            </div>
          ))}
      </div>

      {/* Add Note Button */}
      <button className="add-btn" style={styles.addBtn} onClick={() => setIsCreating(true)}>
        + Add Note
      </button>

      {/* Note Modal for Edit */}
      {activeNote && (
        <NoteModal
          note={activeNote}
          onClose={() => setActiveNote(null)}
          onSave={handleUpdate}
        />
      )}

      {/* Note Modal for Create */}
      {isCreating && (
        <NoteModal
          onClose={() => setIsCreating(false)}
          onSave={(note) => {
            handleCreate(note);
            setIsCreating(false);
          }}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#fef6e4',
    paddingBottom: 80,
  },
  nav: {
    height: 64,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 24px',
    backgroundColor: '#fabd2f',
    boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
  },
  navText: {
    fontSize: 16,
    fontWeight: 600,
    color: '#5a4a42',
  },
  logoutBtn: {
    padding: '8px 16px',
    fontSize: 14,
    backgroundColor: '#fabd2f',
    color: '#5a4a42',
    border: '1px solid #d83f31',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
  grid: {
    padding: 24,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 16,
    maxWidth: '1200px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: '#fffbea',
    border: '1px solid #f0e5a9',
    borderRadius: 8,
    padding: 16,
    height: 200,
    cursor: 'pointer',
    position: 'relative',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#3e3b39',
    marginBottom: 8,
    margin: 0,
  },
  cardContent: {
    fontSize: 14,
    color: '#5a4a42',
    overflow: 'hidden',
    wordBreak: 'break-word',
    lineHeight: '1.4',
    margin: 0,
    display: '-webkit-box',
    WebkitLineClamp: 6,
    WebkitBoxOrient: 'vertical',
  },
  deleteBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    padding: '6px 12px',
    fontSize: 12,
    backgroundColor: '#fabd2f',
    color: '#d83f31',
    border: '1px solid #d83f31',
    borderRadius: 4,
    cursor: 'pointer',
    fontWeight: 700,
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    boxShadow: '0 1px 3px rgba(216, 63, 49, 0.3)',
  },
  addBtn: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    padding: '16px 24px',
    fontSize: 18,
    backgroundColor: '#fabd2f',
    color: '#5a4a42',
    border: '1px solid #d83f31',
    borderRadius: 50,
    cursor: 'pointer',
    fontWeight: 600,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};
