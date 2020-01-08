<template>
  <scroll class="suggest"
          :data="result"
          :pullup="pullup"
          @scrollToEnd="seacrchMore"
          ref="suggest"
  >
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item, index) of result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore"></loading>
    </ul>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from '../../base/scroll/scroll'
  import Loading from '../../base/loading/loading'
  // import NoResult from 'base/no-result/no-result'
  import { search } from '../../api/search.js'
  import { ERR_OK } from '../../api/config'
  //import {filterSinger} from '../../common/js/song'
  import {mapMutations, mapActions} from 'vuex'
  import Singer from '../../common/js/singer'

  const TYPE_SINGER = 'singer'
  const perpage = 20

  export default {
    props: {
      showSinger: {
        type: Boolean,
        default: true
      },
      query: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        page: 1,
        result: [],
        pullup: true, //scroll组件的下拉参数
        hasMore: true, //是否有更多
      }
    },
    methods: {
      search () {
        this.hasMore = true
        this.$refs.suggest.scrollTo(0, 0)
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this._genResult(res.data)
            this._checkMore(res.data)
          }
        })
      },
      seacrchMore () {
        if (!this.hasMore) {
          return
        }
      },
      getIconCls (item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName (item) {
        if (item.type === TYPE_SINGER) {
          return item.name
        } else {
          return `${item.name}--${item.singer}`
        }
      },
      selectItem(item) {
        const singer = new Singer({
          id: item.id,
          name: item.singer
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      },
      _genResult (data) {
        let ret = []
        if (data.album && data.album.itemlist.length > 0) {
          ret = ret.concat(data.album.itemlist)
        }
        if (data.mv && data.mv.itemlist.length > 0) {
          ret = ret.concat(data.mv.itemlist)
        }
        if (data.singer && data.singer.itemlist.length > 0) {
          ret = ret.concat(data.singer.itemlist)
        }
        if (data.song && data.song.itemlist.length > 0) {
          ret = ret.concat(data.song.itemlist)
        }
        return ret
      },
      _checkMore (data) {
        const song = data.song
        if (song.itemlist.length > 0) {
          this.hasMore = false
        }
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    watch: {
      query (newQuery) {
        this.search(newQuery)
      }
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  @import "./index.styl"
</style>