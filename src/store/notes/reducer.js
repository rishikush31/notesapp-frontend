// reducer.js
const initialState = { list: [], loading: false, error: null };

export default function notesReducer(state = initialState, action) {
  switch (action.type) {
    case 'NOTES_REQUEST':
      return { ...state, loading: true, error: null };
    case 'NOTES_SUCCESS':
      return { ...state, loading: false, list: action.payload };
    case 'NOTES_FAILURE':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
