import React, { Component } from "react";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import styles from "./Auth.module.css";
import * as actions from "../../store/actions/auth";
import { connect } from "react-redux";
import Spinner from "../../components/UI/Spinner/Spinner";
import { Redirect } from "react-router-dom";

class Auth extends Component {
  state = {
    controls: {
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
      password: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "Password",
        },
        value: "",
        validation: {
          required: true,
          minLength: 6,
        },
        valid: false,
        interactedByUser: false,
      },
    },
    formIsValid: false,
    isSignIn: false,
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

  inputChangeHandler = (event, inputIdentifier) => {
    // console.log(this.state.orderForm);

    const updatedOrderForm = {
      ...this.state.controls,
    };

    updatedOrderForm[inputIdentifier].value = event.target.value;
    updatedOrderForm[inputIdentifier].interactedByUser = true;
    updatedOrderForm[inputIdentifier].valid = this.checkValidity(
      event.target.value,
      updatedOrderForm[inputIdentifier].validation
    );

    let formIsValid = true;

    for (let k in this.state.controls) {
      formIsValid = this.state.controls[k].valid && formIsValid;
    }

    this.setState({
      controls: updatedOrderForm,
      formIsValid: formIsValid,
    });

    console.log(formIsValid);
    // console.log(updatedOrderForm[inputIdentifier]);
  };

  componentDidMount() {
    if (this.props.buildingBurger) {
      this.props.onRedirect("/checkout");
    }
  }

  submitHandler = (e) => {
    e.preventDefault();
    this.props.onAuth(
      this.state.controls.email.value,
      this.state.controls.password.value,
      this.state.isSignIn
    );
  };

  switchViewHandler = () => {
    this.setState({
      isSignIn: !this.state.isSignIn,
    });
  };

  render() {
    const formElementsArray = [];

    for (let key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key],
      });
    }

    let error = null;

    let redirectAfterAuth = null;

    if (this.props.error) {
      switch (this.props.error) {
        case "INVALID_PASSWORD":
          error = "The password is invalid.";
          break;
        case "EMAIL_EXISTS":
          error = " Email already registered.";
          break;
        default:
          break;
      }
    }

    if (this.props.hasLoggedIn) {
      console.log("this.props.redirectPath", this.props.redirectPath);
      redirectAfterAuth = <Redirect to={this.props.redirectPath} />;
    }

    let element = (
      <React.Fragment>
        {redirectAfterAuth}
        <div className={styles.Auth}>
          <h1 style={{ textAlign: "center" }}>
            {this.state.isSignIn ? "Login" : "Register"}
          </h1>
          <div>
            <p style={{ textAlign: "center", color: "red" }}>{error}</p>
          </div>
          <form onSubmit={this.submitHandler}>
            {" "}
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
            <Button btnType="Success" disabled={!this.state.formIsValid}>
              Submit
            </Button>
          </form>
          <Button clicked={this.switchViewHandler} btnType="Danger">
            {this.state.isSignIn ? "Sign up" : "Already have an account? Login"}
          </Button>
        </div>
      </React.Fragment>
    );

    if (this.props.loading) {
      element = <Spinner />;
    }

    return element;
  }
}

export default connect(
  (state) => {
    return {
      loading: state.authReducer.loading,
      error: state.authReducer.error,
      hasLoggedIn: state.authReducer.token != null,
      redirectPath: state.authReducer.redirectPath,
      buildingBurger: state.burgerBuilderReducer.buildingBurger,
    };
  },
  (dispatch) => {
    return {
      onAuth: (email, password, isSignIn) =>
        dispatch(actions.auth(email, password, isSignIn)),
      onRedirect: (path) => dispatch(actions.redirectTo(path)),
    };
  }
)(Auth);
