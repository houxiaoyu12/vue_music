<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox"  @query="onQueryChange" ></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li @click="addQuery(item.k)" class="item" v-for="(item, index) in hotKey" :key="index">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query"></suggest>
    </div>
  </div>
</template>

<script>
  import SearchBox from '../../base/search-box/search-box'
  import { getHotKey } from '../../api/search'
  import { ERR_OK } from '../../api/config'
  import Suggest from '../../components/suggest/suggest'

  export default {
    data () {
      return {
        hotKey: [],
        query: ''
      }
    },
    created () {
      this._getHotKey()
    },
    methods: {
      addQuery(query) {
        this.$refs.searchBox.setQuery(query)
      },
      onQueryChange(query) {
        this.query = query
      },
      _getHotKey () {
        getHotKey().then((res) => {
          if (res.code === ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 10)
          }
        })
      }
    },
    components: {
      SearchBox,
      Suggest
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  @import "./index.styl"
</style>
