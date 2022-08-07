import Vue from 'vue';
import Vuex from 'vuex';
import axios from "axios";
import { Types } from "@/constants/store.types";

Vue.use(Vuex);

// Правильнее будет разбить стор на модули,
// в рамках тестового задания это опущено

export default new Vuex.Store({
  state: {
    items: [],
    categories: [],
    popup: null,
    selectedItem: null,
    wallet: 1000,
    loading: false,
    error: null
  },
  getters: {
    [Types.getters.GET_ITEMS]: (state) => state.items,
    [Types.getters.GET_CATEGORIES]: (state) => state.categories,
    [Types.getters.CURRENT_POPUP]: (state) => state.popup,
    [Types.getters.GET_SELECTED_ITEM]: (state) => state.selectedItem,
    [Types.getters.GET_WALLET]: (state) => state.wallet,
    [Types.getters.LOADING]: (state) => state.loading,
    [Types.getters.GET_ERROR]: (state) => state.error,
    [Types.getters.SEARCH_ITEMS]: () => (items, name) => {
      if (!name) return items;
      return items.filter(product => product.name.toLowerCase().includes(name));
    },
    [Types.getters.FILTER_ITEMS]: () => (items, filterBy) => {
      if (!filterBy) return items;
      // Тут поторопился, можно сделать лучше.
      let filterResult;
      const isRevert = filterBy.includes('revert');
      const filterByProperty = filterBy.replace('-revert', '');
      if (filterByProperty.includes('price')) {
        filterResult = items.sort((a, b) => +b[filterByProperty] - +a[filterByProperty]);
      } else {
        filterResult = items.sort((a, b) => compareObjects(a, b, filterByProperty));
      }
      return isRevert ? filterResult.reverse() : filterResult;
    },
    [Types.getters.SORT_ITEMS]: () => (items, sortBy) => {
      if (sortBy.length === 0) return items;
      return items.filter(product => sortBy.includes(product.catid));
    },
  },
  mutations: {
    [Types.mutations.SET_ITEMS](state, payload) {
      state.items = payload;
    },
    [Types.mutations.SET_CATEGORIES](state, payload) {
      state.categories = payload;
    },
    [Types.mutations.OPEN_POPUP](state, payload) {
      state.popup = payload;
    },
    [Types.mutations.CLOSE_POPUP](state) {
      state.popup = null;
    },
    [Types.mutations.SELECT_ITEM](state, payload) {
      state.selectedItem = payload;
    },
    [Types.mutations.CLEAR_SELECTED](state) {
      state.selectedItem = null;
    },
    [Types.mutations.SET_LOADING](state, payload) {
      state.loading = payload;
    },
    [Types.mutations.SET_ERROR](state, payload) {
      state.error = payload;
    },
    [Types.mutations.CLEAR_ERROR](state) {
      state.error = null;
    },
    [Types.mutations.CHANGE_WALLET](state, payload) {
      state.wallet -= +payload;
    },
    [Types.mutations.REMOVE_ITEM](state, itemId) {
      state.items = state.items.filter(item => item.id !== itemId);
    }
  },
  actions: {
    async [Types.actions.FETCH_CATEGORIES]({ commit }, serverId = 26) {
      const { data } = await axios.get(`/api/?section=shop&action=get_categories&serverid=${serverId}&tabid=1`);
      commit(Types.mutations.SET_CATEGORIES, data.result);
      return data.result;
    },
    async [Types.actions.FETCH_ITEMS]({ commit }, serverId = 26) {
      const { data } = await axios.get(`/api/?section=shop&action=get_items&serverid=${serverId}&tabid=1`);
      commit(Types.mutations.SET_ITEMS, data.result);
      return data.result;
    },
    [Types.actions.TRY_TO_BUY]({ getters, dispatch, commit }, summ) {
      commit(Types.mutations.SET_LOADING, true);
      if (getters[Types.getters.GET_WALLET] < summ) {
        const error = { message: 'Недостаточно средств' };
        dispatch(Types.actions.SET_ERROR_TIMEOUT, error);
        commit(Types.mutations.SET_LOADING, false);
        return Promise.reject(error);
      } else {
        commit(Types.mutations.CHANGE_WALLET, summ);
        commit(Types.mutations.SET_LOADING, false);
        return Promise.resolve(getters[Types.getters.GET_WALLET]);
      }
    },
    async [Types.actions.SET_ERROR_TIMEOUT]({ commit }, { message, time = 3000 }) {
      commit(Types.mutations.SET_ERROR, message);
      await setTimeout(() => commit(Types.mutations.CLEAR_ERROR), time);
    }
  },
  modules: {
  }
});

function compareObjects(a, b, property) {
  if (a[property] < b[property]) {
    return -1;
  }
  if (a[property] > b[property]) {
    return 1;
  }
  return 0;
}