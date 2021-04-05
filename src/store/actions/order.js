import * as actionTypes from "./actionTypes";
import axios from "axios";
import axiosOrders from "../../axios-orders";

export const purchaseBurgerSuccess = (id, orderData) => {
  return {
    type: actionTypes.PURCHASE_BURGER_SUCCESS,
    orderId: id,
    orderData: orderData,
  };
};

export const purchaseBurgerFail = (error) => {
  return {
    type: actionTypes.PURCHASE_BURGER_FAIL,
    error: error,
  };
};

export const purchaseBurger = (orderData, token) => {
  return (dispatch) => {
    dispatch(purchaseBurgerStart());
    axios
      .post(
        "https://react-app-c00d5-default-rtdb.firebaseio.com/orders.json?auth=" +
          token,
        orderData
      )
      .then((response) => {
        console.log(response.data);
        dispatch(purchaseBurgerSuccess(response.data.name, orderData));
      })
      .catch((error) => {});
  };
};

export const purchaseBurgerStart = () => {
  return {
    type: actionTypes.PURCHASE_BURGER_START,
  };
};

export const purchaseBurgerFinished = () => {
  return {
    type: actionTypes.PURCHASE_BURGER_FINISHED,
  };
};

export const fetchOrdersSuccess = (orders) => {
  return {
    type: actionTypes.FETCH_ORDERS_SUCCESS,
    orders: orders,
  };
};

export const fetchOrdersFail = (error) => {
  return {
    type: actionTypes.FETCH_INGREDIENTS_FAILED,
    errorMessage: error.message,
  };
};

export const fetchOrdersStart = () => {
  return {
    type: actionTypes.FETCH_ORDERS_START,
  };
};

export const fetchOrders = (token, userId) => {
  return (dispatch) => {
    dispatch(fetchOrdersStart());
    axiosOrders
      .get(
        '/orders.json?auth=' +
          token +
          '&orderBy="userId"&equalTo="' + //this syntax belongs to firebase only, not something depending on the react knowledge
          userId +
          '"'
      )
      .then((res) => {
        const fetchOrders = [];

        for (let key in res.data) {
          fetchOrders.push({ id: key, ...res.data[key] });
        }

        dispatch(fetchOrdersSuccess(fetchOrders));
      })
      .catch((error) => {
        dispatch(fetchOrdersFail(error));
      });
  };
};

export const deleteSingleOrderReceiveId = (id) => {
  return {
    type: actionTypes.DELETE_SINGLE_ORDER,
    orderId: id,
  };
};

export const deleteSingleOrderHandle = (id) => {
  return (dispatch, getState) => {
    axiosOrders
      .delete("/orders/" + id + ".json?auth=" + getState().authReducer.token)
      .then((res) => {
        console.log(res);
        dispatch(deleteSingleOrderReceiveId(id));
      })
      .catch((error) => {
        console.log(error);
      });
  };
};
