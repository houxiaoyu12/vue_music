import Vue from 'vue'
import Router from 'vue-router'

import Rank from '../components/rank/rank'
import Reacommend from '../components/recommend/recommend'
import Singer from '../components/singer/singer'
import Search from '../components/search/search'
import SingerDetail from '../components/singer-detail/singer-detail'
import Disc from '../components/disc/disc'


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
      component: Reacommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      name: 'Rank',
      path: '/rank',
      component: Rank
    },
    {
      name: 'Singer',
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      name: 'Search',
      path: '/search',
      component: Search
    },
  ]
})
