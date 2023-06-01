import { SIGN_UP_USER, LOGIN_USER, LOGOUT_USER } from "../constants";

export const signUp = (user) => {
  return {
    type: SIGN_UP_USER,
    payload: user
  }
}

export const login = (userLoginData) => {
  return {
    type: LOGIN_USER,
    payload: userLoginData
  }
}

export const logout = () => {
  return {
    type: LOGOUT_USER
  }
}