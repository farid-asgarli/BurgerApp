import React, { Component } from "react";
import { connect } from "react-redux";
import * as burgerBuilderActions from "../../store/actions/burgerBuilder";

import Aux from "../../hoc/_Aux/_Aux";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
};

class BurgerBuilder extends Component {
  // constructor(props) {
  //     super(props);
  //     this.state = {...}
  // }
  state = {
    purchasing: false,
    spinnerLoading: false,
  };

  // static getDerivedStateFromProps(props, state) {
  //   return { ingredients: props.favingredients };
  // }

  componentDidMount() {
    console.log("BurgerBuilder", "componentDidMount");
    this.props.initIngredients();
  }

  componentDidUpdate() {
    console.log("BurgerBuilder", "componentDidUpdate");
  }

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map((igKey) => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    return sum > 0;
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients,
    };
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
    this.updatePurchaseState(updatedIngredients);
  };

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) {
      return;
    }
    const updatedCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients,
    };
    updatedIngredients[type] = updatedCount;
    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;
    this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
    this.updatePurchaseState(updatedIngredients);
  };

  purchaseHandler = () => {
    if (this.props.isAuthenticated) {
      this.setState({ purchasing: true });
    } else {
      this.props.history.push("/auth");
    }
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
    //alert("You continue!");

    this.props.history.push({
      pathname: "/checkout",
    });
  };

  render() {
    console.log("BurgerBuilder", "render");

    const disabledInfo = {
      ...this.props.ingreds,
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    // {salad: true, meat: false, ...}

    let summary = null;

    let burger = <Spinner />;

    if (this.props.ingreds) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ingreds} />
          <BuildControls
            ingredientAdded={this.props.addIngredient}
            ingredientRemoved={this.props.removeIngredient}
            disabled={disabledInfo}
            purchasable={this.updatePurchaseState(this.props.ingreds)}
            ordered={this.purchaseHandler}
            price={this.props.totalPrice}
            isAuthenticated={this.props.isAuthenticated}
          />
        </Aux>
      );
      summary = (
        <OrderSummary
          ingredients={this.props.ingreds}
          price={this.props.totalPrice}
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
        />
      );
    }

    if (this.state.spinnerLoading) {
      summary = <Spinner />;
    }
    return (
      <Aux>
        <Modal show={this.props.error} modalClosed={this.props.clearError}>
          {this.props.errorMessage}
        </Modal>
        {burger}
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {summary}
        </Modal>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ingreds: state.burgerBuilderReducer.ingredients,
    totalPrice: state.burgerBuilderReducer.totalPrice,
    error: state.burgerBuilderReducer.error,
    errorMessage: state.burgerBuilderReducer.errorMessage,
    isAuthenticated: state.authReducer.token != null,
    //state is the state we know, burgerBuilderReducer is the slice of one of many reducers we defined in index.js and burgerBuilder.js in reducer folder, so we have to refer to it
    // in order to access the state of it.
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addIngredient: (ingType) =>
      dispatch(burgerBuilderActions.addIngredient(ingType)),
    removeIngredient: (ingType) => {
      dispatch(burgerBuilderActions.removeIngredient(ingType));
    },

    initIngredients: () => dispatch(burgerBuilderActions.initIngredients()),
    clearError: () => dispatch(burgerBuilderActions.clearError()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BurgerBuilder);

//Before Redux

// purchaseContinueHandler = () => {
//   //alert("You continue!");
//   //

//   const queryParams = [];

//   for (let i in this.props.ingreds) {
//     queryParams.push(
//       encodeURIComponent(i) + "=" + encodeURIComponent(this.props.ingreds[i])
//     );
//   }

//   queryParams.push("price=" + this.props.totalPrice.toFixed(2));

//   this.props.history.push({
//     pathname: "/checkout",
//     search: "?" + queryParams.join("&"),
//   });
// };
