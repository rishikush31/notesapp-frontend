// actions.js
import { apiFetch } from '../../utils/apiFetch';

export const listNotes = () => async (dispatch) => {
  dispatch({ type: 'NOTES_REQUEST' });
  try {
    const notes = await apiFetch('/api/notes');
    dispatch({ type: 'NOTES_SUCCESS', payload: notes });
  } catch (err) {
    dispatch({ type: 'NOTES_FAILURE', payload: err.message });
  }
};

export const createNote = (note) => async (dispatch) => {
  try {
    await apiFetch('/api/notes', {
      method: 'POST',
      body: JSON.stringify(note),
    });
    dispatch(listNotes());
  } catch (err) {
    console.error(err.message);
  }
};

export const updateNote = (note) => async (dispatch) => {
  try {
    await apiFetch(`/api/notes/${note.id}`, {
      method: 'PUT',
      body: JSON.stringify(note),
    });
    dispatch(listNotes());
  } catch (err) {
    console.error(err.message);
  }
};

export const deleteNote = (id) => async (dispatch) => {
  try {
    await apiFetch(`/api/notes/${id}`, { method: 'DELETE' });
    dispatch(listNotes());
  } catch (err) {
    console.error(err.message);
  }
};
