<template>
  <div>
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item, index) of result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  // import Scroll from 'base/scroll/scroll'
  // import Loading from 'base/loading/loading'
  // import NoResult from 'base/no-result/no-result'
  import {search} from '../../api/search.js'
  import {ERR_OK} from '../../api/config'
  import {filterSinger} from '../../common/js/song'
  // import {mapMutations, mapActions} from 'vuex'
  // import Singer from '../../common/js/singer'

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
    data() {
      return{
        page: 1,
        result: [],
      }
    },
    methods: {
      search() {
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          console.log('hxy',this.query)
          if (res.code === ERR_OK) {
            console.log(res.data)
            this.result = this._genResult(res.data)
            //this._checkMore(res.data)
          }
        })
      },
      getIconCls(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName(item) {
        if (item.type ===TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.songname}-${filterSinger(item.singer)}`
        }
      },
      _genResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(data.song.list)
        }
      }
    },
    watch: {
      query (newQuery) {
        this.search(newQuery)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  @import "./index.styl"
</style>