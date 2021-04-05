import axios from "axios";
import * as actionTypes from "./actionTypes";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (authData) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    authData: authData,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error.response,
  };
};

export const auth = (email, password, isSignIn) => {
  return (dispatch) => {
    dispatch(authStart());
    const url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCTZjZNfXFs48vvSkAEPnFfBL3z34qBQiM";
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true,
    };
    axios
      .post(
        isSignIn
          ? url
          : "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCTZjZNfXFs48vvSkAEPnFfBL3z34qBQiM",
        authData
      )
      .then((response) => {
        dispatch(authSuccess(response.data));
        dispatch(resetBuildingStatus());
        dispatch(checkAuthTimeout(response.data.expiresIn));

        localStorage.setItem("token", response.data.idToken);
        localStorage.setItem("userId", response.data.localId);
        localStorage.setItem(
          "expirationDate",
          new Date(new Date().getTime() + response.data.expiresIn * 1000)
        );

        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
        dispatch(authFail(error));
      });
  };
};

export const resetBuildingStatus = () => {
  return {
    type: actionTypes.RESET_BUILDING_STATUS,
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");
  localStorage.removeItem("userId");
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const redirectTo = (path) => {
  return {
    type: actionTypes.REDIRECT_TO,
    path: path,
  };
};

export const checkAuthStatus = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");

    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));

      console.log(expirationDate);

      if (expirationDate < new Date()) {
        console.log(expirationDate < new Date());
        dispatch(logout());
      } else {
        dispatch(
          authSuccess({
            localId: localStorage.getItem("userId"),  //As we did not have complete only 'authData', we can pass something instead as an object, 
                                                      //but with the corresponding properties required in reducer auth.js (for ex.,  userId: action.authData.localId, line 23)
            idToken: localStorage.getItem("token"),
          })
        );
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};
