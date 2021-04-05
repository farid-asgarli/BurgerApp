import React, { Component } from "react";
import CheckoutSummary from "../../components/Order/CheckoutSummary/CheckoutSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import { Route } from "react-router-dom";
import ContactData from "./ContactData/ContactData";

import { connect } from "react-redux";
import { purchaseBurgerFinished } from "../../store/actions/order";

class Checkout extends Component {
  checkOutContinue = () => {
    this.props.history.replace("/checkout/contact-data");
  };

  checkOutCancel = () => {
    this.props.history.goBack();
  };

  componentWillUnmount() {
    this.props.onPurchaseFinished();
  }

  render() {
    let checkoutSummary = <Spinner />;

    if (this.props.ingreds) {
      checkoutSummary = (
        <div>
          <CheckoutSummary
            checkOutContinue={this.checkOutContinue}
            checkOutCancel={this.checkOutCancel}
            ingredients={this.props.ingreds}
          />
          <Route
            path={this.props.match.path + "/contact-data"}
            render={() => (
              <ContactData
                ingredients={this.props.ingreds}
                totalPrice={this.props.totalPrice}
              />
            )}
          />
        </div>
      );
    }

    return checkoutSummary;
  }
}

export default connect(
  (state) => {
    return {
      ingreds: state.burgerBuilderReducer.ingredients,
      totalPrice: state.burgerBuilderReducer.totalPrice,
    };
  },
  (dispatch) => {
    return {
      onPurchaseFinished: () => dispatch(purchaseBurgerFinished()),
    };
  }
)(Checkout);

//Before Redux

//  componentDidMount() {
//     const query = new URLSearchParams(this.props.location.search);
//     const ingredients = {};
//     let price = 0;

//     for (let param of query.entries()) {
//       if (!(param[0] === "price")) {
//         ingredients[param[0]] = +param[1];
//       } else {
//         price = param[1];
//       }
//     }

//     this.setState({
//       ingredients: ingredients,
//       totalPrice: price,
//     });

//     console.log(ingredients);
//   }
