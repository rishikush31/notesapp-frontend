import { clientFetch } from "../../utils/clientFetch";

export const getUser = () => async (dispatch) => {
  dispatch({ type: 'AUTH_REQUEST' });
  console.log("[getUser] Dispatch AUTH_REQUEST");

  try {
    console.log("[getUser] Calling fetch /api/user with credentials include");
    const res = await clientFetch('/api/user', {
      credentials: 'include',
    });

    console.log("[getUser] Response status:", res.status, "ok:", res.ok);

    if (!res.ok) throw new Error('Unauthorized');

    const user = await res.json();
    console.log("[getUser] Fetched user:", user);

    dispatch({ type: 'AUTH_SUCCESS', payload: user });
    console.log("[getUser] Dispatch AUTH_SUCCESS");
  } catch (err) {
    console.error("[getUser] Error:", err.message);
    dispatch({ type: 'AUTH_LOGOUT' });
    console.log("[getUser] Dispatch AUTH_LOGOUT");
  }
};

export const listNotes = () => async (dispatch) => {
  dispatch({ type: 'NOTES_REQUEST' });
  console.log("[listNotes] Dispatch NOTES_REQUEST");

  try {
    console.log("[listNotes] Calling fetch /api/notes with credentials include");
    const res = await clientFetch('/api/notes', { credentials: 'include' });

    console.log("[listNotes] Response status:", res.status, "ok:", res.ok);
    if (!res.ok) throw new Error('Failed to fetch notes');

    const notes = await res.json();
    console.log("[listNotes] Fetched notes:", notes);

    dispatch({ type: 'NOTES_SUCCESS', payload: notes });
    console.log("[listNotes] Dispatch NOTES_SUCCESS");
  } catch (err) {
    console.error("[listNotes] Error:", err.message);
    dispatch({ type: 'NOTES_FAILURE', payload: err.message });
    console.log("[listNotes] Dispatch NOTES_FAILURE");
  }
};

export const createNote = (note) => async (dispatch) => {
  console.log("[createNote] Creating note:", note);

  try {
    const res = await clientFetch('/api/notes', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    });

    console.log("[createNote] Response status:", res.status, "ok:", res.ok);
    if (!res.ok) throw new Error('Failed to create note');

    console.log("[createNote] Note created successfully, fetching updated notes");
    dispatch(listNotes());
  } catch (err) {
    console.error("[createNote] Error:", err.message);
  }
};

export const updateNote = (note) => async (dispatch) => {
  console.log("[updateNote] Updating note:", note);

  try {
    const res = await clientFetch(`/api/notes/${note.id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    });

    console.log("[updateNote] Response status:", res.status, "ok:", res.ok);
    if (!res.ok) throw new Error('Failed to update note');

    console.log("[updateNote] Note updated successfully, fetching updated notes");
    dispatch(listNotes());
  } catch (err) {
    console.error("[updateNote] Error:", err.message);
  }
};

export const deleteNote = (id) => async (dispatch) => {
  console.log("[deleteNote] Deleting note id:", id);

  try {
    const res = await clientFetch(`/api/notes/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    console.log("[deleteNote] Response status:", res.status, "ok:", res.ok);
    if (!res.ok) throw new Error('Failed to delete note');

    console.log("[deleteNote] Note deleted successfully, fetching updated notes");
    dispatch(listNotes());
  } catch (err) {
    console.error("[deleteNote] Error:", err.message);
  }
};
