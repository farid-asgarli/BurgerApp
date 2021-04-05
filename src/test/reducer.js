const initialState={
    name:undefined,
    age:null,
    persons:[]
}

const reducer = (state=initialState,action)=>{
    switch (action.type) {
        case "PersonAdded":
            state.persons.push(action.person);
            break;
    
        default:
            break;
    }
}

export default reducer;