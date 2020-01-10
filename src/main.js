// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios'
import store from './stores';
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';
//保存下 试试  需要重新 运行吗 不用
import { Button ,Picker,Toast,Swipe, SwipeItem,NoticeBar,NumberKeyboard,Dialog,Popup} from 'vant';

import VueClipboard from 'vue-clipboard2';

Vue.use(VueClipboard);
Vue.use(NoticeBar);
Vue.use(Button,Picker,Toast,);
Vue.use(Popup);
Vue.use(NumberKeyboard,);
Vue.use(Dialog);
Vue.use(Swipe).use(SwipeItem);//轮播图
Vue.config.productionTip = false;

Vue.use(Mint);
axios.defaults.withCredentials = true; //让ajax携带cookie
Vue.prototype.$axios = axios;

Vue.prototype.$bus = new Vue({
  data: {
    api: 'DEV',//ONLINE DEV
    base_domain: "/api", // 测试
    // base_domain: "https://ffapi.myfastapi.com",     , http://cdtest.kongniu.cn// //线上
  }
})



import Loading from '@/components/Loading.vue'
Vue.component('Loading', Loading)
Vue.prototype.a = 10;

/* eslint-disable no-new */

new Vue({
  router,
  store,
  render: h => ( < App / > ),

}).$mount('#app')
