<!--歌手详情页面-->
<template>
  <div class="singer-detail"></div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from "../../api/singer";
  import {ERR_OK} from "../../api/config";
  import {createSong} from "../../common/js/song";//调用封装的方法

  export default {
    data() {
      return {
        songs: []
      }
    },
    computed: {
      ...mapGetters(['singer'])
    },
    created() {
      this._getDetail()
    },
    methods: {
      _getDetail() {
        if(!this.singer.id){
          this.$router.push('/singer');
          return
        }
        getSingerDetail(this.singer.id).then((res) => {
          if(res.code === ERR_OK){
            //console.log(res.data.list);
            this.songs = this._normalizeSongs(res.data.list)
            console.log(this.songs)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = [];
        list.forEach((item) => {
          let {musicData} = item;
          if(musicData.songid && musicData.albumid){
            ret.push(createSong(musicData))
          }
        });
        return ret
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .singer-detail
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $color-background
    animation: show 0.2s linear;

    @keyframes show {
      0% {
        transform: translate(100%, 0%);
      }
      100% {
        transform: translate(0%, 0%);
      }
    }

  /*.slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)*/
</style>
