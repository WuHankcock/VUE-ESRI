import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import 'babel-polyfill';

Vue.use(ElementUI);

new Vue({
  el: '#app',
  render: h => h(App)
})
