import * as actionTypes from "../actions/actionTypes";

const initialState = {
  token: null,
  userId: null,
  loading: false,
  error: null,
  redirectPath: "/",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return {
        ...state,
        error: null,
        loading: true,
      };
    case actionTypes.AUTH_SUCCESS:
      console.log(action.authData);
      return {
        ...state,
        userId: action.authData.localId,
        token: action.authData.idToken,
        loading: false,
        error: null,
      };
    case actionTypes.AUTH_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error.data.error.message,
      };

    case actionTypes.AUTH_LOGOUT:
      return {
        ...state,
        token: null,
        userId: null,
        error: null,
        redirectPath: "/",
      };
    case actionTypes.REDIRECT_TO:
      return {
        ...state,
        redirectPath: action.path,
      };
    default:
      return state;
  }
};

export default reducer;
