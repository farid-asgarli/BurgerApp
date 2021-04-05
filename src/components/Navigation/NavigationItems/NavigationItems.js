import React from "react";

import classes from "./NavigationItems.module.css";
import NavigationItem from "./NavigationItem/NavigationItem";
import { connect } from "react-redux";

const navigationItems = (props) => {
  let linkBasedOnAuth = (
    <NavigationItem link="/auth">Authenticate</NavigationItem>
  );

  if (props.hasLoggedIn) {
    linkBasedOnAuth = (
      <React.Fragment>
        <NavigationItem link="/logout">Logout</NavigationItem>
        <NavigationItem link="/checkout">Checkout</NavigationItem>
        <NavigationItem link="/orders">Orders</NavigationItem>
      </React.Fragment>
    );
  }

  return (
    <ul className={classes.NavigationItems}>
      {linkBasedOnAuth}
      <NavigationItem link="/burger-builder">Burger Builder</NavigationItem>
    </ul>
  );
};

export default connect((state) => {
  return {
    hasLoggedIn: state.authReducer.token != null,
  };
})(navigationItems);
