import Vue from 'vue'
import Router from 'vue-router'

import Rank from '../components/rank/rank'
import Reacommend from '../components/recommend/recommend'
import Singer from '../components/singer/singer'
import Search from '../components/search/search'


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      name: 'Reacommend',
      path: '/recommend',
      component: Reacommend
    },
    {
      name: 'Rank',
      path: '/rank',
      component: Rank
    },
    {
      name: 'Singer',
      path: '/singer',
      component: Singer
    },
    {
      name: 'Search',
      path: '/search',
      component: Search
    },
  ]
})
