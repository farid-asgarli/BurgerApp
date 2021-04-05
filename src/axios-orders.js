const { default: axios } = require("axios");

const axiosOrders = axios.create();

axiosOrders.defaults.baseURL =
  "https://react-app-c00d5-default-rtdb.firebaseio.com/";

export default axiosOrders;
