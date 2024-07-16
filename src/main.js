import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import HomePage from './components/HomePage.vue';
import LoginPage from './components/LoginPage.vue';
import RegisterPage from './components/RegisterPage.vue';
import AttractionDetail from './components/AttractionDetail.vue';
import ProfilePage from './components/ProfilePage.vue';
import FrequentTravelersPage from './components/FrequentTravelersPage.vue';
import FavoritesPage from './components/FavoritesPage.vue';
import AddTravelRoute from './components/AddTravelRoute.vue';
import SetRouteAttractions from './components/SetRouteAttractions.vue';
import SetRouteDates from './components/SetRouteDates.vue';
import SearchResults from './components/SearchResults.vue';
import RouteManagementPage from './components/RouteManagementPage.vue';
import RouteDetails from './components/RouteDetails.vue';
import SearchRoutes from './components/SearchRoutes.vue';

Vue.config.productionTip = false;

Vue.use(VueRouter);

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/attractions/:id', component: AttractionDetail, name: 'AttractionDetail' },
  { path: '/profile', component: ProfilePage },
  { path: '/frequent-travelers', component: FrequentTravelersPage },
  { path: '/favorites', component: FavoritesPage },
  { path: '/add-travel-route', component: AddTravelRoute },
  { path: '/set-route-attractions/:routeId', component: SetRouteAttractions, name: 'SetRouteAttractions' },
  { path: '/set-route-dates/:routeId', component: SetRouteDates, name: 'SetRouteDates' },
  { path: '/route-management', component: RouteManagementPage, name: 'RouteManagementPage' },
  { path: '/route-details/:routeId', component: RouteDetails, name: 'RouteDetails' },
  { path: '/search', component: SearchResults, name: 'SearchResults' },
  { path: '/search-routes', component: SearchRoutes, name: 'SearchRoutes' }
];

const router = new VueRouter({
  routes
});

new Vue({
  render: h => h(App),
  router
}).$mount('#app');
