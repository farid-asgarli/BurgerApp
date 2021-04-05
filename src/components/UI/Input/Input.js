import React from "react";
import styles from "./Input.module.css";

const Input = (props) => {
  let inputElement = null;

  let inputClasses = [];

  if (!props.isValid && props.interactedByUser) {
    inputClasses.push(styles.Invalid);
  }

  switch (props.elementType) {
    case "input":
      inputElement = (
        <input
          className={inputClasses.join(" ")}
          {...props.elementConfig}
          defaultValue={props.value}
          onChange={props.changed}
          // autoComplete="none"
        />
      );
      break;
    case "textarea":
      inputElement = (
        <textarea
          className={inputClasses.join(" ")}
          {...props.elementConfig}
          defaultValue={props.value}
          onChange={props.changed}
        />
      );
      break;
    case "select":
      inputElement = (
        <select className={inputClasses.join(" ")} onChange={props.changed}>
          {props.elementConfig.options.map((option) => {
            return (
              <option key={option.value} value={option.value}>
                {option.displayValue}
              </option>
            );
          })}
        </select>
      );
      break;
    default:
      inputElement = (
        <input
          className={inputClasses.join(" ")}
          onChange={props.changed}
          {...props.elementConfig}
          defaultValue={props.value}
          // autoComplete="off"
        />
      );
      break;
  }

  return <div className={styles.Input}>{inputElement}</div>;
};

export default Input;
