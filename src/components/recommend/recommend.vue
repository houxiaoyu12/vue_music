<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <slider>
            <div v-for="(item, index) in recommends" :keys="index">
              <a :href="item.linkUrl">
                <img class="needsclick" @load="loadImage" :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li @click="selectItem(item)" class="item" v-for="(item, i) in discList" :keys="i">
              <div class="icon">
                <img v-lazy="item.imgurl">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading/>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
  import Loading from '../../base/loading/loading'
  import Scroll from '../../base/scroll/scroll'
  import {getRecommend,getDiscList} from "../../api/recomend"
  import Slider from '../../base/slider/slider'
  import {ERR_OK} from "../../api/config";
  import {playlistMixin} from '../../common/js/mixin'
  import {mapMutations} from 'vuex'

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        recommends: [],
        discList: []
      }
    },
    created() {
      //获取轮播图的数据
      this._getRecommend();
      //获取歌单列表
      this._getDiscList();
    },
    methods: {
      handlePlaylist(playList) {
        const bottom = playList.length > 0 ? '60px' : ''
        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      selectItem(item) {
        console.log(item.dissid)
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
        this.setDisc(item)
      },
      _getRecommend() {
        getRecommend().then((res) => {
          if(res.code === ERR_OK){
            this.recommends = res.data.slider
          }
        })
      },
      _getDiscList() {
        getDiscList().then((res) => {
          if(res.code === ERR_OK){
            this.discList = res.data.list
          }
        })
      },
      loadImage() {
        if(!this.checkLoaded){//只调用一次refresh方法
          this.$refs.scroll.refresh();
          this.checkLoaded = true;
        }
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    },
    components: {
      Slider,
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
	@import "./index.styl"
</style>
