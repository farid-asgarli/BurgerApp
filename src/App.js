import React, { useEffect } from "react";
import Layout from "./hoc/Layout/Layout";
import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";
import Checkout from "./containers/Checkout/Checkout";
import { Redirect, Route, Switch } from "react-router-dom";
import Orders from "./containers/Orders/Orders";
import Auth from "./containers/Auth/Auth";
import Logout from "./containers/Auth/Logout/Logout";
import { connect } from "react-redux";
import { checkAuthStatus } from "./store/actions/auth";

const App = (props) => {
  const {onAuthCheckStatus} = props;
  useEffect(() => {
    console.log('*************************started UseEffect()*****************************')
    onAuthCheckStatus();
  }, [onAuthCheckStatus]);

  let basedOnAuthRoute = (
    <Switch>
      <Route path="/" exact component={BurgerBuilder} />
      <Route path="/burger-builder" exact component={BurgerBuilder} />
      <Route path="/auth" component={Auth} />
      <Redirect to="/" />
    </Switch> // Redirect to="/" here, if someone wants to visit the route that's not available or the route is random, it redirects it back to Home page
  );
  if (props.hasLoggedIn) {
    basedOnAuthRoute = (
      <Switch>
        <Route path="/checkout" component={Checkout} />
        <Route path="/orders" component={Orders} />
        <Route path="/logout" component={Logout} />
        <Route path="/" exact component={BurgerBuilder} />
        <Route path="/burger-builder" exact component={BurgerBuilder} />
        <Route path="/auth" component={Auth} />
        <Redirect to="/" />
      </Switch>
    );
  }
  return (
    <div>
      <Layout>{basedOnAuthRoute}</Layout>
    </div>
  );
};

export default connect(
  (state) => {
    return {
      hasLoggedIn: state.authReducer.token != null,
    };
  },
  (dispatch) => {
    return {
      onAuthCheckStatus: () => dispatch(checkAuthStatus()),
    };
  }
)(App);
