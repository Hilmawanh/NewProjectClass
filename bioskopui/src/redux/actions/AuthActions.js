export const LoginSuccessAction=(datauser)=>{
    return {
        type:'LOGIN_SUCCESS',
        payload:datauser
    }
}

export const LogoutSuccessAction=(datauser)=>{
    return{
        type:'LOGOUT_SUCCESS',
        payload:datauser
    }
}


export const ResetpassAction = newpass => {
    return {
      type: "RESET_PASS",
      payload: newpass
    };
  };