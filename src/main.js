import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import HomePage from './components/HomePage.vue';
import LoginPage from './components/LoginPage.vue';
import RegisterPage from './components/RegisterPage.vue';
import AttractionDetail from './components/AttractionDetail.vue';
import SearchResults from './components/SearchResults.vue';
import ProfilePage from './components/ProfilePage.vue';
import FrequentTravelersPage from './components/FrequentTravelersPage.vue';

Vue.config.productionTip = false;

Vue.use(VueRouter);

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/attractions/:id', component: AttractionDetail },
  { path: '/search', name: 'SearchResults', component: SearchResults },
  { path: '/profile', component: ProfilePage },
  { path: '/frequent-travelers', component: FrequentTravelersPage }
];

const router = new VueRouter({
  routes
});

new Vue({
  render: h => h(App),
  router
}).$mount('#app');
