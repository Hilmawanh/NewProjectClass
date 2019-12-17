const Initial_State = {
    id: "0",
    username: "",
    password: "",
    role: "",
    login: false,
    jmlcart: "0"
  };
  
  export default (state = Initial_State, action) => {
    switch (action.type) {
      case "LOGIN_SUCCESS":
        return { ...state, ...action.payload, login: true };
      case "LOGOUT_SUCCESS":
        return { Initial_State };
      case "NOTIFICATION_APPEAR":
        return { ...state, jmlcart: action.payload };
      case "RESET_PASS":
        return { ...state, ...action.payload };
      default:
        return state;
    }
  };
  