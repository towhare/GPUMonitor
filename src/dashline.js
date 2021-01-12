import Vue from 'vue';
import DashLine from './dashline.vue';
import './css/index.css';
import 'vant/lib/index.css';
import { Switch } from 'vant';

Vue.use(Switch);
new Vue({
	el: '#app',
	render: h => h(DashLine)
});
