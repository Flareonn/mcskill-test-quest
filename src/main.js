import Vue from 'vue';
import App from './App.vue';
import store from './store';

Vue.config.productionTip = false;
import "@/theme/index.sass";
import { Types } from './constants/store.types';

store.dispatch(Types.actions.FETCH_ITEMS);
store.dispatch(Types.actions.FETCH_CATEGORIES);

new Vue({
  store,
  render: h => h(App)
}).$mount('#app');