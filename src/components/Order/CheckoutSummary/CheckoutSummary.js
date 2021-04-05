import React from "react";
import { Link } from "react-router-dom";
import Burger from "../../Burger/Burger";
import Button from "../../UI/Button/Button";
import styles from "./CheckoutSummary.module.css";

const CheckoutSummary = (props) => {
  let element = (
    <h1 style={{ textAlign: "center" }}>
      Please add some ingredients in{" "}
      <Link to="/burger-builder">BurgerBuilder</Link> first
    </h1>
  );

  if (Object.keys(props.ingredients).length) {
    element = (
      <div className={styles.CheckoutSummary}>
        <h1>We hope it tastes well!</h1>

        <div style={{ width: "100%", margin: "auto" }}>
          <Burger ingredients={props.ingredients} />
        </div>

        <Button btnType="Danger" clicked={props.checkOutCancel}>
          Cancel
        </Button>
        <Button btnType="Success" clicked={props.checkOutContinue}>
          Continue
        </Button>
      </div>
    );
  }
  return element;
};

export default CheckoutSummary;
