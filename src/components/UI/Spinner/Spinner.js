import React from "react";
import classes from "./Spinner.module.css";

const spinner = () => {
  return (
    <div className={classes.Spinner}>
      <div className={classes.doubleBounce1}></div>
      <div className={classes.doubleBounce2}></div>
    </div>
  );
};

export default spinner;
