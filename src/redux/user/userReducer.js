import { SIGN_UP_USER, LOGIN_USER, LOGOUT_USER } from "../constants";

const initialState = JSON.parse(localStorage.getItem("userLoginData")) || {
  isLoggedIn: false,
  userInfo: {},
  users: [],
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_UP_USER: {
      const updatedUsers = [...state.users, action.payload];
      localStorage.setItem(
        "userLoginData",
        JSON.stringify({ ...state, users: updatedUsers })
      );
      return {
        ...state,
        users: updatedUsers,
      };
    }

    case LOGIN_USER: {
      const userLoginData = action.payload;
      const userInfo1 =
        state?.users?.filter((user) => user.email === userLoginData.email) ||
        [];

      localStorage.setItem(
        "userLoginData",
        JSON.stringify({ ...state, isLoggedIn: true, userInfo: userInfo1 })
      );
      return {
        ...state,
        isLoggedIn: true,
        userInfo: userInfo1 || {},
      };
    }

    case LOGOUT_USER: {
      localStorage.setItem(
        "userLoginData",
        JSON.stringify({ ...state, isLoggedIn: false, userInfo: {} })
      );
      return {
        ...state,
        isLoggedIn: false,
        userInfo: {},
      };
    }
    default:
      return state;
  }
};

export default userReducer;
