import * as actionTypes from "../actions/actionTypes";

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
};

const initialState = {
  ingredients: null,
  totalPrice: 4,
  purchasable: false,
  error: false,
  errorMessage: null,
  buildingBurger: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: {
          ...state.ingredients,
          [action.ingredientName]: state.ingredients[action.ingredientName] + 1,
        },
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
        buildingBurger: true,
      };
    case actionTypes.REMOVE_INGREDIENT:
      return {
        ...state,
        ingredients: {
          ...state.ingredients,
          [action.ingredientName]:
            state.ingredients[action.ingredientName] > 0
              ? state.ingredients[action.ingredientName] - 1
              : state.ingredients[action.ingredientName],
        },
        totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName],
        buildingBurger: true,
      };
    case actionTypes.SET_INGREDIENTS:
      return {
        ...state,
        error: false,
        errorMessage: null,
        ingredients: action.ingredients,
        totalPrice: 4,
      };
    case actionTypes.FETCH_INGREDIENTS_FAILED:
      return {
        ...state,
        error: true,
        errorMessage: action.error,
      };
    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: false,
      };
    case actionTypes.RESET_BUILDING_STATUS:
      return {
        ...state,
        buildingBurger: false,
      };
    default:
      break;
  }
  return state;
};

export default reducer;
