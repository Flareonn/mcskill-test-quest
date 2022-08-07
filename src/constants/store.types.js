export const Types = {
  mutations: {
    SET_ITEMS: "setItems",
    SET_CATEGORIES: "setCategories",
    OPEN_POPUP: "setPopup",
    CLOSE_POPUP: "clearPopup",
    SELECT_ITEM: "selectItem",
    SET_LOADING: "setLoading",
    SET_ERROR: "setError",
    CLEAR_ERROR: "clearError",
    CHANGE_WALLET: "changeWallet",
    CLEAR_SELECTED: "clearSelected",
    REMOVE_ITEM: "removeItem",
  },
  actions: {
    FETCH_CATEGORIES: "fetchCategories",
    FETCH_ITEMS: "fetchItems",
    TRY_TO_BUY: "tryToBuy",
    SET_ERROR_TIMEOUT: 'setErrorTimeout'
  },
  getters: {
    GET_ITEMS: "items",
    GET_CATEGORIES: "categories",
    GET_SELECTED_ITEM: "getSelectedItem",
    CURRENT_POPUP: "popup",
    GET_WALLET: "wallet",
    LOADING: "loading",
    GET_ERROR: "error",
    SEARCH_ITEMS: "searchItems",
    FILTER_ITEMS: "filterItems",
    SORT_ITEMS: "sortItems",
  }
};