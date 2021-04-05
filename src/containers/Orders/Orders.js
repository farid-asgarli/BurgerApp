import React from "react";
import styles from "./Orders.module.css";
import Order from "../../components/Order/Order";
import axiosOrders from "../../axios-orders";
import withErrorHandler from "../../hoc/withErrorHandler/WithErrorHandler";
import Spinner from "../../components/UI/Spinner/Spinner";
import { connect } from "react-redux";
import * as actions from "../../store/actions/order";

class Orders extends React.Component {
  componentDidMount() {
    this.props.onFetchingOrders(this.props.token, this.props.userId);
  }

  render() {
    let element = <Spinner />;

    if (!this.props.token) {
      element = (
        <h1 style={{ textAlign: "center" }}>
          Sorry, but you are not authorized.
        </h1>
      );
    }

    if (this.props.orders && this.props.token != null) {
      element = this.props.orders.map((ord) => {
        return (
          <Order
            data={ord}
            key={ord.id}
            deleteHandler={this.props.onDeleteOrder}
          />
        );
      });
    }
    return <div className={styles.Orders}>{element}</div>;
  }
}

export default connect(
  (state) => {
    return {
      orders: state.orderReducer.orders,
      errorMesssage: state.orderReducer.errorMessage,
      token: state.authReducer.token,
      userId: state.authReducer.userId,
    };
  },
  (dispatch) => {
    return {
      onFetchingOrders: (token, userId) =>
        dispatch(actions.fetchOrders(token, userId)),
      onDeleteOrder: (id) => dispatch(actions.deleteSingleOrderHandle(id)),
    };
  }
)(withErrorHandler(Orders, axiosOrders));
