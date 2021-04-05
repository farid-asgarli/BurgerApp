import React from "react";
import styles from "./Order.module.css";

const Order = (props) => {
  const ingredients = [];

  for (let k in props.data.ingredients) {
    ingredients.push({
      name: k,
      amount: props.data.ingredients[k],
    });
  }

  const iteratedIngredietns = ingredients.map((i) => {
    return (
      <p key={i.name + i.amount}>
        {i.name}:{i.amount}
      </p>
    );
  });

  console.log(props.data);
  console.log(ingredients);
  return (
    <div className={styles.Order}>
      <h3>Ingredients :</h3>
      {iteratedIngredietns}
      <h3>Price : {props.data.price}</h3>
      <button
        type="button"
        // btnType="Danger"
        onClick={() => props.deleteHandler(props.data.id)}
      >
        Delete
      </button>
    </div>
  );
};

export default Order;
