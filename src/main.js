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
import SearchRoutes from './components/SearchRoutes.vue';
import ReserveRoute from './components/ReserveRoute.vue';
import MyReservations from './components/MyReservations.vue';
import RouteDetails from './components/RouteDetails.vue'; // 添加这一行

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
  { path: '/search-routes', component: SearchRoutes, name: 'SearchRoutes' },
  { path: '/reserve-route/:routeId/:scheduleId', component: ReserveRoute, name: 'ReserveRoute' },
  { path: '/search', component: SearchResults, name: 'SearchResults' },
  { path: '/my-reservations', component: MyReservations, name: 'MyReservations' },
  { path: '/route-details/:routeId', component: RouteDetails, name: 'RouteDetails' }
];

const router = new VueRouter({
  routes
});

new Vue({
  render: h => h(App),
  router
}).$mount('#app');