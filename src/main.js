import Vue from 'vue';
import Vuetify from 'vuetify';
import Web3Check, { ACTIONS } from 'vue-web3-check';
import VueWait from 'vue-wait';
import App from './App.vue';
import router from './router';
import * as config from './config';
import * as filters from './utils/filters';
import IconLink from './components/common/IconLink';
import 'vuetify/dist/vuetify.min.css';

Vue.config.productionTip = false;

Vue.use(Vuetify);

Web3Check.store.on('update', data => {
  if (
    (data.state.old.account !== null && data.action === ACTIONS.UPD_ACCOUNT) ||
    (data.state.old.networkId !== null &&
      data.action === ACTIONS.UPD_NETWORK_ID)
  ) {
    window.location.reload(false);
  }
});
Vue.use(Web3Check, {
  Web3,
  networks: [config.CHAIN_ID],
  requireAccount: true
});

Vue.use(VueWait);
Vue.filter('fromWei', filters.fromWei);
Vue.component('IconLink', IconLink);

new Vue({
  router,
  wait: new VueWait(),
  render: h => h(App)
}).$mount('#app');
