import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/city/:insee',
      name: 'city',
      component() {
        return import(/* webpackChunkName: "city" */ './views/City.vue');
      },
    },
    {
      path: '/cities/:search',
      name: 'cities',
      component() {
        return import(/* webpackChunkName: "city" */ './views/Cities.vue');
      },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component() {
        return import(/* webpackChunkName: "about" */ './views/About.vue');
      },
    },
  ],
});
