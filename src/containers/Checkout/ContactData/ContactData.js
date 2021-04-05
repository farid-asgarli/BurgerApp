import React, { Component } from "react";
import axiosOrders from "../../../axios-orders";
import Button from "../../../components/UI/Button/Button";
import styles from "./ContactData.module.css";
import { Redirect, withRouter } from "react-router-dom";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import withErrorHandler from "../../../hoc/withErrorHandler/WithErrorHandler";
import { connect } from "react-redux";
import { purchaseBurger } from "../../../store/actions/order";

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your name",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        interactedByUser: false,
      },
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Email",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        interactedByUser: false,
      },
      street: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Street",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        interactedByUser: false,
      },
      postalCode: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Postal Code",
        },
        value: "",
        validation: {
          required: false,
          minLength: 6,
          maxLength: 6,
        },
        valid: false,
        interactedByUser: false,
      },

      deliveryMethod: {
        elementType: "select",
        elementConfig: {
          options: [
            {
              value: "fastest",
              displayValue: "Fastest",
            },
            {
              value: "cheapest",
              displayValue: "Cheapest",
            },
          ],
        },
        value: "fastest",
        validation: {
          required: false,
        },
        valid: true,
      },
    },
    // spinnerLoading: false,
    formIsValid: false,
  };

  componentDidMount() {
    console.log(this.props);
    console.log();

    // for (let k in this.state.orderForm) {
    //   console.log(this.state.orderForm[k].value);
    // }
  }

  // componentWillUnmount() {
  //   this.props.tPrice = 4;
  // }

  orderHandler = (event) => {
    event.preventDefault();
    // this.setState({
    //   spinnerLoading: true,
    // });

    const orderData = {
      ingredients: this.props.ings,
      price: this.props.tPrice,
      customer: {
        name: this.state.orderForm.name.value,
        street: this.state.orderForm.street.value,
        zipCode: this.state.orderForm.postalCode.value,
        country: "Germany",
        email: this.state.orderForm.email.value,
      },
      userId: this.props.userId,
    };

    this.props.onOrderBurger(orderData, this.props.token);

    // axiosOrders
    //   .post("/orders.json", order)
    //   .then((response) => {
    //     this.setState({
    //       spinnerLoading: false,
    //     });
    //     this.props.history.push("/burger-builder");
    //     console.log(response.config.data);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     this.setState({
    //       spinnerLoading: false,
    //     });
    //   });
  };

  inputChangeHandler = (event, inputIdentifier) => {
    // console.log(this.state.orderForm);

    const updatedOrderForm = {
      ...this.state.orderForm,
    };

    updatedOrderForm[inputIdentifier].value = event.target.value;
    updatedOrderForm[inputIdentifier].interactedByUser = true;
    updatedOrderForm[inputIdentifier].valid = this.checkValidity(
      event.target.value,
      updatedOrderForm[inputIdentifier].validation
    );

    let formIsValid = true;

    for (let k in this.state.orderForm) {
      formIsValid = this.state.orderForm[k].valid && formIsValid;
    }

    this.setState({
      orderForm: updatedOrderForm,
      formIsValid: formIsValid,
    });

    console.log(formIsValid);
    // console.log(updatedOrderForm[inputIdentifier]);
  };

  checkValidity = (value, rules) => {
    let isValid = true;

    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    return isValid;
  };

  render() {
    const formElementsArray = [];

    let redirectAfterPurchase = null;

    for (let key in this.state.orderForm) {
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key],
      });
    }

    if (this.props.purchased) {
      console.log("purchased");
      redirectAfterPurchase = <Redirect to="/" />;
    }

    let element = (
      <div className={styles.ContactData}>
        <h4>Enter your data</h4>
        <form onSubmit={this.orderHandler}>
          {formElementsArray.map((formElement) => {
            return (
              <Input
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                isValid={formElement.config.valid}
                changed={(event) => {
                  this.inputChangeHandler(event, formElement.id);
                }}
                interactedByUser={formElement.config.interactedByUser}
              />
            );
          })}

          <h3 style={{ textAlign: "center" }}>
            Price: ${this.props.tPrice.toFixed(2)}
          </h3>
          <Button btnType="Success" disabled={!this.state.formIsValid}>
            ORDER
          </Button>
        </form>
        {redirectAfterPurchase}
      </div>
    );

    if (this.props.spinnerLoading) {
      <Spinner />;
    }

    return element;
  }
}

export default connect(
  (state) => {
    return {
      ings: state.burgerBuilderReducer.ingredients,
      tPrice: state.burgerBuilderReducer.totalPrice,
      purchased: state.orderReducer.purchased,
      spinnerLoading: state.orderReducer.loading,
      token: state.authReducer.token,
      userId: state.authReducer.userId,
    };
  },
  (dispatch) => {
    return {
      onOrderBurger: (orderData, token) =>
        dispatch(purchaseBurger(orderData, token)),
    };
  }
)(withRouter(withErrorHandler(ContactData, axiosOrders)));
