import { connect } from "react-redux";
import { ADD_INGREDIENT } from "../store/actions/actionTypes";

import React from 'react'

function test() {
  
    
    return(
        <h1>{this.props.onPersonAdded()}</h1>
    );
    
   
}

const mapDispatchToProps  = (dispatch)=>{
    return {
        onPersonAdded:(name,age)=> dispatch({
            type:"PersonAdd",
            person:{
                name:name,
                age:age
            }
        })
    }
}

const mapStateToProps = (state)=>{
  return {
    prs:state.persons
  } 
};
export default connect(mapDispatchToProps)(test);