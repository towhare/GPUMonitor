import Vue from 'vue';
import App from './App.vue';
import './css/index.css';
import 'vant/lib/index.css';
import { Switch } from 'vant';

Vue.use(Switch);
new Vue({
	el: '#app',
	render: h => h(App)
});
