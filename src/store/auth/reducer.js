// reducer.js
const initialState = {
  user: null,
  loading: false,
  error: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case 'AUTH_REQUEST':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return { ...state, loading: false, user: action.payload, error: null };
    case 'AUTH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'AUTH_LOGOUT':
      return { ...state, user: null, loading: false, error: null };
    default:
      return state;
  }
}
