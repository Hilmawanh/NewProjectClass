const Initial_State=0

export default (state=Initial_State,action)=>{
    switch (action.type) {
        case 'NOTIFICATION_APPEAR':
            return action.payload
        default:
            return state
    }
}